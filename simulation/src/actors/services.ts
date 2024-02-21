/* eslint-disable max-classes-per-file */
import type { Simulation } from '../simulation';
import type { AuthenticationService as AuthenticationServiceType, MatchingService as MatchingServiceType, AuthenticationServiceParticipantDbEntry } from '../types/services';
import Actor from './actor';

abstract class Service<JsonType> extends Actor<JsonType> {
  latitude: number;

  longitude: number;

  radius: number;

  constructor(id: string, latitude: number, longitude: number, radius: number) {
    super(id);
    this.latitude = latitude;
    this.longitude = longitude;
    this.radius = radius;
    // eslint-disable-next-line no-console
    console.debug(`Create service ${id}`);
  }
}

export class AuthenticationService extends Service<AuthenticationServiceType> {
  private participantDb: AuthenticationServiceParticipantDbEntry[];

  constructor(id: string, latitude: number, longitude: number, radius: number) {
    super(id, latitude, longitude, radius);
    this.participantDb = [];
  }

  register(id: string, name: string, fullName: string, birthday: string, address: string): void {
    this.participantDb.push({
      id, name, fullName, birthday, address, pseudonyms: [],
    });
  }

  verify(id: string): void | string {
    const participant = this.participantDb.find((a) => a.id === id);
    if (participant) {
      const newPseudonym = Math.random().toString(36).slice(2);
      participant.pseudonyms.push(newPseudonym);
      return newPseudonym;
    }
    return undefined;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
  run(timeStep: number, simulation: Simulation): Promise<void> {
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
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(id: string, latitude: number, longitude: number, radius: number) {
    super(id, latitude, longitude, radius);
  }

  // TODO Add auction and smart contract generation as well as looking

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
  run(timeStep: number, simulation: Simulation): Promise<void> {
    throw new Error('Method not implemented.');
  }

  get json(): MatchingServiceType {
    return {
      id: this.id,
      currentArea: { latitude: this.latitude, longitude: this.longitude, radius: this.radius },
      type: 'matching',
    };
  }
}
