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
  countCompanyFleetMin: number;
  countCompanyFleetMax: number;
}

export interface SimulationConfigCity {
  name: string;
  countryCode: string;
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
  cities: ReadonlyArray<SimulationConfigCity>;
  // Port of server
  port: number;
  // Misc
  cacheDir: string;
  ignoreCache?: boolean;
}

export interface SimulationConfigCustom extends Partial<SimulationConfig> {
  $schema?: string;
}
