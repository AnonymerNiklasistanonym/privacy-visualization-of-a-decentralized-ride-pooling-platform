// Package imports
import haversineDistance from 'haversine-distance';
// Type imports
import type {Coordinates} from '../globals/types/coordinates';

export const getRandomId = (): string => Math.random().toString(36).slice(2);

export const getRandomElement = <TYPE>(array: ReadonlyArray<TYPE>): TYPE => {
  if (array.length === 0) {
    throw Error("Can't get random element because array has a length of 0!");
  }
  return array[Math.floor(Math.random() * array.length)];
};

export const getRandomIntFromInterval = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1) + min);

export const getRandomFloatFromInterval = (min: number, max: number): number =>
  Math.random() * (max - min) + min;

export interface InterpolatedCoordinatesFromPath {
  travelTimeInMs: number;
  getCurrentPosition: (currentTravelTimeInMs: number) => Coordinates;
}

export interface CoordinatesWithTime extends Coordinates {
  distanceInM: number;
  travelTimeInMs: number;
}

export const updateRouteCoordinatesWithTime = (
  coordinates: ReadonlyArray<Coordinates>,
  speedInKmH: number = 50
): CoordinatesWithTime[] => {
  if (coordinates.length === 0) {
    return [];
  }
  return coordinates.map((a, index) => {
    const distanceInM = haversineDistance(
      {
        lat: coordinates[index > 0 ? index - 1 : index].lat,
        lon: coordinates[index > 0 ? index - 1 : index].long,
      },
      {
        lat: a.lat,
        lon: a.long,
      }
    );
    return {
      ...a,
      distanceInM,
      travelTimeInMs: (distanceInM / 1000) * speedInKmH * 3600000,
    };
  });
};

export const interpolateCurrentCoordinatesFromPath = (
  path: ReadonlyArray<Coordinates>,
  speedInKmH: number
): InterpolatedCoordinatesFromPath => {
  const coordinatesWithTime = updateRouteCoordinatesWithTime(path, speedInKmH);
  const travelTimeInMs = coordinatesWithTime.reduce(
    (sum, a) => sum + a.travelTimeInMs,
    0
  );
  return {
    travelTimeInMs,
    getCurrentPosition: (currentTravelTimeInMs: number) => {
      return {
        lat:
          path[0].lat +
          (path.slice(-1)[0].lat - path[0].lat) *
            (currentTravelTimeInMs / travelTimeInMs),
        long:
          path[0].long +
          (path.slice(-1)[0].long - path[0].long) *
            (currentTravelTimeInMs / travelTimeInMs),
      };
    },
  };
};

// Remove this
export const degreesToRadians = (degrees: number) => (degrees * Math.PI) / 180;

// Remove this
export const distanceInKmBetweenEarthCoordinates = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  // https://stackoverflow.com/a/365853
  const earthRadiusKm = 6371;

  const dLat = degreesToRadians(lat2 - lat1);
  const dLon = degreesToRadians(lon2 - lon1);

  lat1 = degreesToRadians(lat1);
  lat2 = degreesToRadians(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
};
