// Package imports
import {Worker} from 'node:worker_threads';

export async function workerCaller<WORKER_DATA, WORKER_RESULT>(
  workerData: Readonly<WORKER_DATA>,
  webWorkerFilePath: string
): Promise<WORKER_RESULT> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(webWorkerFilePath, {
      workerData: workerData,
    });
    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', code => {
      if (code !== 0)
        reject(new Error(`Worker stopped with exit code ${code}`));
    });
  });
}
