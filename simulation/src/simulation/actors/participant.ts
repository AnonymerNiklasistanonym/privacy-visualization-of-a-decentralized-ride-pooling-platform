// Local imports
import {Actor} from './actor';
import {getShortestPathOsmCoordinates} from '../../lib/pathfinderOsm';
import {interpolateCurrentCoordinatesFromPath} from '../../lib/coordinatesInterpolation';
import {measureTimeWrapper} from '../../globals/lib/timeWrapper';
import {osmnxServerRequest} from '../../lib/osmnx';
import {speeds} from '../../globals/defaults/speed';
import {wait} from '../../lib/wait';
// Type imports
import type {
  SimulationEndpointParticipantCoordinatesParticipant,
  SimulationEndpointParticipantInformation,
} from '../../globals/types/simulation';
import type {AuthenticationService} from './services';
import type {Coordinates} from '../../globals/types/coordinates';
import type {GetACarParticipantTypes} from '../../globals/types/participant';
import type {Simulation} from '../simulation';

export interface SimulationTypeParticipant {
  id: string;
  currentLocation: Coordinates;
  rideRequest?: string;
  type: 'customer' | 'ride_provider';
}

export interface SimulationTypeCustomer extends SimulationTypeParticipant {
  fullName: string;
  gender: string;
  dateOfBirth: string;
  emailAddress: string;
  phoneNumber: string;
  homeAddress: string;
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

  protected status: string;

  protected privateKey: string;

  protected publicKey: string;

  /** Create instance of participant. */
  constructor(
    id: string,
    type: GetACarParticipantTypes,
    currentLocation: Coordinates,
    privateKey: string,
    publicKey: string
  ) {
    super(id, type);
    this.currentLocation = currentLocation;
    this.status = 'created';

    this.privateKey = privateKey;
    this.publicKey = publicKey;
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
      ...this.currentLocation,
      id: this.id,
    };
  }

  async moveToLocation(
    simulation: Readonly<Simulation>,
    newLocation: Readonly<Coordinates>,
    isPassenger = false
  ): Promise<void> {
    this.logger.debug('Move to new location', {
      currentLocation: this.currentLocation,
      newLocation,
    });
    this.currentRoute = await measureTimeWrapper(
      () =>
        getShortestPathOsmCoordinates(
          simulation.osmVertexGraph,
          this.currentLocation,
          newLocation
        ),
      stats =>
        this.logger.debug(
          'move to location route calculation',
          `${stats.executionTimeInMS}ms`
        )
    );
    try {
      const shortestPathOsmnx = await measureTimeWrapper(
        () => osmnxServerRequest(this.currentLocation, newLocation),
        stats =>
          this.logger.debug(
            'move to location osmnx route fetch',
            `${stats.executionTimeInMS}ms`
          )
      );
      this.currentRoutes = {
        custom: this.currentRoute,
        osmnxLength: shortestPathOsmnx.shortest_route_length ?? null,
        osmnxTime: shortestPathOsmnx.shortest_route_travel_time ?? null,
      };
    } catch (err) {
      this.logger.error(err as Error);
    }
    const interpolatedCoordinatesInfo = interpolateCurrentCoordinatesFromPath(
      this.currentRoute ?? [{...this.currentLocation}, {...newLocation}],
      this.type === 'ride_provider' || isPassenger
        ? speeds.carInKmH
        : speeds.personInKmH
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
      //console.log(
      //  this.id,
      //  this.currentLocation,
      //  currentTravelTimeInMs / 1000,
      //  interpolatedCoordinatesInfo.travelTimeInMs / 1000
      //);
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

      simulationStatus: this.status,
    };
  }
}
