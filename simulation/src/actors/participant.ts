// Local imports
import {Actor} from './actor';
import {getShortestPathOsmCoordinates} from '../pathfinder/osm';
import {interpolateCurrentCoordinatesFromPath} from '../misc/coordinatesInterpolation';
import {osmnxServerRequest} from '../misc/osmnx';
import {wait} from '../misc/wait';
// Type imports
import type {
  SimulationEndpointParticipantCoordinatesParticipant,
  SimulationEndpointParticipantInformation,
} from '../globals/types/simulation';
import type {AuthenticationService} from './services';
import type {Coordinates} from '../globals/types/coordinates';
import type {GetACarParticipantTypes} from '../globals/types/participant';
import type {Simulation} from '../simulation';
import {speeds} from '../globals/defaults/speed';

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
    currentLocation: Coordinates
  ) {
    super(id, type);
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
    this.logger.debug('Move to new location', {
      currentLocation: this.currentLocation,
      newLocation,
    });
    const shortestPathOsmnx = await osmnxServerRequest(
      this.currentLocation,
      newLocation
    );
    this.logger.debug('Received path Osmnx', {
      shortestPathOsmnx,
    });
    this.currentRoute = getShortestPathOsmCoordinates(
      simulation.osmVertexGraph,
      this.currentLocation,
      newLocation
    );
    if (this.currentRoute) {
      console.log(this.currentRoute);
    }
    this.currentRoutes = {
      custom: this.currentRoute,
      osmnxLength: shortestPathOsmnx.shortest_route_length ?? null,
      osmnxTime: shortestPathOsmnx.shortest_route_travel_time ?? null,
    };
    const interpolatedCoordinatesInfo = interpolateCurrentCoordinatesFromPath(
      shortestPathOsmnx.shortest_route_length ??
        shortestPathOsmnx.shortest_route_travel_time ??
        this.currentRoute ?? [{...this.currentLocation}, {...newLocation}],
      this.type === 'ride_provider' ? speeds.carInKmH : speeds.personInKmH
    );
    this.logger.debug('Search shortest path', {
      currentLocation: this.currentLocation,
      currentRoutes: this.currentRoutes,
      interpolatedCoordinatesInfo,
      newLocation,
    });
    let currentTravelTimeInMs = 0;
    while (
      currentTravelTimeInMs <= interpolatedCoordinatesInfo.travelTimeInMs
    ) {
      console.log(
        this.id,
        this.currentLocation,
        currentTravelTimeInMs / 1000,
        interpolatedCoordinatesInfo.travelTimeInMs / 1000
      );
      this.currentLocation = interpolatedCoordinatesInfo.getCurrentPosition(
        currentTravelTimeInMs
      );
      const startPerformanceTime = performance.now();
      await wait(1000 / 20);
      currentTravelTimeInMs += performance.now() - startPerformanceTime;
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
      currentRouteOsmxn:
        this.currentRoutes?.osmnxTime ?? this.currentRoutes?.osmnxLength,
    };
  }
}
