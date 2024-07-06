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
  SimulationEndpointParticipantPersonInformation,
} from '../../globals/types/simulation';
import type {AuthenticationService} from './services/authenticationService';
import type {Coordinates} from '../../globals/types/coordinates';
import type {GetACarParticipantTypes} from '../../globals/types/participant';
import type {Simulation} from '../simulation';

export interface SimulationTypeParticipant {
  id: string;
  currentLocation: Coordinates;
  rideRequest?: string;
  type: 'customer' | 'ride_provider';
}

export interface SimulationTypeParticipantPerson
  extends SimulationTypeParticipant {
  fullName: string;
  gender: string;
  dateOfBirth: string;
  emailAddress: string;
  phoneNumber: string;
  homeAddress: string;
}

export interface SimulationTypeCustomer
  extends SimulationTypeParticipantPerson {
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
 *
 * This means it's an actor that participates in the world as a physical entity.
 */
export abstract class Participant<JsonType> extends Actor<
  JsonType,
  GetACarParticipantTypes
> {
  protected currentLocation: Coordinates;

  protected registeredAuthService: AuthenticationService | null = null;

  protected privateKey: string;

  protected publicKey: string;

  protected currentRoute?: Coordinates[] | null = undefined;

  protected currentRoutes?: {[index: string]: Coordinates[] | null} = {};

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

    this.privateKey = privateKey;
    this.publicKey = publicKey;
  }

  getRating(simulation: Simulation): number {
    if (this.registeredAuthService === null) {
      throw new Error(
        'Participant is not yet registered to an authentication service.'
      );
    }
    const pseudonym = this.registeredAuthService.getVerify(this.id);
    return this.registeredAuthService.getRating(pseudonym, simulation);
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
      simulation.config.customPathfinderProvider === undefined ||
      simulation.config.customPathfinderProvider === 'all' ||
      simulation.config.customPathfinderProvider === 'internal'
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
      simulation.config.customPathfinderProvider === 'pathfinder-server' ||
      simulation.config.customPathfinderProvider === 'all'
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
        if (
          simulation.config.customPathfinderProvider === 'pathfinder-server'
        ) {
          throw err;
        }
      }
    }
    if (
      simulation.config.customPathfinderProvider === undefined ||
      simulation.config.customPathfinderProvider === 'all' ||
      simulation.config.customPathfinderProvider === 'internal'
    ) {
      //this.logger.debug(
      //  'getRoute()',
      //  (routeInternal ?? []).map(a => `lat=${a.lat}:long=${a.long}`).join(', ')
      //);
      return routeInternal ?? null;
    } else if (
      simulation.config.customPathfinderProvider === 'pathfinder-server'
    ) {
      return routeOsmnx?.shortest_route_travel_time ?? null;
    }
    return null;
  }

  async moveToLocation(
    simulation: Readonly<Simulation>,
    newLocation: Readonly<Coordinates>,
    isPassenger = false,
    locationName: string | undefined = undefined
  ): Promise<void> {
    this.logger.debug('Move to new location', {
      currentLocation: this.currentLocation,
      isPassenger,
      locationName,
      newLocation,
    });
    const routeId = 'current';
    let newCurrentRoute = await this.getRoute(simulation, newLocation, routeId);
    if (newCurrentRoute === null || newCurrentRoute.length < 2) {
      newCurrentRoute = [this.currentLocation, newLocation];
      this.logger.warn('Could not get route', {
        currentLocation: this.currentLocation,
        isPassenger,
        locationName,
        newLocation,
      });
    }
    const interpolatedCoordinatesInfo = interpolateCurrentCoordinatesFromPath(
      newCurrentRoute,
      this.type === 'ride_provider' || isPassenger
        ? speeds.carInKmH
        : speeds.personInKmH
    );
    this.currentRoute = newCurrentRoute;
    let currentTravelTimeInMs = 0;
    while (
      currentTravelTimeInMs <= interpolatedCoordinatesInfo.travelTimeInMs
    ) {
      this.currentLocation = interpolatedCoordinatesInfo.getCurrentPosition(
        currentTravelTimeInMs
      );
      const startPerformanceTime = performance.now();
      await wait(1000 / 20);
      this.status = `move to ${locationName ?? 'a'} location ${
        isPassenger ? '[passenger] ' : ''
      }(${Math.round(currentTravelTimeInMs / 1000)}/${Math.round(
        interpolatedCoordinatesInfo.travelTimeInMs / 1000
      )}s)`;
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

  get endpointCoordinates(): SimulationEndpointParticipantCoordinatesParticipant {
    return {
      ...this.currentLocation,
      id: this.id,
    };
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

      // Status
      simulationStatus: this.status,
    };
  }
}

export abstract class ParticipantPerson<
  JsonType,
> extends Participant<JsonType> {
  // Private properties
  protected readonly fullName: string;

  protected readonly gender: string;

  protected readonly dateOfBirth: string;

  protected readonly emailAddress: string;

  protected readonly phoneNumber: string;

  protected readonly homeAddress: string;

  constructor(
    id: string,
    type: GetACarParticipantTypes,
    currentLocation: Coordinates,
    privateKey: string,
    publicKey: string,
    fullName: string,
    gender: string,
    dateOfBirth: string,
    emailAddress: string,
    phoneNumber: string,
    homeAddress: string
  ) {
    super(id, type, currentLocation, privateKey, publicKey);
    this.fullName = fullName;
    this.gender = gender;
    this.dateOfBirth = dateOfBirth;
    this.emailAddress = emailAddress;
    this.phoneNumber = phoneNumber;
    this.homeAddress = homeAddress;
  }

  get endpointParticipantPerson(): SimulationEndpointParticipantPersonInformation {
    return {
      ...this.endpointParticipant,

      // Contact details
      dateOfBirth: this.dateOfBirth,
      emailAddress: this.emailAddress,
      fullName: this.fullName,
      gender: this.gender,
      homeAddress: this.homeAddress,
      phoneNumber: this.phoneNumber,
    };
  }
}
