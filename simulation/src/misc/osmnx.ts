// Local imports
import {ports} from '../globals/defaults/ports';
// Type imports
import type {Coordinates} from '../globals/types/coordinates';
import type {OsmnxServerResponse} from '../globals/lib/osmnx';

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
