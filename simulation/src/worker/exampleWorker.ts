// Worker imports
import {isMainThread, parentPort, workerData} from 'node:worker_threads';
// Local imports
// > Lib
import {wait} from '../lib/wait';

export interface WorkerDataExample {
  message: string;
}

export type WorkerResultExample = string;

export const workerFilePathExample = __filename;

export async function runWorker(
  data: Readonly<WorkerDataExample>
): Promise<WorkerResultExample> {
  await wait(5 * 1000);
  return `Received ${data.message}`;
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
