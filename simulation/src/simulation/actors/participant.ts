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
//import {workerCaller} from '../../lib/workerCaller';
//import {
//  WorkerDataPathfinder,
//  WorkerResultPathfinder,
//  workerFilePathPathfinder,
//} from '../../worker/pathfinderWorker';

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

  protected currentRoutes?: {[index: string]: Coordinates[] | null} = {};

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

  async getRoute(
    simulation: Readonly<Simulation>,
    newLocation: Readonly<Coordinates>,
    id: string
  ): Promise<Coordinates[] | null> {
    this.logger.debug('Get route', {
      currentLocation: this.currentLocation,
      newLocation,
    });
    let routeInternal;
    if (
      simulation.config.customPathfinder === undefined ||
      simulation.config.customPathfinder === 'all'
    ) {
      //routeInternal = await measureTimeWrapper(
      //  () =>
      //    workerCaller<WorkerDataPathfinder, WorkerResultPathfinder>(
      //      {
      //        graph: simulation.osmVertexGraph,
      //        sourceCoordinates: this.currentLocation,
      //        targetCoordinates: newLocation,
      //      },
      //      workerFilePathPathfinder
      //    ),
      //  stats =>
      //    this.logger.info(
      //      'get route calculation [worker]',
      //      id,
      //      `${stats.executionTimeInMS}ms`
      //    )
      //);
      routeInternal = await measureTimeWrapper(
        () =>
          getShortestPathOsmCoordinates(
            simulation.osmVertexGraph,
            this.currentLocation,
            newLocation
          ),
        stats =>
          this.logger.debug(
            'get route calculation',
            id,
            `${stats.executionTimeInMS}ms`
          )
      );
      this.currentRoutes = {
        ...this.currentRoutes,
        [id]: routeInternal,
      };
    }
    let routeOsmnx;
    if (
      simulation.config.customPathfinder === 'pathfinder-server' ||
      simulation.config.customPathfinder === 'all'
    ) {
      try {
        routeOsmnx = await measureTimeWrapper(
          () => osmnxServerRequest(this.currentLocation, newLocation),
          stats =>
            this.logger.debug(
              'get route fetch osmnx',
              `${stats.executionTimeInMS}ms`
            )
        );
        this.currentRoutes = {
          ...this.currentRoutes,
          [`${id} osmnx [Length]`]: routeOsmnx.shortest_route_length ?? null,
          [`${id} osmnx [Travel Time]`]:
            routeOsmnx.shortest_route_travel_time ?? null,
        };
      } catch (err) {
        this.logger.error(err as Error);
        if (simulation.config.customPathfinder === 'pathfinder-server') {
          throw err;
        }
      }
    }
    if (
      simulation.config.customPathfinder === undefined ||
      simulation.config.customPathfinder === 'all'
    ) {
      return routeInternal ?? null;
    }
    if (simulation.config.customPathfinder === 'pathfinder-server') {
      return routeOsmnx?.shortest_route_travel_time ?? null;
    }
    return null;
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
    const routeId = 'current';
    this.currentRoute = await this.getRoute(simulation, newLocation, routeId);
    const interpolatedCoordinatesInfo = interpolateCurrentCoordinatesFromPath(
      this.currentRoute ?? [{...this.currentLocation}, {...newLocation}],
      this.type === 'ride_provider' || isPassenger
        ? speeds.carInKmH
        : speeds.personInKmH
    );
    let currentTravelTimeInMs = 0;
    while (
      currentTravelTimeInMs <= interpolatedCoordinatesInfo.travelTimeInMs
    ) {
      this.currentLocation = interpolatedCoordinatesInfo.getCurrentPosition(
        currentTravelTimeInMs
      );
      const startPerformanceTime = performance.now();
      await wait(1000 / 20);
      currentTravelTimeInMs += performance.now() - startPerformanceTime;
    }
    this.currentRoute = undefined;
    for (const routeName of [
      routeId,
      `${routeId} osmnx [Length]`,
      `${routeId} osmnx [Travel Time]`,
    ]) {
      if (this.currentRoutes !== undefined && routeName in this.currentRoutes) {
        delete this.currentRoutes[routeName];
      }
    }
  }

  get endpointParticipant(): SimulationEndpointParticipantInformation {
    return {
      id: this.id,

      // Location
      currentLocation: this.currentLocation,

      // Routes
      currentRoutes: {
        ...this.currentRoutes,
        current: this.currentRoute ?? null,
      },

      simulationStatus: this.status,
    };
  }
}
