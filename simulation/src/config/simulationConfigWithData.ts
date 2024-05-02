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
      overpassRequestCityData(city.name, city.countryCode, config.cacheDir)
    )
  );
  return {
    ...config,
    citiesData: citiesData.map(cityData => ({
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
    })),
    companyNames: [
      'Car2Go',
      'ShareACar',
      'CarsWithFriends',
      'OnlyCars',
      'CarSharing',
      'PoolCars',
    ],
    osmVertexGraph: createOsmVertexGraph(citiesData),
    peopleData: (
      await nameFakeRequestOrCache(
        config.customer.count + config.rideProvider.countPerson,
        config.cacheDir,
        `cache_${
          config.customer.count + config.rideProvider.countPerson
        }_people.json`
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
