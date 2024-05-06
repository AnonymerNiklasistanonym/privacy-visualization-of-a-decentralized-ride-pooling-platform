// Package imports
import path from 'path';
// Local imports
// > Globals
import {ports} from './globals/defaults/ports';
// Type imports
import {SimulationConfig} from './simulation';

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
    {
      countryCode: 'DE',
      name: 'Stuttgart',
      type: 'city',
    },
  ],

  // Port of server
  port: ports.simulation,

  // Misc
  cacheDir: path.join(__dirname, '..', 'cache'),
};
