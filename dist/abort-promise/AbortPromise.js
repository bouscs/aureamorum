import { Signal } from '../signal';
export class AbortPromise extends Promise {
    constructor(executor) {
        let abort;
        super((resolve, reject) => {
            abort = new Signal();
            abort.once(() => {
                reject(new Error('Aborted'));
                abort.clear();
            });
            executor(resolve, reject, abort);
        });
        Object.defineProperty(this, "abort", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.abort = abort;
    }
    then(onfulfilled, onrejected) {
        return new AbortPromise((resolve, reject, abort) => {
            this.abort.once(() => {
                abort.call();
            });
            super
                .then(onfulfilled, onrejected)
                .then(resolve, reject)
                .finally(() => {
                abort.clear();
            });
        });
    }
}
