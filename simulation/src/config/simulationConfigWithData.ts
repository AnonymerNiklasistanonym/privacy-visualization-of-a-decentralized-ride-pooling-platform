// Local imports
import {createOsmVertexGraph} from '../pathfinder/osm';
import {nameFakeRequestOrCache} from './nameFake';
import {overpassRequestCityData} from './overpass';
// Type imports
import type {OsmVertexGraph} from '../pathfinder/osm';
import type {SimulationConfig} from './simulationConfig';

export const updateSimulationConfigWithData = async (
  config: Readonly<SimulationConfig>
): Promise<SimulationConfigWithData> => {
  const citiesData = await Promise.all(
    config.cities.map(city =>
      overpassRequestCityData(
        city.name,
        city.countryCode,
        config.cacheDir,
        config.verbose
      )
    )
  );
  return {
    ...config,
    citiesData: citiesData.map(cityData => ({
      name: cityData.node.tags.name,
      lat: cityData.node.lat,
      lon: cityData.node.lon,
      osmAreaId: cityData.area.id,
      osmNodeId: cityData.node.id,
      bounds: {
        maxLat: cityData.boundingBoxRelation.bounds.maxlat,
        maxLon: cityData.boundingBoxRelation.bounds.maxlon,
        minLat: cityData.boundingBoxRelation.bounds.minlat,
        minLon: cityData.boundingBoxRelation.bounds.minlon,
      },
      places: cityData.places.map(a => ({...a, houseNumber: a.housenumber})),
    })),
    osmVertexGraph: createOsmVertexGraph(citiesData),
    companyNames: [
      'Car2Go',
      'ShareACar',
      'CarsWithFriends',
      'OnlyCars',
      'CarSharing',
      'PoolCars',
    ],
    peopleData: (
      await nameFakeRequestOrCache(
        config.customer.count + config.rideProvider.countPerson,
        config.cacheDir,
        `cache_${
          config.customer.count + config.rideProvider.countPerson
        }_people.json`,
        config.verbose
      )
    ).map(a => ({
      fullName: a.name,
      dateOfBirth: a.birth_data,
      emailAddress: a.email_d,
      phoneNumber: a.phone_w,
      gender: a.pict.substring(1),
      company: a.company,
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
