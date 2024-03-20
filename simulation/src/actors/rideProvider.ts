/* eslint-disable max-classes-per-file */
import type { Simulation } from '../simulation';
import type { SimulationTypeRideProviderPerson as RideProviderPersonType, SimulationTypeRideProviderCompany as RideProviderCompanyType, SimulationTypeRideProvider as RideProviderType, Coordinates } from '../types/participants';
import Participant from './participant';

abstract class RideProvider<JsonType extends RideProviderType> extends Participant<JsonType> {
  // Private properties
  protected readonly vehicleNumberPlate: string
  protected readonly vehicleIdentificationNumber: string

  constructor(
    id: string,
    currentLocation: Coordinates,
    vehicleNumberPlate: string,
    vehicleIdentificationNumber: string,
    ) {
    super(id, "ride_provider", currentLocation);
    this.vehicleNumberPlate = vehicleNumberPlate;
    this.vehicleIdentificationNumber = vehicleIdentificationNumber;
  }
}


export class RideProviderPerson extends RideProvider<RideProviderPersonType> {
  // Private properties
  protected readonly fullName: string
  protected readonly gender: string
  protected readonly dateOfBirth: string
  protected readonly emailAddress: string
  protected readonly phoneNumber: string
  protected readonly homeAddress: string

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
      ) {
      super(id, currentLocation, vehicleNumberPlate, vehicleIdentificationNumber);
      this.fullName = fullName;
      this.gender = gender;
      this.dateOfBirth = dateOfBirth;
      this.emailAddress = emailAddress;
      this.phoneNumber = phoneNumber;
      this.homeAddress = homeAddress;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
  run(timeStep: number, simulation: Simulation): Promise<void> {
    throw new Error('Method not implemented.');
  }

  get json(): RideProviderPersonType {
    return {
      id: this.id,
      fullName: this.fullName,
      gender: this.gender,
      dateOfBirth: this.dateOfBirth,
      emailAddress: this.emailAddress,
      phoneNumber: this.phoneNumber,
      homeAddress: this.homeAddress,
      vehicleNumberPlate: this.vehicleNumberPlate,
      vehicleIdentificationNumber: this.vehicleIdentificationNumber,
      currentLocation: this.currentLocation,
      type: 'ride_provider',
    };
  }
}

export class RideProviderCompany extends RideProvider<RideProviderCompanyType> {
  // Private properties
  protected readonly company: string

  constructor(
    id: string,
    currentLocation: Coordinates,
    vehicleNumberPlate: string,
    vehicleIdentificationNumber: string,
    company: string,
    ) {
    super(id, currentLocation, vehicleNumberPlate, vehicleIdentificationNumber);
    this.company = company;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
  run(timeStep: number, simulation: Simulation): Promise<void> {
    throw new Error('Method not implemented.');
  }

  get json(): RideProviderCompanyType {
    return {
      id: this.id,
      company: this.company,
      vehicleNumberPlate: this.vehicleNumberPlate,
      vehicleIdentificationNumber: this.vehicleIdentificationNumber,
      currentLocation: this.currentLocation,
      type: 'ride_provider',
    };
  }
}
