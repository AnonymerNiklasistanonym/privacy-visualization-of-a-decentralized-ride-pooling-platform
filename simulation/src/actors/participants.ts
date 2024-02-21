/* eslint-disable max-classes-per-file */
import type { Simulation } from '../simulation';
import type { Customer as CustomerType, RideProvider as RideProviderType } from '../types/participants';
import Actor from './actor';

abstract class Participant<JsonType> extends Actor<JsonType> {
  name: string
  fullName: string
  birthday: string
  address: string
  latitude: number
  longitude: number

  constructor(id: string, name: string, fullName: string, birthday: string, address: string, latitude: number, longitude: number) {
    super(id);
    this.name = name;
    this.fullName = fullName;
    this.birthday = birthday;
    this.address = address;
    this.latitude = latitude;
    this.longitude = longitude;
    // eslint-disable-next-line no-console
    console.debug(`Create participant ${id}`);
  }

  get publicId(): string {
    return this.id;
  }
}

export class Customer extends Participant<CustomerType> {
  constructor(id: string, name: string, fullName: string, birthday: string, address: string, latitude: number, longitude: number) {
    super(id, name, fullName, birthday, address, latitude, longitude);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
  run(timeStep: number, simulation: Simulation): Promise<void> {
    throw new Error('Method not implemented.');
  }

  get json(): CustomerType {
    return {
      id: this.id,
      name: this.name,
      fullName: this.fullName,
      birthday: this.birthday,
      address: this.address,
      currentPos: { latitude: this.latitude, longitude: this.longitude },
      type: 'customer',
    };
  }
}

export class RideProvider extends Participant<RideProviderType> {
  constructor(id: string, name: string, fullName: string, birthday: string, address: string, latitude: number, longitude: number) {
    super(id, name, fullName, birthday, address, latitude, longitude);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
  run(timeStep: number, simulation: Simulation): Promise<void> {
    throw new Error('Method not implemented.');
  }

  get json(): RideProviderType {
    return {
      id: this.id,
      name: this.name,
      fullName: this.fullName,
      birthday: this.birthday,
      address: this.address,
      currentPos: { latitude: this.latitude, longitude: this.longitude },
      type: 'ride_provider',
    };
  }
}
