// Local imports
import {getRandomId, getRandomIntFromInterval} from '../../../misc/helpers';
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
  private participantDb: AuthenticationServiceParticipantDb;

  constructor(id: string, latitude: number, longitude: number, radius: number) {
    super(id, 'auth_service', latitude, longitude, radius);
    this.participantDb = [];
  }

  /** Register a customer. */
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
        'type' | 'currentLocation' | 'passengers'
      >,
      pseudonyms: [],
    });
  }

  /** Register a ride provider from a company. */
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

        company,

        vehicleIdentificationNumber,
        vehicleNumberPlate,
      } satisfies Omit<
        SimulationTypeRideProviderCompany,
        'type' | 'currentLocation' | 'passengers'
      >,
      pseudonyms: [],
    });
  }

  getVerify(id: string): string {
    const participant = this.participantDb.find(
      a => a.contactDetails.id === id
    );
    if (participant) {
      const newPseudonym = `psuedonym_${getRandomId()}`;
      participant.pseudonyms.push(newPseudonym);
      return newPseudonym;
    }
    throw Error(
      `Participant tried to verify but was not in the database (id=${id})`
    );
  }

  getRating(pseudonym: string): number {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const participant = this.getParticipantFromPseudonym(pseudonym);
    // TODO: Calculate Rating and round it
    return getRandomIntFromInterval(3, 5);
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
  run(simulation: Simulation): Promise<void> {
    throw new Error('Method not implemented.');
  }

  get json(): SimulationTypeAuthenticationService {
    return {
      ...this.endpointService,
      type: 'authentication',

      participantDb: this.participantDb,
    };
  }
}
