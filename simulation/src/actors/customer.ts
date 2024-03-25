/* eslint-disable max-classes-per-file */

// Package imports
import {latLngToCell} from 'h3-js';
// Local imports
import {getRandomElement} from '../misc/helpers';
import {Participant} from './participant';
// Type imports
import type {
  Coordinates,
  SimulationTypeCustomer as CustomerType,
} from '../types/participants';
import type {Simulation} from '../simulation';

const h3Res = 7;

export class Customer extends Participant<CustomerType> {
  // Private properties
  private readonly fullName: string;

  private readonly gender: string;

  private readonly dateOfBirth: string;

  private readonly emailAddress: string;

  private readonly phoneNumber: string;

  private readonly homeAddress: string;

  constructor(
    id: string,
    fullName: string,
    gender: string,
    dateOfBirth: string,
    emailAddress: string,
    phoneNumber: string,
    homeAddress: string,
    currentLocation: Coordinates
  ) {
    super(id, 'customer', currentLocation);
    this.fullName = fullName;
    this.gender = gender;
    this.dateOfBirth = dateOfBirth;
    this.emailAddress = emailAddress;
    this.phoneNumber = phoneNumber;
    this.homeAddress = homeAddress;
  }

  run(simulation: Simulation): Promise<void> {
    // Setup:
    // 1. Register to a random AS
    const randAuthService = getRandomElement(
      simulation.authenticationServiceObjects
    );
    randAuthService.registerCustomer(
      this.id,
      this.fullName,
      this.gender,
      this.dateOfBirth,
      this.emailAddress,
      this.phoneNumber,
      this.homeAddress
    );
    // Loop:
    while (simulation.state === 'ACTIVE') {
      // 1. Authenticate to the platform via AS
      const pseudonym = randAuthService.verify(this.id);
      // 2. Request ride to a random location via the random closest MS
      // TODO: Find random location in radius around currentLocation
      // const randomLocation: LocationGPS = { latitude: 10, longitude: 20 };
      const randMatchService = getRandomElement(
        simulation.matchingServiceObjects
      );
      randMatchService.requestRide(
        pseudonym,
        latLngToCell(this.currentLocation.lat, this.currentLocation.lon, h3Res),
        latLngToCell(0, 0, h3Res), // TODO
        this.getRating(),
        'TODO',
        60 * 1000,
        3,
        3,
        -1
      );
      // TODO:
      // 3. Accept auction result from MS
      // 4. Be part of the ride
      // 5. Stay idle for a random duration and then repeat
    }

    throw new Error('Method not implemented.');
  }

  get json(): CustomerType {
    return {
      id: this.id,

      currentLocation: this.currentLocation,
      dateOfBirth: this.dateOfBirth,
      emailAddress: this.emailAddress,
      fullName: this.fullName,
      gender: this.gender,
      homeAddress: this.homeAddress,
      phoneNumber: this.phoneNumber,

      type: 'customer',
    };
  }
}
