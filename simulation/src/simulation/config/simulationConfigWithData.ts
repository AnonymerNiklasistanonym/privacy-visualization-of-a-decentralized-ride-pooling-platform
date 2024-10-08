// Package imports
import path from 'path';
// Local imports
import {
  cacheFilePathLocationData,
  cacheFilePathPeopleData,
  cacheFilePathPrivatePublicKeyData,
} from './cacheFiles';
import {
  overpassGetBuildingName,
  overpassRequestBbData,
  overpassRequestBbDataCity,
} from './overpass';
import {companyNames} from './companyNames';
import {createOsmVertexGraph} from './createOsmVertexGraph';
// > Globals
import {cacheWrapper} from 'lib_globals_fs';
import {timeWrapper} from 'lib_globals';
// > Libs
import {generatePublicKey} from '../../lib/crypto';
import {nameFakeApiRequest} from '../../lib/nameFake';
// > Services
import {createLoggerSection} from '../../services/logging';
// Type imports
import type {Coordinates} from 'lib_globals';
import type {OsmVertexGraph} from '../../lib/pathfinderOsm';
import type {OverpassRequestBbDataBuilding} from './overpass';
import type {SimulationConfig} from './simulationConfig';

const logger = createLoggerSection('simulationConfigWithData');

export const getLocationData = (config: Readonly<SimulationConfig>) =>
  Promise.all(
    config.locations.map(a =>
      a.type === 'city'
        ? overpassRequestBbDataCity(
            a.name,
            a.countryCode,
            config.cacheDir,
            config.ignoreCache
          )
        : overpassRequestBbData(a, config.cacheDir, config.ignoreCache)
    )
  );

export const getPrivatePublicKeyData = (config: Readonly<SimulationConfig>) =>
  Promise.all(
    [
      ...Array(
        config.customer.count +
          config.rideProvider.countPerson +
          config.rideProvider.countCompany *
            config.rideProvider.countCompanyFleet
      ).keys(),
    ].map(
      passphrase =>
        new Promise<SimulationConfigPrivatePublicKeyData>((resolve, reject) =>
          generatePublicKey(`${passphrase}`)
            .then(keyPair => resolve({...keyPair, passphrase: `${passphrase}`}))
            .catch(reject)
        )
    )
  );

export const getPeopleData = (config: Readonly<SimulationConfig>) =>
  Promise.all(
    [
      ...Array(config.customer.count + config.rideProvider.countPerson).keys(),
    ].map(() =>
      nameFakeApiRequest().then(a => ({
        company: a.company,
        dateOfBirth: a.birth_data,
        emailAddress: a.email_d,
        fullName: a.name,
        gender: a.pict.substring(1),
        phoneNumber: a.phone_w,
      }))
    )
  );

export const timeCacheWrapper = async <DATA_TYPE>(
  config: Readonly<SimulationConfig>,
  getData: () => DATA_TYPE | Promise<DATA_TYPE>,
  cacheFilePath: string,
  name: string
): Promise<DATA_TYPE> => {
  let usedCache = false;
  return timeWrapper.measureTimeWrapper(
    cacheWrapper.getJsonCacheWrapper<DATA_TYPE>(
      getData,
      path.join(config.cacheDir, cacheFilePath),
      {
        callbackUseCache: () => {
          usedCache = true;
        },
        ignoreCache: config.ignoreCache,
      }
    ),
    stats =>
      logger.info(
        `loaded ${name} in ${stats.executionTimeInMS}ms${
          usedCache ? ' (from cache)' : ''
        }`
      )
  );
};

export const updateSimulationConfigWithData = async (
  config: Readonly<SimulationConfig>
): Promise<SimulationConfigWithData> => {
  logger.debug('Update simulation config with actual data...');
  const [locationData, peopleData, privatePublicKeyData] = await Promise.all([
    timeCacheWrapper(
      config,
      () => getLocationData(config),
      cacheFilePathLocationData(config),
      'LocationData'
    ),
    timeCacheWrapper(
      config,
      () => getPeopleData(config),
      cacheFilePathPeopleData(config),
      'PeopleData'
    ),
    timeCacheWrapper(
      config,
      () => getPrivatePublicKeyData(config),
      cacheFilePathPrivatePublicKeyData(config),
      'PrivatePublicKeyData'
    ),
  ]);
  if (locationData.length === 0) {
    throw Error('Could not find any location data for the simulation!');
  }
  const [osmVertexGraph, places] = await Promise.all([
    timeWrapper.measureTimeWrapper(
      () => createOsmVertexGraph(locationData),
      stats =>
        logger.info(`created OsmVertexGraph in ${stats.executionTimeInMS}ms`)
    ),
    timeWrapper.measureTimeWrapper(
      () =>
        locationData
          .flatMap(a => a.buildings.map(a => [a, overpassGetBuildingName(a)]))
          .filter(
            (a): a is [OverpassRequestBbDataBuilding, string] =>
              a[1] !== undefined
          )
          .map<SimulationConfigCityPlace>(([a, name]) => ({
            ...a,
            name,
          })),
      stats => logger.info(`created Places in ${stats.executionTimeInMS}ms`)
    ),
  ]);
  return {
    ...config,
    companyNames,
    osmVertexGraph,
    peopleData,
    places,
    privatePublicKeyData,
    startPos:
      config.startPos !== undefined
        ? config.startPos
        : locationData[0].startPos,
  };
};

export interface SimulationConfigCityPlace extends Coordinates {
  name: string;
}

export interface SimulationConfigPeopleData {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  emailAddress: string;
  phoneNumber: string;
  company: string;
}

export interface SimulationConfigPrivatePublicKeyData {
  passphrase: string;
  publicKey: string;
  privateKey: string;
}

/** The configuration for the simulation including cached data. */
export interface SimulationConfigWithData extends SimulationConfig {
  places: ReadonlyArray<SimulationConfigCityPlace>;
  osmVertexGraph: Readonly<OsmVertexGraph>;
  peopleData: ReadonlyArray<SimulationConfigPeopleData>;
  privatePublicKeyData: ReadonlyArray<SimulationConfigPrivatePublicKeyData>;
  companyNames: ReadonlyArray<string>;
  startPos: Coordinates;
}
