// Local imports
import {Actor} from './actor';
import {wait} from '../misc/wait';
import {interpolateCurrentCoordinatesFromPath} from '../misc/coordinatesInterpolation';
import {getShortestPathOsmCoordinates} from '../pathfinder/osm';
import {osmnxServerRequest} from '../misc/osmnx';
// Type imports
import type {AuthenticationService} from './services';
import type {Coordinates} from '../globals/types/coordinates';
import type {
  SimulationEndpointParticipantCoordinatesParticipant,
  SimulationEndpointParticipantInformation,
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
    this.printLog('Received path Osmnx', {
      shortestPathOsmnx,
    });
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
    const shortestPathFinal =
      shortestPathOsmnx.shortest_route_length === undefined
        ? [{...this.currentLocation}, {...newLocation}]
        : shortestPathOsmnx.shortest_route_length;
    const interpolatedCoordinatesInfo = interpolateCurrentCoordinatesFromPath(
      shortestPathFinal,
      35
    );
    this.printLog('Search shortest path', {
      currentLocation: this.currentLocation,
      newLocation,
      shortestPathCustom,
      shortestPathOsmnx,
      shortestPathFinal,
      interpolatedCoordinatesInfo,
    });
    let currentTravelTimeInMs = 0;
    while (
      currentTravelTimeInMs <= interpolatedCoordinatesInfo.travelTimeInMs
    ) {
      this.currentLocation = interpolatedCoordinatesInfo.getCurrentPosition(
        currentTravelTimeInMs
      );
      const startPerformanceTime = performance.timeOrigin;
      await wait(1000 / 4);
      currentTravelTimeInMs +=
        (performance.now() + startPerformanceTime) * 1000;
    }
    this.currentRoute = undefined;
    this.currentRoutes = undefined;
  }

  get endpointParticipant(): SimulationEndpointParticipantInformation {
    return {
      id: this.id,
      // Location
      currentLocation: this.currentLocation,
      // TODO: Routes
      currentRoute: this.currentRoute,
      currentRouteOsmxn: this.currentRoutes?.osmnxTime,
    };
  }
}
