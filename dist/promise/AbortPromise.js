import { Signal } from '../signal/index.js';
import { ManualPromise } from './ManualPromise.js';
export class AbortPromise extends ManualPromise {
    constructor(executor, abortSignal) {
        const abort = abortSignal || new Signal({ once: true });
        super();
        Object.defineProperty(this, "abort", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.abort = abort;
        this.abort.then(() => {
            this.reject(undefined);
        });
        executor(this.resolve.bind(this), this.reject.bind(this), abort);
    }
}
