// Local imports
import {ports} from '../globals/defaults/ports';
// Type imports
import type {Coordinates} from '../globals/types/coordinates';
import type {OsmnxServerResponse} from '../globals/lib/osmnx';
import haversineDistance from 'haversine-distance';

/** Request the shortest path between 2 coordinates */
export const osmnxServerRequest = async (
  source: Readonly<Coordinates>,
  target: Readonly<Coordinates>
): Promise<OsmnxServerResponse> => {
  const result = await fetch(
    `http://localhost:${ports.pathfinder}/shortest_path_coordinates`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({source, target}),
    }
  ).then(data => data.json() as Promise<OsmnxServerResponse>);
  return result;
};

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
