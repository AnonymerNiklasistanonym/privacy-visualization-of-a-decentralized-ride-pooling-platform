// Package imports
import {cellToLatLng} from 'h3-js';
import {randomInt} from 'crypto';
// Local imports
import {Participant} from '../participant';
// > Globals
import {costs} from '../../../globals/defaults/costs';
import {speeds} from '../../../globals/defaults/speed';
// > Libs
import {getTravelTimeInMsCoordinates} from '../../../lib/coordinatesInterpolation';
import {haversineDistance} from '../../../lib/haversineDistance';
import {wait} from '../../../lib/wait';
// > Misc
import {
  getRandomElement,
  getRandomIntFromInterval,
} from '../../../misc/helpers';
// Type imports
import type {
  SimulationEndpointParticipantInformationRideProvider,
  SimulationEndpointParticipantInformationRideProviderCompany,
  SimulationEndpointParticipantInformationRideProviderPerson,
} from '../../../globals/types/simulation';
import type {
  SimulationTypeRideProvider,
  SimulationTypeRideProviderCompany,
  SimulationTypeRideProviderPerson,
} from '../participant';
import type {AuthenticationService} from '../services/authenticationService';
import type {Coordinates} from '../../../globals/types/coordinates';
import type {Simulation} from '../../simulation';
import {getH3CellCenter} from '../../../globals/lib/h3';

export abstract class RideProvider<
  JsonType extends SimulationTypeRideProvider,
> extends Participant<JsonType> {
  // Private properties
  protected readonly vehicleNumberPlate: string;

  protected readonly vehicleIdentificationNumber: string;

  protected readonly passengerList: string[] = [];

  protected rideRequest: string | undefined = undefined;

  protected model = getRandomElement(['Tesla', 'Mercedes', 'Smart']);

  constructor(
    id: string,
    currentLocation: Coordinates,
    vehicleNumberPlate: string,
    vehicleIdentificationNumber: string,
    privateKey: string,
    publicKey: string
  ) {
    super(id, 'ride_provider', currentLocation, privateKey, publicKey);
    this.vehicleNumberPlate = vehicleNumberPlate;
    this.vehicleIdentificationNumber = vehicleIdentificationNumber;
  }

  abstract runRegisterToRandomAuthService(
    simulation: Simulation
  ): AuthenticationService;

  async run(simulation: Simulation): Promise<void> {
    this.logger.debug('run');
    // 1. Register to a random AS
    this.registeredAuthService =
      this.runRegisterToRandomAuthService(simulation);
    if (this.registeredAuthService === null) {
      throw Error('No registered auth server!');
    }
    // Loop:
    while (simulation.state === 'RUNNING') {
      this.status = 'looking for ride requests';
      this.rideRequest = undefined;
      // 1. Authenticate to the platform via AS
      const pseudonym = this.registeredAuthService.getVerify(this.id);
      // 2. Bid on open ride requests
      const randMatchService = getRandomElement(simulation.matchingServices);
      const openRideRequests = randMatchService.getRideRequests();
      this.status = `looking for ride requests (found ${openRideRequests.length})`;
      if (openRideRequests.length === 0) {
        /** Wait a second if there are no open ride requests */
        await wait(1 * 1000);
        continue;
      }
      // TODO Find the closest open ride request (aerial distance for fast computation)
      const closestOpenRideRequest = openRideRequests.reduce((a, b) =>
        haversineDistance(
          this.currentLocation,
          getH3CellCenter(a.request.pickupLocation)
        ) <
        haversineDistance(
          this.currentLocation,
          getH3CellCenter(b.request.pickupLocation)
        )
          ? a
          : b
      );
      this.rideRequest = closestOpenRideRequest.id;
      const coordinatesPickupLocationPair = cellToLatLng(
        closestOpenRideRequest.request.pickupLocation
      );
      const coordinatesPickupLocation: Coordinates = {
        lat: coordinatesPickupLocationPair[0],
        long: coordinatesPickupLocationPair[1],
      };
      const coordinatesDropoffLocationPair = cellToLatLng(
        closestOpenRideRequest.request.dropoffLocation
      );
      const coordinatesDropoffLocation: Coordinates = {
        lat: coordinatesDropoffLocationPair[0],
        long: coordinatesDropoffLocationPair[1],
      };
      const estimatedDistanceToDriveInM =
        haversineDistance(this.currentLocation, coordinatesPickupLocation) +
        haversineDistance(
          coordinatesPickupLocation,
          coordinatesDropoffLocation
        );
      this.logger.debug('Post bid for open ride request', {
        closestOpenRideRequest,
      });
      randMatchService.postBid(
        closestOpenRideRequest.id,
        pseudonym,
        // Base cost + random cost + cost to reach pickup + cost to reach destination
        costs.baseCostRide +
          getRandomIntFromInterval(1, 5) +
          (estimatedDistanceToDriveInM / 1000) * costs.avgCostRideKilometer,
        this.getRating(simulation),
        this.model,
        new Date(
          new Date().getTime() +
            getTravelTimeInMsCoordinates(
              this.currentLocation,
              coordinatesPickupLocation,
              speeds.carInKmH
            )
        ),
        // TODO Handle multiple passengers
        0,
        this.publicKey
      );
      // 3. Wait for auction to close
      this.status = 'wait for ride request auction';
      const waitTimeStartAuction = performance.now();
      while (
        randMatchService.getRideRequest(closestOpenRideRequest.id)
          .auctionStatus === 'open'
      ) {
        await wait(1 * 1000);
        this.status = `wait for ride request auction (${Math.round(
          (performance.now() - waitTimeStartAuction) / 1000
        )}s)`;
      }
      const closedRideRequest = randMatchService.getRideRequest(
        closestOpenRideRequest.id
      );
      if (closedRideRequest.auctionWinner !== pseudonym) {
        this.logger.debug('Bid for open ride request was not successful', {
          closedRideRequest,
        });
        continue;
      }
      this.logger.debug('Bid for open ride request was successful', {
        closedRideRequest,
      });
      const rideContractAddress =
        randMatchService.helperRideProviderGetRideContractAddress(
          closestOpenRideRequest.id
        );
      this.logger.debug('Get ride contract address', {
        closedRideRequest,
      });
      // 4. Drive to customer and drive them to the dropoff location
      await this.moveToLocation(
        simulation,
        closedRideRequest.request.pickupLocationReal,
        false,
        'pickup'
      );
      simulation.blockchain.helperSetRideProviderArrived(rideContractAddress);
      this.passengerList.push(closedRideRequest.request.userId);
      await this.moveToLocation(
        simulation,
        closedRideRequest.request.dropoffLocationReal,
        false,
        'dropoff'
      );
      this.passengerList.pop();
      simulation.blockchain.rateParticipantRideContract(
        rideContractAddress,
        pseudonym,
        Math.max(randomInt(3), randomInt(4), randomInt(5))
      );
      this.rideRequest = undefined;
      // 5. Stay idle for a random duration
      this.status = 'idle';
      await wait(getRandomIntFromInterval(1, 20) * 1000);
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
    privateKey: string,
    publicKey: string
  ) {
    super(
      id,
      currentLocation,
      vehicleNumberPlate,
      vehicleIdentificationNumber,
      privateKey,
      publicKey
    );
    this.fullName = fullName;
    this.gender = gender;
    this.dateOfBirth = dateOfBirth;
    this.emailAddress = emailAddress;
    this.phoneNumber = phoneNumber;
    this.homeAddress = homeAddress;
  }

  runRegisterToRandomAuthService(
    simulation: Simulation
  ): AuthenticationService {
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
    return randAuthService;
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
      rideRequest: this.rideRequest,
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

      // Ride request / Passengers
      passengerList: this.passengerList,
      rideRequest: this.rideRequest,
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
    privateKey: string,
    publicKey: string
  ) {
    super(
      id,
      currentLocation,
      vehicleNumberPlate,
      vehicleIdentificationNumber,
      privateKey,
      publicKey
    );
    this.company = company;
  }

  runRegisterToRandomAuthService(
    simulation: Simulation
  ): AuthenticationService {
    const randAuthService = getRandomElement(simulation.authenticationServices);
    randAuthService.getRegisterRideProviderCompany(
      this.id,
      this.vehicleNumberPlate,
      this.vehicleIdentificationNumber,
      this.company
    );
    return randAuthService;
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
      rideRequest: this.rideRequest,
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

      // Ride request / Passengers
      passengerList: this.passengerList,
      rideRequest: this.rideRequest,
    };
  }
}
