// Local imports
// > Globals
import {constants, fetch} from 'lib_globals';
// Type imports
import type {Coordinates, OsmnxServerResponse} from 'lib_globals';

/** Request the shortest path between 2 coordinates */
export const osmnxServerRequest = async (
  source: Readonly<Coordinates>,
  target: Readonly<Coordinates>
): Promise<OsmnxServerResponse> =>
  fetch.fetchJson<OsmnxServerResponse>(
    `http://localhost:${constants.ports.pathfinder}${constants.endpoints.pathfinder.shortestPathCoordinates}`,
    {
      fetchOptions: {
        body: JSON.stringify({source, target}),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'POST',
      },
    }
  );
