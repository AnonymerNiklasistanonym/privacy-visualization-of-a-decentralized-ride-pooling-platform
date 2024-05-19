// Package imports
import path from 'path';
// Local imports
// > Globals
import {ports} from './globals/defaults/ports';
// Type imports
import type {SimulationConfig, SimulationConfigCustom} from './simulation';

/** The default custom simulation configuration during development. */
export const defaultConfigCustomDev: Readonly<SimulationConfigCustom> = {
  ignoreActorErrors: true,
};

/** The default simulation configuration. */
export const defaultConfig: Readonly<SimulationConfig> = {
  // Services
  authenticationService: {
    count: 2,
  },
  matchingService: {
    count: 3,
  },

  // Participants
  customer: {
    count: 200,
  },
  rideProvider: {
    countCompany: 3,
    countCompanyFleet: 10,
    countPerson: 15,
  },

  // Location
  locations: [
    //{
    //  countryCode: 'DE',
    //  name: 'Stuttgart',
    //  type: 'city',
    //},
    {
      maxLat: 48.8663994,
      maxLong: 9.3160228,
      minLat: 48.6920188,
      minLong: 9.0386007,
      type: 'bbox',
    },
  ],

  // Port of server
  port: ports.simulation,

  // Misc
  cacheDir: path.join(__dirname, '..', 'cache'),

  // Load custom config in case this is a development build
  ...(process.env.NODE_ENV === 'development'
    ? defaultConfigCustomDev
    : undefined),
};
