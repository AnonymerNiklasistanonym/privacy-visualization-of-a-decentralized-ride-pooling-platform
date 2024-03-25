import {nameFakeRequestOrCache} from './nameFake';
import {overpassRequestCityData} from './overpass';
// Type imports
import type {SimulationConfig} from './simulationConfig';

export const updateSimulationConfigWithData = async (
  config: SimulationConfig
): Promise<SimulationConfigWithData> => ({
  ...config,
  citiesData: (
    await Promise.all(
      config.cities.map(city =>
        overpassRequestCityData(city.name, city.countryCode, config.cacheDir)
      )
    )
  ).map(cityData => ({
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
  peopleData: (
    await nameFakeRequestOrCache(
      config.customer.count + config.rideProvider.countPerson,
      config.cacheDir,
      `cache_${
        config.customer.count + config.rideProvider.countPerson
      }_people.json`
    )
  ).map(a => ({
    fullName: a.name,
    dateOfBirth: a.birth_data,
    emailAddress: a.email_d,
    phoneNumber: a.phone_w,
    gender: a.pict.substring(1),
    company: a.company,
  })),
});

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
  peopleData: ReadonlyArray<SimulationConfigPeopleData>;
}
