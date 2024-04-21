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
      // Abort request with an error if no response is found
      //signal: AbortSignal.timeout(1000),
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({source, target}),
    }
  );
  return result.json() as Promise<OsmnxServerResponse>;
};
