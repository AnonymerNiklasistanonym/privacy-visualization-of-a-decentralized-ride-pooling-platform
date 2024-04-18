// Local imports
import {Actor} from './actor';
import {wait} from '../misc/wait';
import {
  distanceInKmBetweenEarthCoordinates,
  getRandomFloatFromInterval,
} from '../misc/helpers';
import {getShortestPathOsmCoordinates} from '../pathfinder/osm';
import {
  osmnxServerRequest,
  updateRouteCoordinatesWithTime,
} from '../misc/osmnx';
// Type imports
import type {AuthenticationService} from './services';
import type {Coordinates} from '../globals/types/coordinates';
import type {
  SimulationEndpointParticipant,
  SimulationEndpointParticipantCoordinatesParticipant,
  SimulationEndpointParticipantInformation,
  SimulationEndpointParticipantInformationCustomer,
  SimulationEndpointParticipantInformationMisc,
} from '../globals/types/simulation';
import type {Simulation} from '../simulation';
import {GetACarParticipantTypes} from '../globals/types/participant';

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

export interface CurrentRoutes {
  custom: Coordinates[] | null;
  osmnxLength: Coordinates[] | null;
  osmnxTime: Coordinates[] | null;
}

/**
 * Abstract Class that represents a participant of the simulation.
 */
export abstract class Participant<JsonType> extends Actor<
  JsonType,
  GetACarParticipantTypes
> {
  // Private dynamic information
  protected currentLocation: Coordinates;

  protected registeredAuthService: AuthenticationService | null = null;

  protected currentRoute?: Coordinates[] | null = undefined;

  protected currentRoutes?: CurrentRoutes | null = undefined;

  /** Create instance of participant. */
  constructor(
    id: string,
    type: GetACarParticipantTypes,
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
    const shortestPathOsmnx = await osmnxServerRequest(
      this.currentLocation,
      newLocation
    );
    const shortestPathCustom = getShortestPathOsmCoordinates(
      simulation.osmVertexGraph,
      this.currentLocation,
      newLocation
    );
    this.currentRoute = shortestPathCustom;
    this.currentRoutes = {
      custom: shortestPathCustom,
      osmnxLength: shortestPathOsmnx.shortest_route_length ?? null,
      osmnxTime: shortestPathOsmnx.shortest_route_travel_time ?? null,
    };
    const shortestPathFinal = updateRouteCoordinatesWithTime(
      shortestPathOsmnx.shortest_route_length === undefined
        ? [{...this.currentLocation}, {...newLocation}]
        : shortestPathOsmnx.shortest_route_length
    );
    this.printLog('Search shortest path', {
      currentLocation: this.currentLocation,
      newLocation,
      shortestPathCustom,
      shortestPathOsmnx,
      shortestPathFinal,
    });
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
    this.currentRoute = undefined;
    this.currentRoutes = undefined;

    if (shortestPathOsmnx.error !== undefined) {
      // go in a straight line
      return;
    }
    shortestPathOsmnx = updateRouteCoordinatesWithTime;
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

  get endpointParticipant(): SimulationEndpointParticipantInformation {
    return {
      id: this.id,
      // Type
      type: this.type,
      // Location
      currentLocation: this.currentLocation,
      // TODO: Routes
      currentRoute: this.currentRoute,
      currentRouteOsmxn: this.currentRoutes?.osmnxTime,
    };
  }
}
