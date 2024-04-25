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
      body: JSON.stringify({source, target}),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    }
  );
  return result.json() as Promise<OsmnxServerResponse>;
};
