// Local imports
import {cacheFilePathPeople} from './cacheFiles';
import {companyNames} from './companyNames';
import {createLoggerSection} from '../services/logging';
import {createOsmVertexGraph} from '../pathfinder/osm';
import {nameFakeRequestOrCache} from './nameFake';
import {overpassRequestCityData} from './overpass';
// Type imports
import type {OsmVertexGraph} from '../pathfinder/osm';
import type {SimulationConfig} from './simulationConfig';

const logger = createLoggerSection('simulationConfigWithData');

export const updateSimulationConfigWithData = async (
  config: Readonly<SimulationConfig>
): Promise<SimulationConfigWithData> => {
  const citiesDataRaw = await Promise.all(
    config.cities.map(city =>
      overpassRequestCityData(
        city.name,
        city.countryCode,
        config.cacheDir,
        config.ignoreCache
      )
    )
  );
  const citiesData = citiesDataRaw.map(cityData => ({
    bounds: {
      maxLat: cityData.boundingBoxRelation.bounds.maxlat,
      maxLon: cityData.boundingBoxRelation.bounds.maxlon,
      minLat: cityData.boundingBoxRelation.bounds.minlat,
      minLon: cityData.boundingBoxRelation.bounds.minlon,
    },
    lat: cityData.node.lat,
    lon: cityData.node.lon,
    name: cityData.node.tags.name,
    osmAreaId: cityData.area.id,
    osmNodeId: cityData.node.id,
    places: cityData.places.map(a => ({...a, houseNumber: a.housenumber})),
  }));
  for (const cityData of citiesData) {
    logger.debug(`city ${cityData.name}:`, {
      bounds: cityData.bounds,
      lat: cityData.lat,
      long: cityData.lon,
      places: cityData.places.length,
    });
  }
  const peopleCount = config.customer.count + config.rideProvider.countPerson;
  return {
    ...config,
    citiesData,
    companyNames,
    osmVertexGraph: createOsmVertexGraph(citiesDataRaw),
    peopleData: (
      await nameFakeRequestOrCache(
        peopleCount,
        config.cacheDir,
        cacheFilePathPeople(peopleCount),
        config.ignoreCache
      )
    ).map(a => ({
      company: a.company,
      dateOfBirth: a.birth_data,
      emailAddress: a.email_d,
      fullName: a.name,
      gender: a.pict.substring(1),
      phoneNumber: a.phone_w,
    })),
  };
};

export interface SimulationConfigCityData {
  name: string;
  lat: number;
  lon: number;
  osmNodeId: number;
  osmAreaId: number;
  bounds: {
    minLat: number;
    minLon: number;
    maxLat: number;
    maxLon: number;
  };
  places: {
    lat: number;
    lon: number;
    city: string;
    houseNumber: string;
    postcode: string;
    street: string;
    name?: string;
  }[];
}

export interface SimulationConfigPeopleData {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  emailAddress: string;
  phoneNumber: string;
  company: string;
}

/** The configuration for the simulation including cached data. */
export interface SimulationConfigWithData extends SimulationConfig {
  citiesData: ReadonlyArray<SimulationConfigCityData>;
  osmVertexGraph: Readonly<OsmVertexGraph>;
  peopleData: ReadonlyArray<SimulationConfigPeopleData>;
  companyNames: ReadonlyArray<string>;
}
