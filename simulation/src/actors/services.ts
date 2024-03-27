/* eslint-disable max-classes-per-file */
import {getRandomId, getRandomIntFromInterval} from '../misc/helpers';
import {Actor} from './actor';
// Type imports
import type {
  AuthenticationServiceParticipantDb,
  AuthenticationService as AuthenticationServiceType,
  MatchingServiceAuction,
  MatchingService as MatchingServiceType,
} from './types/services';
import type {
  SimulationTypeCustomer,
  SimulationTypeRideProviderCompany,
  SimulationTypeRideProviderPerson,
} from './types/participants';
import type {Simulation} from '../simulation/simulation';

abstract class Service<JsonType> extends Actor<JsonType> {
  latitude: number;

  longitude: number;

  radius: number;

  constructor(
    id: string,
    type: string,
    latitude: number,
    longitude: number,
    radius: number
  ) {
    super(id, type);
    this.latitude = latitude;
    this.longitude = longitude;
    this.radius = radius;
    // eslint-disable-next-line no-console
    console.debug(`Create service ${id}`);
  }
}

export class AuthenticationService extends Service<AuthenticationServiceType> {
  private participantDb: AuthenticationServiceParticipantDb;

  constructor(id: string, latitude: number, longitude: number, radius: number) {
    super(id, 'auth_service', latitude, longitude, radius);
    this.participantDb = [];
  }

  /** Register a customer. */
  registerCustomer(
    id: string,
    fullName: string,
    gender: string,
    dateOfBirth: string,
    emailAddress: string,
    phoneNumber: string,
    homeAddress: string
  ): void {
    console.log('Register customer', id, 'to AS', this.id);
    this.participantDb.push({
      contactDetails: {
        id,

        dateOfBirth,
        emailAddress,
        fullName,
        gender,
        homeAddress,
        phoneNumber,
      } as SimulationTypeCustomer,
      pseudonyms: [],
    });
  }

  /** Register a ride provider. */
  registerRideProvider(
    id: string,
    fullName: string,
    gender: string,
    dateOfBirth: string,
    emailAddress: string,
    phoneNumber: string,
    homeAddress: string,
    vehicleNumberPlate: string,
    vehicleIdentificationNumber: string
  ): void {
    console.log('Register ride provider', id, 'to AS', this.id);
    this.participantDb.push({
      contactDetails: {
        id,

        dateOfBirth,
        emailAddress,
        fullName,
        gender,
        homeAddress,
        phoneNumber,

        vehicleIdentificationNumber,
        vehicleNumberPlate,
      } satisfies Omit<
        SimulationTypeRideProviderPerson,
        'type' | 'currentLocation'
      >,
      pseudonyms: [],
    });
  }

  /** Register a ride provider from a company. */
  registerRideProviderCompany(
    id: string,
    vehicleNumberPlate: string,
    vehicleIdentificationNumber: string,
    company: string
  ): void {
    console.log('Register ride provider company', id, 'to AS', this.id);
    this.participantDb.push({
      contactDetails: {
        id,

        company,

        vehicleIdentificationNumber,
        vehicleNumberPlate,
      } satisfies Omit<
        SimulationTypeRideProviderCompany,
        'type' | 'currentLocation'
      >,
      pseudonyms: [],
    });
  }

  verify(id: string): string {
    const participant = this.participantDb.find(
      a => a.contactDetails.id === id
    );
    if (participant) {
      const newPseudonym = getRandomId();
      participant.pseudonyms.push(newPseudonym);
      return newPseudonym;
    }
    throw Error(
      `Participant tried to verify but was not in the database (id=${id})`
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
  getRating(participantId: string): number {
    // TODO
    return getRandomIntFromInterval(3, 5);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
  run(simulation: Simulation): Promise<void> {
    throw new Error('Method not implemented.');
  }

  get json(): AuthenticationServiceType {
    return {
      id: this.id,

      currentArea: {
        lat: this.latitude,
        lon: this.longitude,
        radius: this.radius,
      },
      participantDb: this.participantDb,

      type: 'authentication',
    };
  }
}

export class MatchingService extends Service<MatchingServiceType> {
  private auctions: MatchingServiceAuction[] = [];

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(id: string, latitude: number, longitude: number, radius: number) {
    super(id, 'matching_service', latitude, longitude, radius);
  }

  // TODO Add auction and smart contract generation as well as looking

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
  run(simulation: Simulation): Promise<void> {
    throw new Error('Method not implemented.');
  }

  requestRide(
    userId: string,
    pickupLocation: string,
    dropoffLocation: string,
    rating: number,
    userPublicKey: string,
    maxWaitingTime: number,
    minRating: number,
    minPassengerRating: number,
    maxPassengers: number
  ): void {
    const requestId = getRandomId();
    this.auctions.push({
      id: requestId,

      bids: [],
      request: {
        dropoffLocation,
        maxPassengers,
        maxWaitingTime,
        minPassengerRating,
        minRating,
        pickupLocation,
        rating,
        userId,
        userPublicKey,
      },
      startTime: new Date(),
    });
  }

  get json(): MatchingServiceType {
    return {
      id: this.id,

      auctionsDb: this.auctions,
      currentArea: {
        lat: this.latitude,
        lon: this.longitude,
        radius: this.radius,
      },

      type: 'matching',
    };
  }
}
