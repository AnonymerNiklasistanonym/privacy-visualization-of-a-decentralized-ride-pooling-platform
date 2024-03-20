/* eslint-disable max-classes-per-file */
import { getRandomId, getRandomIntFromInterval } from '../misc/helpers';
import type { Simulation } from '../simulation';
import { LocationGPS } from '../types/location';
import type { SimulationTypeRideProviderCompany, SimulationTypeRideProviderPerson, SimulationTypeCustomer } from '../types/participants';
import type { AuthenticationService as AuthenticationServiceType, MatchingService as MatchingServiceType, AuthenticationServiceParticipantDb, MatchingServiceAuction } from '../types/services';
import Actor from './actor';

abstract class Service<JsonType> extends Actor<JsonType> {
  latitude: number;

  longitude: number;

  radius: number;

  constructor(id: string, type: string, latitude: number, longitude: number, radius: number) {
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
    super(id, "auth_service", latitude, longitude, radius);
    this.participantDb = [];
  }

  /** Register a customer */
  registerCustomer(
    id: string,
    fullName: string,
    gender: string,
    dateOfBirth: string,
    emailAddress: string,
    phoneNumber: string,
    homeAddress: string,
  ): void {
    this.participantDb.push({
      contactDetails: {
        id, fullName, gender, dateOfBirth, emailAddress, phoneNumber, homeAddress
      } as SimulationTypeCustomer,
      pseudonyms: []
    });
  }
  /** Register a ride provider */
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
    this.participantDb.push({
      contactDetails: {
        id, fullName, gender, dateOfBirth, emailAddress, phoneNumber, homeAddress,
        // Ride Provider Properties
        vehicleNumberPlate, vehicleIdentificationNumber
      } satisfies Omit<SimulationTypeRideProviderPerson, "type" | "currentLocation">,
      pseudonyms: []
    });
  }
  /** Register a ride provider from a company */
  registerRideProviderCompany(
    id: string,
    vehicleNumberPlate: string,
    vehicleIdentificationNumber: string,
    company: string
  ): void {
    this.participantDb.push({
      contactDetails: {
        id,
        vehicleNumberPlate, vehicleIdentificationNumber,
        company
      } satisfies Omit<SimulationTypeRideProviderCompany, "type" | "currentLocation"> ,
      pseudonyms: []
    });
  }

  verify(id: string): string {
    const participant = this.participantDb.find((a) => a.contactDetails.id === id);
    if (participant) {
      const newPseudonym = Math.random().toString(36).slice(2);
      participant.pseudonyms.push(newPseudonym);
      return newPseudonym;
    }
    throw Error(`Participant tried to verify but was not in the database (id=${id})`);
  }

  getRating(_participantId: string): number {
    // TODO
    return getRandomIntFromInterval(3, 5)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
  run(simulation: Simulation): Promise<void> {
    throw new Error('Method not implemented.');
  }

  get json(): AuthenticationServiceType {
    return {
      id: this.id,
      currentArea: { latitude: this.latitude, longitude: this.longitude, radius: this.radius },
      participantDb: this.participantDb,
      type: 'authentication',
    };
  }
}

export class MatchingService extends Service<MatchingServiceType> {
  private auctions: MatchingServiceAuction[] = [];

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(id: string, latitude: number, longitude: number, radius: number) {
    super(id, "matching_service", latitude, longitude, radius);
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
      request: {
        userId,
        pickupLocation,
        dropoffLocation,
        rating,
        userPublicKey,
        maxWaitingTime,
        minRating,
        minPassengerRating,
        maxPassengers
      },
      startTime: new Date(),
      bids: []
    })
  }

  get json(): MatchingServiceType {
    return {
      id: this.id,
      currentArea: { latitude: this.latitude, longitude: this.longitude, radius: this.radius },
      type: 'matching',
    };
  }
}
