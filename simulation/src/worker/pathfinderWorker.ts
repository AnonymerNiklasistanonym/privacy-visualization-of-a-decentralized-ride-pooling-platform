// Worker imports
import {isMainThread, parentPort, workerData} from 'node:worker_threads';
// Local imports
// > Lib
import {getShortestPathOsmCoordinates} from '../lib/pathfinderOsm';
// Type imports
import type {Coordinates} from '../globals/types/coordinates';
import type {OsmVertexGraph} from '../lib/pathfinderOsm';

export interface WorkerDataPathfinder {
  graph: Readonly<OsmVertexGraph>;
  sourceCoordinates: Readonly<Coordinates>;
  targetCoordinates: Readonly<Coordinates>;
}

export type WorkerResultPathfinder = Array<Coordinates> | null;

export const workerFilePathPathfinder = __filename;

export async function runWorker(
  data: Readonly<WorkerDataPathfinder>
): Promise<WorkerResultPathfinder> {
  return getShortestPathOsmCoordinates(
    data.graph,
    data.sourceCoordinates,
    data.targetCoordinates
  );
}

async function main() {
  if (parentPort === null) {
    throw Error('Parent port was null!');
  }
  const result = await runWorker(workerData);
  parentPort.postMessage(result);
}

if (!isMainThread) {
  main().catch(err => {
    throw err;
  });
}
