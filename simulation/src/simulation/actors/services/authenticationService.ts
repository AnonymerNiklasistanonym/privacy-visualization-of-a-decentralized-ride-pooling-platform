// Local imports
import {getRandomFloatFromInterval, getRandomId} from '../../../misc/helpers';
import {Service} from '../service';
// Type imports
import type {
  SimulationTypeCustomer,
  SimulationTypeRideProviderCompany,
  SimulationTypeRideProviderPerson,
} from '../participant';
import type {Simulation} from '../../simulation';
import type {SimulationTypeService} from '../service';

export interface AuthenticationServiceParticipantDbEntry<
  ContactDetails extends {id: string} = {id: string},
> {
  contactDetails: ContactDetails;
  pseudonyms: string[];
}

export type AuthenticationServiceParticipantDb = (
  | AuthenticationServiceParticipantDbEntry<
      Omit<SimulationTypeCustomer, 'currentLocation' | 'type'>
    >
  | AuthenticationServiceParticipantDbEntry<
      Omit<
        SimulationTypeRideProviderPerson,
        'currentLocation' | 'type' | 'passengers'
      >
    >
  | AuthenticationServiceParticipantDbEntry<
      Omit<
        SimulationTypeRideProviderCompany,
        'currentLocation' | 'type' | 'passengers'
      >
    >
)[];

export interface SimulationTypeAuthenticationService
  extends SimulationTypeService {
  participantDb: AuthenticationServiceParticipantDb;
  type: 'authentication';
}

export class AuthenticationService extends Service<SimulationTypeAuthenticationService> {
  private participantDb: AuthenticationServiceParticipantDb = [];

  private fakeRatingCache = new Map<
    string,
    {count: number; rating: number; time: Date}
  >();

  constructor(id: string, latitude: number, longitude: number, radius: number) {
    super(id, 'auth_service', latitude, longitude, radius);
  }

  /** Register a customer (with the necessary contact details). */
  getRegisterCustomer(
    id: string,
    fullName: string,
    gender: string,
    dateOfBirth: string,
    emailAddress: string,
    phoneNumber: string,
    homeAddress: string
  ): void {
    this.logger.debug('Register customer', {
      fullName,
      id,
    });
    this.participantDb.push({
      contactDetails: {
        id,

        // Participant contact details
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

  /** Register a ride provider (with the necessary contact details). */
  getRegisterRideProvider(
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
    this.logger.debug('Register ride provider', {
      fullName,
      id,
    });
    this.participantDb.push({
      contactDetails: {
        id,

        // Participant contact details
        dateOfBirth,
        emailAddress,
        fullName,
        gender,
        homeAddress,
        phoneNumber,

        // Ride Provider specific contact details
        vehicleIdentificationNumber,
        vehicleNumberPlate,
      } satisfies Omit<
        SimulationTypeRideProviderPerson,
        'type' | 'currentLocation' | 'passengers'
      >,
      pseudonyms: [],
    });
  }

  /** Register a ride provider from a company (with the necessary contact details). */
  getRegisterRideProviderCompany(
    id: string,
    vehicleNumberPlate: string,
    vehicleIdentificationNumber: string,
    company: string
  ): void {
    this.logger.debug('Register ride provider company', {
      id,
      vehicleIdentificationNumber,
      vehicleNumberPlate,
    });
    this.participantDb.push({
      contactDetails: {
        id,

        // Company contact details
        // > Is stored somewhere else -> Ignored here
        company,

        // Ride Provider specific contact details
        vehicleIdentificationNumber,
        vehicleNumberPlate,
      } satisfies Omit<
        SimulationTypeRideProviderCompany,
        'type' | 'currentLocation' | 'passengers'
      >,
      pseudonyms: [],
    });
  }

  /** Verify participant. Returns verified pseudonym if successful. */
  getVerify(id: string): string {
    const participant = this.participantDb.find(
      a => a.contactDetails.id === id
    );
    if (participant) {
      // Use prefix to make sure it's never used as actual ID in requests!
      const newPseudonym = `pseudonym_${getRandomId()}`;
      // Append pseudonym to participant DB
      participant.pseudonyms.push(newPseudonym);
      return newPseudonym;
    }
    throw Error(
      `Participant '${id}' tried to verify but was not in the database!`
    );
  }

  /** Get the rounded rating from a participant. */
  getRating(pseudonym: string, simulation: Simulation): number {
    const participant = this.getParticipantFromPseudonym(pseudonym);
    if (participant === undefined) {
      throw Error(`Participant '${pseudonym}' was not found!`);
    }
    const currentDate = new Date();
    const actualRating = this.getRealRating(pseudonym, simulation);
    // Round to one decimal space and introduce some random values so it can't be used to reverse anything
    if (actualRating.count === 0) {
      return -1;
    }
    const fakeRatingCacheEntry = this.fakeRatingCache.get(
      participant.contactDetails.id
    );
    if (
      fakeRatingCacheEntry !== undefined &&
      fakeRatingCacheEntry.count === actualRating.count &&
      currentDate.getTime() - fakeRatingCacheEntry.time.getTime() < 1000 * 20
    ) {
      return fakeRatingCacheEntry.rating;
    }

    const numberOfFakeValues = 1 + Math.round(actualRating.count / 10);
    const fakeRating =
      Array.from({length: numberOfFakeValues}, () =>
        getRandomFloatFromInterval(
          actualRating.rating - 0.5,
          actualRating.rating + 0.5
        )
      ).reduce((a, b) => a + b, 0) / numberOfFakeValues;
    const fakeRatingRounded =
      Math.round(((actualRating.rating + fakeRating) / 2) * 10) / 10;
    this.fakeRatingCache.set(participant.contactDetails.id, {
      count: actualRating.count,
      rating: fakeRatingRounded,
      time: currentDate,
    });
    return fakeRatingRounded;
  }

  /** Get the rounded rating from a participant. */
  getRealRating(
    pseudonym: string,
    simulation: Simulation
  ): {
    count: number;
    rating: number;
  } {
    const participant = this.getParticipantFromPseudonym(pseudonym);
    if (participant === undefined) {
      throw Error(`Participant '${pseudonym}' was not found!`);
    }
    const ratings = [
      ...simulation.blockchain.rideContracts
        .filter(
          a =>
            participant.pseudonyms.includes(a.customerPseudonym) &&
            a.customerRating !== undefined
        )
        // FIX TypeScript still has problems seeing that this value is defined
        .map(a => a.customerRating as number),
      ...simulation.blockchain.rideContracts
        .filter(
          a =>
            participant.pseudonyms.includes(a.rideProviderPseudonym) &&
            a.rideProviderRating !== undefined
        )
        // FIX TypeScript still has problems seeing that this value is defined
        .map(a => a.rideProviderRating as number),
    ];
    // Round to one decimal space and introduce some random values so it can't be used to reverse anything
    if (ratings.length === 0) {
      return {count: 0, rating: -1};
    }
    return {
      count: ratings.length,
      rating:
        Math.round(
          (ratings.reduce((a, b) => a + b, 0) / ratings.length) * 100
        ) / 100,
    };
  }

  private getParticipantFromPseudonym(
    pseudonym: string
  ): undefined | AuthenticationServiceParticipantDbEntry {
    return this.participantDb.find(a => a.pseudonyms.includes(pseudonym));
  }

  simulationGetParticipantId(pseudonym: string): undefined | string {
    const participant = this.getParticipantFromPseudonym(pseudonym);
    return participant?.contactDetails.id;
  }

  simulationGetPseudonyms(participantId: string): undefined | Array<string> {
    return this.participantDb.find(a => a.contactDetails.id === participantId)
      ?.pseudonyms;
  }

  run(): Promise<void> {
    throw new Error('Passive actor, do not run!');
  }

  get json(): SimulationTypeAuthenticationService {
    return {
      ...this.endpointService,
      type: 'authentication',

      participantDb: this.participantDb,
    };
  }
}
