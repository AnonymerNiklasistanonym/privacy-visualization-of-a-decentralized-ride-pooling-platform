// Local imports
// > Lib
import {haversineDistance} from './haversineDistance';
// Type imports
import type {Coordinates} from '../globals/types/coordinates';

export const getTravelTimeInMs = (distanceInM: number, speedInKmH: number) =>
  (distanceInM / 1000 /* 1000m=1km */ / speedInKmH) *
  3600000; /* 1h=60min, 1min=60s, 1s=1000ms */

export const getTravelTimeInMsCoordinates = (
  coordinatesA: Readonly<Coordinates>,
  coordinatesB: Readonly<Coordinates>,
  speedInKmH: number
) =>
  getTravelTimeInMs(haversineDistance(coordinatesA, coordinatesB), speedInKmH);

export interface CoordinatesWithTime extends Coordinates {
  /** The distance between this coordinate and the previous one. */
  distanceInM: number;
  /** The travel time between this coordinate and the previous one. */
  travelTimeInMs: number;
}

/**
 * Add the distance and travel time to coordinates in a path.
 *
 * @param coordinates The path.
 * @param speedInKmH The speed that the path is being driven.
 * @returns The path with the new properties.
 */
export const updateRouteCoordinatesWithTime = (
  coordinates: ReadonlyArray<Coordinates>,
  speedInKmH: number = 50
): CoordinatesWithTime[] => {
  if (coordinates.length === 0) {
    return [];
  }
  return coordinates.map((a, index) => {
    const distanceInM = haversineDistance(
      coordinates[index > 0 ? index - 1 : index],
      a
    );
    return {
      ...a,
      distanceInM,
      travelTimeInMs: getTravelTimeInMs(distanceInM, speedInKmH),
    };
  });
};

export interface InterpolatedCoordinatesFromPath {
  travelTimeInMs: number;
  getCurrentPosition: (currentTravelTimeInMs: number) => Coordinates;
}

export const interpolateCurrentCoordinatesFromPath = (
  coordinatesPath: ReadonlyArray<Coordinates>,
  speedInKmH: number
): InterpolatedCoordinatesFromPath => {
  if (coordinatesPath.length < 2) {
    throw Error('A coordinates path cannot be smaller than 2 coordinates!');
  }
  const coordinatesPathWithTime = updateRouteCoordinatesWithTime(
    coordinatesPath,
    speedInKmH
  );
  const travelTimeInMs = coordinatesPathWithTime.reduce(
    (sum, a) => sum + a.travelTimeInMs,
    0
  );
  return {
    getCurrentPosition: (currentTravelTimeInMs: number) => {
      // Determine between which coordinates the actor is at the moment:
      let travelTimeInMsToStart = 0;
      let startCoordinates = coordinatesPathWithTime[0];
      let endCoordinates = coordinatesPathWithTime[1];
      for (let i = 1; i < coordinatesPathWithTime.length; i++) {
        if (
          travelTimeInMsToStart + coordinatesPathWithTime[i].travelTimeInMs >=
          currentTravelTimeInMs
        ) {
          // Reached coordinates that are not yet reached (= end coordinates)
          startCoordinates = coordinatesPathWithTime[i - 1];
          endCoordinates = coordinatesPathWithTime[i];
          break;
        }
        travelTimeInMsToStart += coordinatesPathWithTime[i].travelTimeInMs;
      }
      // Interpolate position between the 2 coordinates
      const interpolVal =
        endCoordinates.travelTimeInMs === 0
          ? 0
          : (currentTravelTimeInMs - travelTimeInMsToStart) /
            endCoordinates.travelTimeInMs;
      return {
        lat:
          startCoordinates.lat +
          (endCoordinates.lat - startCoordinates.lat) * interpolVal,
        long:
          startCoordinates.long +
          (endCoordinates.long - startCoordinates.long) * interpolVal,
      };
    },
    travelTimeInMs,
  };
};
