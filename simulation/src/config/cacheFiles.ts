// Local imports
import {generateMd5Hash} from '../misc/crypto';
// Type imports
import type {SimulationConfig} from './simulationConfig';

export const cacheFilePathPeopleData = (config: Readonly<SimulationConfig>) =>
  `cache_peopleData_${generateMd5Hash({
    customer: config.customer,
    rideProvider: config.rideProvider,
  })}.json`;

export const cacheFilePathPrivatePublicKeyData = (
  config: Readonly<SimulationConfig>
) =>
  `cache_privatePublicKeyData_${generateMd5Hash({
    customer: config.customer,
    rideProvider: config.rideProvider,
  })}.json`;

export const cacheFilePathLocationData = (config: Readonly<SimulationConfig>) =>
  `cache_locationData_${generateMd5Hash(config.locations)}.json`;
