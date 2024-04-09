import {Actor} from './actor';
// Type imports
import type {AuthenticationService} from './services';
import type {Coordinates} from '../types/globals/coordinates';
import {
  distanceInKmBetweenEarthCoordinates,
  getRandomFloatFromInterval,
} from '../misc/helpers';
import {wait} from '../misc/wait';
import type {SimulationEndpointParticipantCoordinatesParticipant} from '../types/globals/simulation';

export interface SimulationTypeParticipant {
  id: string;
  currentLocation: Coordinates;
  type: 'customer' | 'ride_provider';
}

export interface SimulationTypeCustomer extends SimulationTypeParticipant {
  fullName: string;
  gender: string;
  dateOfBirth: string;
  emailAddress: string;
  phoneNumber: string;
  homeAddress: string;
  rideRequest?: {
    address: string;
    coordinates: Coordinates;
    state: string;
  };
  type: 'customer';
}

export type SimulationTypeRideProvider =
  | SimulationTypeRideProviderPerson
  | SimulationTypeRideProviderCompany;

interface RideProviderGeneric extends SimulationTypeParticipant {
  vehicleNumberPlate: string;
  vehicleIdentificationNumber: string;
  passengers: string[];
  type: 'ride_provider';
}

export interface SimulationTypeRideProviderPerson
  extends RideProviderGeneric,
    Omit<SimulationTypeCustomer, 'type'> {}

export interface SimulationTypeRideProviderCompany
  extends RideProviderGeneric,
    Omit<SimulationTypeParticipant, 'type'> {
  company: string;
}

/**
 * Abstract Class that represents a participant of the simulation.
 */
export abstract class Participant<JsonType> extends Actor<JsonType> {
  // Private dynamic information
  protected currentLocation: Coordinates;

  protected registeredAuthService: AuthenticationService | null = null;

  /** Create instance of participant. */
  constructor(
    id: string,
    type: 'customer' | 'ride_provider',
    currentLocation: Coordinates,
    verbose = false
  ) {
    super(id, type, verbose);
    this.currentLocation = currentLocation;
  }

  getRating(): number {
    if (this.registeredAuthService === null) {
      throw new Error(
        'Participant is not yet registered to an authentication service.'
      );
    }
    this.registeredAuthService.getVerify(this.id);
    return this.registeredAuthService.getRating(this.id);
  }

  get endpointCoordinates(): SimulationEndpointParticipantCoordinatesParticipant {
    return {
      id: this.id,
      ...this.currentLocation,
    };
  }

  async moveToLocation(newLocation: Coordinates): Promise<void> {
    this.printLog('Move to new location', {
      currentLocation: this.currentLocation,
      newLocation,
    });
    const oldLocation: Coordinates = {
      lat: this.currentLocation.lat,
      long: this.currentLocation.long,
    };
    const timeOfArrival =
      distanceInKmBetweenEarthCoordinates(
        this.currentLocation.lat,
        this.currentLocation.long,
        newLocation.lat,
        newLocation.long
      ) *
      getRandomFloatFromInterval(20, 30) *
      1000;
    let currentTime = 0;
    while (currentTime <= timeOfArrival) {
      this.currentLocation.lat =
        oldLocation.lat +
        (newLocation.lat - oldLocation.lat) * (currentTime / timeOfArrival);
      this.currentLocation.long =
        oldLocation.long +
        (newLocation.long - oldLocation.long) * (currentTime / timeOfArrival);
      //this.printLog('Updated location', {
      //  currentLocation: this.currentLocation,
      //  destination: newLocation,
      //  currentTime,
      //  timeOfArrival,
      //});
      await wait(1000 / 4);
      currentTime += 1000 / 4;
    }
  }
}
