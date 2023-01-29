import { parentPort } from 'worker_threads';

export class Worker {
    parentPort.postMessage();
}
