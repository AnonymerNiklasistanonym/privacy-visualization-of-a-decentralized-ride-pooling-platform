import type {Coordinates} from '../../globals/types/coordinates';

export interface SimulationConfigAS {
  count: number;
}

export interface SimulationConfigMS {
  count: number;
}

export interface SimulationConfigCustomer {
  count: number;
}

export interface SimulationConfigRideProvider {
  countPerson: number;
  countCompany: number;
  countCompanyFleet: number;
}

export interface SimulationConfigLocation {
  type: 'city' | 'bbox';
}

export interface SimulationConfigCity extends SimulationConfigLocation {
  type: 'city';
  name: string;
  countryCode: string;
}
export interface SimulationConfigBBox extends SimulationConfigLocation {
  type: 'bbox';
  minLat: number;
  maxLat: number;
  minLong: number;
  maxLong: number;
}

/** The configuration for the simulation. */
export interface SimulationConfig {
  // Services
  authenticationService: Readonly<SimulationConfigAS>;
  matchingService: Readonly<SimulationConfigMS>;
  // Participants
  customer: Readonly<SimulationConfigCustomer>;
  rideProvider: Readonly<SimulationConfigRideProvider>;
  // Location
  locations: ReadonlyArray<SimulationConfigCity | SimulationConfigBBox>;
  startPos?: Readonly<Coordinates>;
  // Port of server
  port: number;
  // Misc
  cacheDir: string;
  customPathfinder?: 'pathfinder-server' | 'all';
  ignoreCache?: boolean;
}

export interface SimulationConfigCustom extends Partial<SimulationConfig> {
  $schema?: string;
}
