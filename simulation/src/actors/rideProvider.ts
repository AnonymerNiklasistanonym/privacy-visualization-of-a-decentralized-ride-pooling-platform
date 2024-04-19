/* eslint-disable max-classes-per-file */
import {cellToLatLng} from 'h3-js';
// Local imports
import {
  distanceInKmBetweenEarthCoordinates,
  getRandomElement,
  getRandomIntFromInterval,
} from '../misc/helpers';
import {Participant} from './participant';
import {wait} from '../misc/wait';
// Type imports
import type {Coordinates} from '../globals/types/coordinates';
import type {Simulation} from '../simulation';
import type {
  SimulationTypeRideProvider,
  SimulationTypeRideProviderCompany,
  SimulationTypeRideProviderPerson,
} from './participant';
import type {
  SimulationEndpointParticipantInformationRideProvider,
  SimulationEndpointParticipantInformationRideProviderCompany,
  SimulationEndpointParticipantInformationRideProviderPerson,
} from '../globals/types/simulation';

export abstract class RideProvider<
  JsonType extends SimulationTypeRideProvider,
> extends Participant<JsonType> {
  // Private properties
  protected readonly vehicleNumberPlate: string;

  protected readonly vehicleIdentificationNumber: string;

  protected readonly passengerList: string[] = [];

  constructor(
    id: string,
    currentLocation: Coordinates,
    vehicleNumberPlate: string,
    vehicleIdentificationNumber: string,
    verbose = false
  ) {
    super(id, 'ride_provider', currentLocation, verbose);
    this.vehicleNumberPlate = vehicleNumberPlate;
    this.vehicleIdentificationNumber = vehicleIdentificationNumber;
  }

  async runGenericLoop(simulation: Simulation) {
    // Loop:
    while (simulation.state === 'RUNNING') {
      // 0. Stay idle for a random duration
      await wait(1 * 1000);
      // 1. Authenticate to the platform via AS
      if (this.registeredAuthService === null) {
        throw Error('No registered auth server!');
      }
      const pseudonym = this.registeredAuthService.getVerify(this.id);
      // 2. Bid on open ride requests
      const randMatchService = getRandomElement(simulation.matchingServices);
      const openRideRequests = randMatchService.getRideRequests();
      if (openRideRequests.length === 0) {
        this.printLog('No open ride requests found');
        continue;
      }
      const openRideRequest = getRandomElement(
        randMatchService.getRideRequests()
      );
      const coordinatesPickupLocation = cellToLatLng(
        openRideRequest.request.pickupLocation
      );
      const differenceInKm = distanceInKmBetweenEarthCoordinates(
        this.currentLocation.lat,
        this.currentLocation.long,
        coordinatesPickupLocation[0],
        coordinatesPickupLocation[1]
      );
      this.printLog('Post bid for open ride request', {openRideRequest});
      randMatchService.postBid(
        openRideRequest.id,
        pseudonym,
        // TODO Take length of path into account
        getRandomIntFromInterval(5, 20),
        this.getRating(),
        getRandomElement(['Tesla', 'Mercedes', 'Smart']),
        new Date(
          new Date().getTime() +
            differenceInKm * getRandomIntFromInterval(20, 30) * 1000 * 60
        ),
        // TODO Handle multiple passengers
        0,
        `TODO ${this.id} vehiclePublicKey`
      );
      // 3. Wait for auction to close
      while (
        randMatchService.getRideRequest(openRideRequest.id).auctionStatus !==
        'closed'
      ) {
        await wait(1 * 1000);
      }
      const closedRideRequest = randMatchService.getRideRequest(
        openRideRequest.id
      );
      if (closedRideRequest.auctionWinner !== pseudonym) {
        this.printLog('Bid for open ride request was not successful', {
          closedRideRequest,
        });
        continue;
      }
      this.printLog('Bid for open ride request was successful', {
        closedRideRequest,
      });
      this.passengerList.push(closedRideRequest.request.userId);
      // 4. Drive to customer and drive them to the dropoff location
      // TODO Fix this to correspond to the driver arriving at location, for now just wait the sky distance multiplied by a car speed
      const coordinatesDropoffLocation = cellToLatLng(
        openRideRequest.request.dropoffLocation
      );
      await this.moveToLocation(simulation, {
        lat: coordinatesPickupLocation[0],
        long: coordinatesPickupLocation[1],
      });
      await this.moveToLocation(simulation, {
        lat: coordinatesDropoffLocation[0],
        long: coordinatesDropoffLocation[1],
      });
      this.passengerList.pop();
    }
  }

  abstract get endpointRideProvider(): SimulationEndpointParticipantInformationRideProvider;
}

export class RideProviderPerson extends RideProvider<SimulationTypeRideProviderPerson> {
  // Private properties
  protected readonly fullName: string;

  protected readonly gender: string;

  protected readonly dateOfBirth: string;

  protected readonly emailAddress: string;

  protected readonly phoneNumber: string;

  protected readonly homeAddress: string;

  constructor(
    id: string,
    currentLocation: Coordinates,
    vehicleNumberPlate: string,
    vehicleIdentificationNumber: string,
    fullName: string,
    gender: string,
    dateOfBirth: string,
    emailAddress: string,
    phoneNumber: string,
    homeAddress: string,
    verbose = false
  ) {
    super(
      id,
      currentLocation,
      vehicleNumberPlate,
      vehicleIdentificationNumber,
      verbose
    );
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
      vehicleNumberPlate: this.vehicleNumberPlate,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
  async run(simulation: Simulation): Promise<void> {
    this.printLog('run');
    // Setup:
    // 1. Register to a random AS
    const randAuthService = getRandomElement(simulation.authenticationServices);
    randAuthService.getRegisterRideProvider(
      this.id,
      this.fullName,
      this.gender,
      this.dateOfBirth,
      this.emailAddress,
      this.phoneNumber,
      this.homeAddress,
      this.vehicleNumberPlate,
      this.vehicleIdentificationNumber
    );
    this.registeredAuthService = randAuthService;
    await this.runGenericLoop(simulation);
  }

  get json(): SimulationTypeRideProviderPerson {
    return {
      ...this.endpointParticipant,
      type: 'ride_provider',
      // Ride Provider details
      vehicleIdentificationNumber: this.vehicleIdentificationNumber,
      vehicleNumberPlate: this.vehicleNumberPlate,
      // Contact details
      dateOfBirth: this.dateOfBirth,
      emailAddress: this.emailAddress,
      fullName: this.fullName,
      gender: this.gender,
      homeAddress: this.homeAddress,
      phoneNumber: this.phoneNumber,

      passengers: this.passengerList,
    };
  }

  get endpointRideProvider(): SimulationEndpointParticipantInformationRideProviderPerson {
    return {
      ...this.endpointParticipant,
      type: 'ride_provider',
      // Ride Provider details
      vehicleIdentificationNumber: this.vehicleIdentificationNumber,
      vehicleNumberPlate: this.vehicleNumberPlate,
      // Contact details
      dateOfBirth: this.dateOfBirth,
      emailAddress: this.emailAddress,
      fullName: this.fullName,
      gender: this.gender,
      homeAddress: this.homeAddress,
      phoneNumber: this.phoneNumber,
      // TODO: Ride requests
      rideRequest: undefined,
      // TODO: Passenger
      passengerList: this.passengerList,
    };
  }
}

export class RideProviderCompany extends RideProvider<SimulationTypeRideProviderCompany> {
  // Private properties
  protected readonly company: string;

  constructor(
    id: string,
    currentLocation: Coordinates,
    vehicleNumberPlate: string,
    vehicleIdentificationNumber: string,
    company: string,
    verbose = false
  ) {
    super(
      id,
      currentLocation,
      vehicleNumberPlate,
      vehicleIdentificationNumber,
      verbose
    );
    this.company = company;
  }

  logInfo(): unknown {
    return {
      id: this.id,
      company: this.company,
      vehicleNumberPlate: this.vehicleNumberPlate,
    };
  }

  async run(simulation: Simulation): Promise<void> {
    this.printLog('run');
    // Setup:
    // 1. Register to a random AS
    const randAuthService = getRandomElement(simulation.authenticationServices);
    randAuthService.getRegisterRideProviderCompany(
      this.id,
      this.vehicleNumberPlate,
      this.vehicleIdentificationNumber,
      this.company
    );
    this.registeredAuthService = randAuthService;
    await this.runGenericLoop(simulation);
  }

  get json(): SimulationTypeRideProviderCompany {
    return {
      ...this.endpointParticipant,
      type: 'ride_provider',

      company: this.company,
      currentLocation: this.currentLocation,
      vehicleIdentificationNumber: this.vehicleIdentificationNumber,
      vehicleNumberPlate: this.vehicleNumberPlate,

      passengers: this.passengerList,
    };
  }

  get endpointRideProvider(): SimulationEndpointParticipantInformationRideProviderCompany {
    return {
      ...this.endpointParticipant,
      type: 'ride_provider',
      // Ride Provider details
      vehicleIdentificationNumber: this.vehicleIdentificationNumber,
      vehicleNumberPlate: this.vehicleNumberPlate,
      // Contact details
      company: this.company,
      // TODO: Ride requests
      rideRequest: undefined,
      // TODO: Passenger
      passengerList: this.passengerList,
    };
  }
}
