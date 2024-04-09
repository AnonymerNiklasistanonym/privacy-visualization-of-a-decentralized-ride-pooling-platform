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
import {wait} from '../misc/wait';
// Type imports
import type {Coordinates} from '../types/globals/coordinates';
import type {Simulation} from '../simulation';
import type {SimulationTypeCustomer} from './participant';
import type {SimulationEndpointCustomer} from '../types/globals/simulation';

const h3Res = 7;

export class Customer extends Participant<SimulationTypeCustomer> {
  // Private properties
  private readonly fullName: string;

  private readonly gender: string;

  private readonly dateOfBirth: string;

  private readonly emailAddress: string;

  private readonly phoneNumber: string;

  private readonly homeAddress: string;

  private rideRequest:
    | {
        address: string;
        coordinates: Coordinates;
        state: string;
      }
    | undefined = undefined;

  constructor(
    id: string,
    fullName: string,
    gender: string,
    dateOfBirth: string,
    emailAddress: string,
    phoneNumber: string,
    homeAddress: string,
    currentLocation: Coordinates,
    verbose = false
  ) {
    super(id, 'customer', currentLocation, verbose);
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
    this.printLog('run');
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
    // Loop:
    while (simulation.state === 'RUNNING') {
      this.rideRequest = undefined;
      // 0. Stay idle for a random duration
      await wait(getRandomIntFromInterval(5 * 1000, 20 * 1000));
      // 1. Authenticate to the platform via AS
      const pseudonym = randAuthService.getVerify(this.id);
      // 2. Request ride to a random location via a random MS
      const randCity = getRandomElement(simulation.availableLocations);
      const randLocation = getRandomElement(randCity.places);
      const randMatchService = getRandomElement(simulation.matchingServices);
      const rideRequestId = randMatchService.postRequestRide(
        pseudonym,
        latLngToCell(
          this.currentLocation.lat,
          this.currentLocation.long,
          h3Res
        ),
        latLngToCell(randLocation.lat, randLocation.lon, h3Res),
        this.getRating(),
        `TODO ${pseudonym} public key`,
        10 * 1000,
        getRandomFloatFromInterval(3, 4.5),
        getRandomFloatFromInterval(3, 4.5),
        getRandomIntFromInterval(0, 4)
      );
      this.rideRequest = {
        address: `${randLocation.postcode} ${randLocation.city} ${randLocation.street} ${randLocation.houseNumber}`,
        coordinates: {lat: randLocation.lat, long: randLocation.lon},
        state: 'open',
      };
      // 3. Wait for the MS to determine the winning bid
      while (
        randMatchService.getRideRequest(rideRequestId).auctionStatus !==
        'waiting-for-signature'
      ) {
        await wait(1 * 1000);
      }
      // 4. Accept auction result from MS
      // Create a ride contract through the contract factory that contains the maximum ride cost as a deposit
      // They then need to use the GET setContractAddress/:rideRequestId/:contractAddress endpoint to update their ride request with the contacts address on the blockchain
      // As the creation of the contract is understood as the initial signing of the ride contract, the status of the auction changes from 'waiting-for-signature' to 'closed'.
      const rideRequest = randMatchService.getRideRequest(rideRequestId);
      this.rideRequest = {
        address: `${randLocation.postcode} ${randLocation.city} ${randLocation.street} ${randLocation.houseNumber}`,
        coordinates: {lat: randLocation.lat, long: randLocation.lon},
        state: rideRequest.auctionStatus,
      };
      if (rideRequest.auctionWinner === null) {
        console.warn('customer ride request auction winner was null');
        continue;
      }
      const contractAddress = simulation.blockchain.createRideContract(
        pseudonym,
        rideRequest.auctionWinner,
        getRandomIntFromInterval(5, 20)
      );
      // Check: Contacts Ride Provider
      randMatchService.getSetContractAddress(rideRequestId, contractAddress);
      this.rideRequest = {
        address: `${randLocation.postcode} ${randLocation.city} ${randLocation.street} ${randLocation.houseNumber}`,
        coordinates: {lat: randLocation.lat, long: randLocation.lon},
        state: 'closed',
      };
      // 5. Be part of the ride and wait until the ride is over
      // TODO Fix this to correspond to the driver arriving at location, for now just wait the sky distance multiplied by a car speed
      await this.moveToLocation({
        lat: randLocation.lat,
        long: randLocation.lon,
      });
    }
  }

  get endpointCustomer(): SimulationEndpointCustomer {
    return {
      id: this.id,
      // Contact details
      dateOfBirth: this.dateOfBirth,
      emailAddress: this.emailAddress,
      fullName: this.fullName,
      gender: this.gender,
      homeAddress: this.homeAddress,
      phoneNumber: this.phoneNumber,
      // TODO: Ride requests / passenger
    };
  }

  get json(): SimulationTypeCustomer {
    return {
      id: this.id,

      currentLocation: this.currentLocation,
      dateOfBirth: this.dateOfBirth,
      emailAddress: this.emailAddress,
      fullName: this.fullName,
      gender: this.gender,
      homeAddress: this.homeAddress,
      phoneNumber: this.phoneNumber,

      rideRequest: this.rideRequest,

      type: 'customer',
    };
  }
}
