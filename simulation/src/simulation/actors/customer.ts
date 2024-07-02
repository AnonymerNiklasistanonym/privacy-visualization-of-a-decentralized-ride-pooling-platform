/* eslint-disable max-classes-per-file */

// Package imports
import {latLngToCell} from 'h3-js';
import {randomInt} from 'node:crypto';
// Local imports
import {ParticipantPerson} from './participant';
// > Globals
import {h3Resolution} from '../../globals/defaults/h3';
// > Libs
import {wait} from '../../lib/wait';
// > Misc
import {
  getRandomElement,
  getRandomFloatFromInterval,
  getRandomIntFromInterval,
} from '../../misc/helpers';
// Type imports
import type {Coordinates} from '../../globals/types/coordinates';
import type {Simulation} from '../simulation';
import type {SimulationEndpointParticipantInformationCustomer} from '../../globals/types/simulation';
import type {SimulationTypeCustomer} from './participant';

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
      const maxWaitingTime = 15 * 1000;
      this.rideRequest = randMatchService.postRequestRide(
        pseudonym,
        latLngToCell(
          this.currentLocation.lat,
          this.currentLocation.long,
          h3Resolution
        ),
        latLngToCell(dropoffLocation.lat, dropoffLocation.long, h3Resolution),
        this.getRating(),
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
      this.status = 'wait for ride request signature';
      // 3. Wait for the MS to determine the winning bid
      const waitingTimeSignatureStart = performance.now();
      while (
        randMatchService.getRideRequest(this.rideRequest).auctionStatus !==
          'closed' &&
        randMatchService.getRideRequest(this.rideRequest).auctionStatus !==
          'waiting-for-signature'
      ) {
        await wait(1 * 1000);
        this.status = `wait for ride request signature (${Math.round(
          (performance.now() - waitingTimeSignatureStart) / 1000
        )}/${Math.round(maxWaitingTime / 1000)}s)`;
      }
      if (
        randMatchService.getRideRequest(this.rideRequest).auctionStatus !==
        'closed'
      ) {
        this.logger.warn('customer ride request auction was closed');
        this.status = 'ride request auction was closed';
        continue;
      }
      // 4. Accept auction result from MS
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
      // 5. Be part of the ride and wait until the ride is over
      const waitingTimeArrivalStart = performance.now();
      this.status = 'wait for ride provider to arrive';
      while (
        randMatchService.getRideRequest(this.rideRequest)
          .helperRideProviderArrived !== true
      ) {
        await wait(1 * 1000);
        this.status = `wait for ride provider to arrive (${Math.round(
          (performance.now() - waitingTimeArrivalStart) / 1000
        )}/${Math.round(
          winningBid.estimatedArrivalTime.getTime() - waitingTimeArrivalStart
        )}s)`;
      }
      this.passenger = rideRequestInfo.auctionWinner;
      this.status = 'ride to dropoff location';
      await this.moveToLocation(simulation, dropoffLocation, true);
      // > Rate the driver
      simulation.blockchain.rateParticipantRideContract(
        contractAddress,
        pseudonym,
        Math.max(randomInt(3), randomInt(4), randomInt(5))
      );
      // 6. Stay idle for a random duration
      this.status = 'idle';
      await wait(getRandomIntFromInterval(1, 20) * 1000);
    }
    this.status =
      'not running any more' +
      (badRouteCounter >= 10 ? ' (stopped because of a bad location)' : '');
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
