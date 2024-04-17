// Local imports
import {Actor} from './actor';
import {wait} from '../misc/wait';
import {
  distanceInKmBetweenEarthCoordinates,
  getRandomFloatFromInterval,
} from '../misc/helpers';
// Type imports
import type {AuthenticationService} from './services';
import type {Coordinates} from '../globals/types/coordinates';
import type {SimulationEndpointParticipantCoordinatesParticipant} from '../globals/types/simulation';
import type {Simulation} from '../simulation';
import {getClosestVertex, getShortestPathOsm} from '../pathfinder/osm';
import { osmnxServerRequest } from '../misc/osmnx';

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
  rideRequestOld?: {
    address: string;
    coordinates: Coordinates;
    state: string;
  };
  rideRequest?: string;
  passenger?: string;
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

  async moveToLocation(
    simulation: Readonly<Simulation>,
    newLocation: Readonly<Coordinates>
  ): Promise<void> {
    this.printLog('Move to new location', {
      currentLocation: this.currentLocation,
      newLocation,
    });
    const startVertex = getClosestVertex(
      simulation.osmVertexGraph,
      this.currentLocation
    );
    const targetVertex = getClosestVertex(
      simulation.osmVertexGraph,
      newLocation
    );
    this.printLog('Search shortest path', {
      currentLocation: this.currentLocation,
      newLocation,
      startVertex,
      targetVertex,
    });
    if (startVertex === null || targetVertex === null) {
      throw Error(
        'Could not determine start/target vertex ' +
          +JSON.stringify(this.currentLocation) +
          ' ' +
          +JSON.stringify(newLocation)
      );
    }
    const shortestPathOsx = await osmnxServerRequest(
      this.currentLocation,
      newLocation
    );
    const shortestPath = getShortestPathOsm(
      simulation.osmVertexGraph,
      startVertex.id,
      targetVertex.id
    );
    this.printLog('Found shortest path', {
      currentLocation: this.currentLocation,
      newLocation,
      shortestPath,
      shortestPathOsx,
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
