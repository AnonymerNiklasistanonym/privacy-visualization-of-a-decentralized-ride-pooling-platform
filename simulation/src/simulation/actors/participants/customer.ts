// Package imports
import {latLngToCell} from 'h3-js';
import {randomInt} from 'crypto';
// Local imports
import {ParticipantPerson} from '../participant';
// > Globals
import {constants} from 'lib_globals';
// > Libs
import {wait} from '../../../lib/wait';
// > Misc
import {
  getRandomElement,
  getRandomFloatFromInterval,
  getRandomIntFromInterval,
} from '../../../misc/helpers';
// Type imports
import type {
  Coordinates,
  SimulationEndpointParticipantInformationCustomer,
} from 'lib_globals';
import type {Simulation} from '../../simulation';
import type {SimulationTypeCustomer} from '../participant';

export class Customer extends ParticipantPerson<SimulationTypeCustomer> {
  // Private properties

  private rideRequest: string | undefined = undefined;

  private passenger: string | undefined = undefined;

  constructor(
    id: string,
    fullName: string,
    gender: string,
    dateOfBirth: string,
    emailAddress: string,
    phoneNumber: string,
    homeAddress: string,
    currentLocation: Coordinates,
    privateKey: string,
    publicKey: string
  ) {
    super(
      id,
      'customer',
      currentLocation,
      privateKey,
      publicKey,
      fullName,
      gender,
      dateOfBirth,
      emailAddress,
      phoneNumber,
      homeAddress
    );
  }

  async run(simulation: Simulation): Promise<void> {
    this.logger.debug('run');
    // Setup:
    // 1. Register to a random AS
    this.status = 'register to AS';
    const randAuthService = getRandomElement(simulation.authenticationServices);
    randAuthService.getRegisterCustomer(
      this.id,
      this.fullName,
      this.gender,
      this.dateOfBirth,
      this.emailAddress,
      this.phoneNumber,
      this.homeAddress
    );
    this.registeredAuthService = randAuthService;
    if (this.registeredAuthService === null) {
      this.status = 'no registered auth server';
      throw Error('No registered auth server!');
    }
    // Loop:
    let badRouteCounter = 0;
    let maxWaitingTimeCounter = 0;
    while (simulation.state === 'RUNNING') {
      // If no route is found multiple times disable customer
      if (badRouteCounter >= 10) {
        this.status = 'more than 10 bad routes';
        break;
      }
      this.status = 'determining target location';
      this.rideRequest = undefined;
      this.passenger = undefined;
      // 1. Authenticate to the platform via AS
      this.status = 'verify to AS';
      const pseudonym = randAuthService.getVerify(this.id);
      // 2. Request ride to a random location via a random MS
      this.status = 'calculate dropoff location route';
      const dropoffLocation = getRandomElement(simulation.availableLocations);
      const dropoffLocationRoute = await this.getRoute(
        simulation,
        dropoffLocation,
        'dropoff location'
      );
      if (dropoffLocationRoute === null) {
        badRouteCounter++;
        this.logger.warn('No route to dropoff location was found!', {
          badRouteCounter,
          currentLocation: this.currentLocation,
          dropoffLocation,
        });
        continue;
      }
      badRouteCounter = 0;
      this.status = 'find MS';
      const randMatchService = getRandomElement(simulation.matchingServices);
      this.status = 'post ride request to MS';
      const maxWaitingTime = (5 + maxWaitingTimeCounter * 5) * 1000;
      this.rideRequest = randMatchService.postRequestRide(
        pseudonym,
        latLngToCell(
          this.currentLocation.lat,
          this.currentLocation.long,
          constants.h3.h3Resolution
        ),
        latLngToCell(
          dropoffLocation.lat,
          dropoffLocation.long,
          constants.h3.h3Resolution
        ),
        this.getRating(simulation),
        this.publicKey,
        maxWaitingTime,
        getRandomFloatFromInterval(3, 4.5),
        getRandomFloatFromInterval(3, 4.5),
        getRandomIntFromInterval(0, 4),
        {...this.currentLocation, address: 'current customer location'},
        {
          address: dropoffLocation.name,
          lat: dropoffLocation.lat,
          long: dropoffLocation.long,
        }
      );
      try {
        // 3. Wait until auction is done
        this.status = 'wait for auction to close';
        const waitingTimeAuctionStart = randMatchService
          .getRideRequest(this.rideRequest)
          .auctionStartedTimestamp.getTime();
        while (
          randMatchService.getRideRequest(this.rideRequest).auctionStatus ===
            'open' ||
          randMatchService.getRideRequest(this.rideRequest).auctionStatus ===
            'determining-winner'
        ) {
          await wait(1 * 1000);
          this.status = `wait for auction to close (${Math.round(
            (new Date().getTime() - waitingTimeAuctionStart) / 1000
          )}/${Math.round(maxWaitingTime / 1000)}s)`;
        }
        // 4. Wait for the ride provider to signature
        if (
          randMatchService.getRideRequest(this.rideRequest).auctionStatus ===
            'closed' ||
          randMatchService.getRideRequest(this.rideRequest).auctionStatus !==
            'waiting-for-signature'
        ) {
          this.logger.warn('customer ride request auction was closed');
          this.status = 'ride request auction was closed';
          maxWaitingTimeCounter++;
          continue;
        } else {
          maxWaitingTimeCounter = 0;
        }
      } catch (err) {
        this.logger.warn(
          'customer ride request auction was closed',
          (err as Error).message
        );
        this.status = 'ride request auction was closed';
        maxWaitingTimeCounter++;
        continue;
      }
      // 5. Accept auction result from MS
      // Create a ride contract through the contract factory that contains the maximum ride cost as a deposit
      // They then need to use the GET setContractAddress/:rideRequestId/:contractAddress endpoint to update their ride request with the contacts address on the blockchain
      // As the creation of the contract is understood as the initial signing of the ride contract, the status of the auction changes from 'waiting-for-signature' to 'closed'.
      this.status = 'create ride contract on blockchain';
      const rideRequestInfo = randMatchService.getRideRequest(this.rideRequest);
      if (rideRequestInfo.auctionWinner === null) {
        this.logger.warn('customer ride request auction winner was null');
        continue;
      }
      const winningBid = rideRequestInfo.bids.find(
        a => a.rideProviderPseudonym === rideRequestInfo.auctionWinner
      );
      if (winningBid === undefined) {
        this.logger.warn(
          'customer ride request auction winner bid was undefined'
        );
        continue;
      }
      const contractAddress = simulation.blockchain.createRideContract(
        pseudonym,
        rideRequestInfo.auctionWinner,
        getRandomIntFromInterval(5, 20)
      );
      // Check: Contacts Ride Provider
      randMatchService.getSetContractAddress(this.rideRequest, contractAddress);
      // 6. Be part of the ride and wait until the ride is over
      const waitingTimeArrivalStart = performance.now();
      const waitingTimeArrivalStartD = new Date().getTime();
      this.status = 'wait for ride provider to arrive';
      while (
        simulation.blockchain.getRideContract(contractAddress)
          .rideProviderArrived !== true
      ) {
        await wait(1 * 1000);
        this.status = `wait for ride provider to arrive (${Math.round(
          (performance.now() - waitingTimeArrivalStart) / 1000
        )}/${Math.round(
          (winningBid.estimatedArrivalTime.getTime() -
            waitingTimeArrivalStartD) /
            1000
        )}s)`;
      }
      this.passenger = rideRequestInfo.auctionWinner;
      await this.moveToLocation(simulation, dropoffLocation, true, 'dropoff');
      // > Rate the driver
      simulation.blockchain.rateParticipantRideContract(
        contractAddress,
        pseudonym,
        Math.max(randomInt(3), randomInt(4), randomInt(5))
      );
      // 7. Stay idle for a random duration
      this.status = 'idle';
      await wait(getRandomIntFromInterval(1, 20) * 1000);
    }
    this.status = 'not running any more';
    this.logger.info(this.status, {simulationState: simulation.state});
    if (badRouteCounter >= 10) {
      this.status += ' (stopped because of too many bad location)';
      this.logger.warn(this.status, {badRouteCounter});
    }
  }

  get endpointCustomer(): SimulationEndpointParticipantInformationCustomer {
    return {
      ...this.endpointParticipantPerson,
      type: 'customer',

      // Ride requests
      rideRequest: this.rideRequest,

      // Passenger
      passenger: this.passenger,
    };
  }

  get json(): SimulationTypeCustomer {
    return {
      ...this.endpointParticipantPerson,
      type: 'customer',

      // Ride request details
      passenger: this.passenger,
      rideRequest: this.rideRequest,
    };
  }
}
