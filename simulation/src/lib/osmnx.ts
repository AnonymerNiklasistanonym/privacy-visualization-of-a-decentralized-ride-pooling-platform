// Local imports
// > Globals
import {fetchJson} from '../globals/lib/fetch';
import {pathfinderEndpoints} from '../globals/defaults/endpoints';
import {ports} from '../globals/defaults/ports';
// Type imports
import type {Coordinates} from '../globals/types/coordinates';
import type {OsmnxServerResponse} from '../globals/lib/osmnx';

/** Request the shortest path between 2 coordinates */
export const osmnxServerRequest = async (
  source: Readonly<Coordinates>,
  target: Readonly<Coordinates>
): Promise<OsmnxServerResponse> =>
  fetchJson<OsmnxServerResponse>(
    `http://localhost:${ports.pathfinder}${pathfinderEndpoints.shortestPathCoordinates}`,
    {
      fetchOptions: {
        body: JSON.stringify({source, target}),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      },
      timeoutInMs: 100,
    }
  );
