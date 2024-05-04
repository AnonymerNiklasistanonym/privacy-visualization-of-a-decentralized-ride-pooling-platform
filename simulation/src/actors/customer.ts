/* eslint-disable max-classes-per-file */

// Package imports
import {latLngToCell} from 'h3-js';
// Local imports
import {
  getRandomElement,
  getRandomFloatFromInterval,
  getRandomIntFromInterval,
} from '../misc/helpers';
import {Participant} from './participant';
import {h3Resolution} from '../globals/defaults/h3';
import {wait} from '../misc/wait';
// Type imports
import type {Coordinates} from '../globals/types/coordinates';
import type {Simulation} from '../simulation';
import type {SimulationEndpointParticipantInformationCustomer} from '../globals/types/simulation';
import type {SimulationTypeCustomer} from './participant';
import {getShortestPathOsmCoordinates} from '../pathfinder/osm';

export class Customer extends Participant<SimulationTypeCustomer> {
  // Private properties
  private readonly fullName: string;

  private readonly gender: string;

  private readonly dateOfBirth: string;

  private readonly emailAddress: string;

  private readonly phoneNumber: string;

  private readonly homeAddress: string;

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
    super(id, 'customer', currentLocation, privateKey, publicKey);
    this.fullName = fullName;
    this.gender = gender;
    this.dateOfBirth = dateOfBirth;
    this.emailAddress = emailAddress;
    this.phoneNumber = phoneNumber;
    this.homeAddress = homeAddress;
  }

  logInfo(): unknown {
    return {
      id: this.id,

      fullName: this.fullName,
      homeAddress: this.homeAddress,
    };
  }

  async run(simulation: Simulation): Promise<void> {
    this.logger.debug('run');
    // Setup:
    // 1. Register to a random AS
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
      throw Error('No registered auth server!');
    }
    // Loop:
    let badRouteCounter = 0;
    while (simulation.state === 'RUNNING') {
      // If no route is found multiple times disable customer
      if (badRouteCounter >= 10) {
        break;
      }
      this.status = 'determining target location';
      this.rideRequest = undefined;
      this.passenger = undefined;
      // 1. Authenticate to the platform via AS
      const pseudonym = randAuthService.getVerify(this.id);
      // 2. Request ride to a random location via a random MS
      const dropoffLocation = getRandomElement(simulation.availableLocations);
      const dropoffLocationRoute = getShortestPathOsmCoordinates(
        simulation.osmVertexGraph,
        this.currentLocation,
        dropoffLocation
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
      const randMatchService = getRandomElement(simulation.matchingServices);
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
        1 * 1000,
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
      while (
        randMatchService.getRideRequest(this.rideRequest).auctionStatus !==
        'waiting-for-signature'
      ) {
        await wait(1 * 1000);
      }
      // 4. Accept auction result from MS
      // Create a ride contract through the contract factory that contains the maximum ride cost as a deposit
      // They then need to use the GET setContractAddress/:rideRequestId/:contractAddress endpoint to update their ride request with the contacts address on the blockchain
      // As the creation of the contract is understood as the initial signing of the ride contract, the status of the auction changes from 'waiting-for-signature' to 'closed'.
      const rideRequestInfo = randMatchService.getRideRequest(this.rideRequest);
      if (rideRequestInfo.auctionWinner === null) {
        this.logger.warn('customer ride request auction winner was null');
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
      // TODO Fix this to correspond to the driver arriving at location, for now just wait the sky distance multiplied by a car speed
      this.status = 'wait for ride provider to arrive';
      while (
        randMatchService.getRideRequest(this.rideRequest)
          .helperRideProviderArrived !== true
      ) {
        await wait(1 * 1000);
      }
      this.passenger = rideRequestInfo.auctionWinner;
      this.status = 'ride with ride provider to dropoff location';
      await this.moveToLocation(simulation, dropoffLocation, true);
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
      ...this.endpointParticipant,
      type: 'customer',

      // Contact details
      dateOfBirth: this.dateOfBirth,
      emailAddress: this.emailAddress,
      fullName: this.fullName,
      gender: this.gender,
      homeAddress: this.homeAddress,
      phoneNumber: this.phoneNumber,

      // TODO: Ride requests
      rideRequest: this.rideRequest,

      // TODO: Passenger
      passenger: this.passenger,
    };
  }

  get json(): SimulationTypeCustomer {
    return {
      ...this.endpointParticipant,
      type: 'customer',

      // Contact details
      dateOfBirth: this.dateOfBirth,
      emailAddress: this.emailAddress,
      fullName: this.fullName,
      gender: this.gender,
      homeAddress: this.homeAddress,
      phoneNumber: this.phoneNumber,

      // Ride request details
      passenger: this.passenger,
      rideRequest: this.rideRequest,
    };
  }
}
