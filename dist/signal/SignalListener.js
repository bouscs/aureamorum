import { EventEmitter } from '../event';
export class SignalListener {
    constructor(signal, callback) {
        Object.defineProperty(this, "callback", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "signal", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.signal = signal;
        this.callback = callback;
    }
    off() {
        this.signal.off(this.callback);
    }
    until(emitter, event) {
        if (emitter instanceof EventEmitter) {
            emitter.once(event, this.off.bind(this));
        }
        else {
            const promise = emitter;
            return promise.then(this.off.bind(this));
        }
    }
}
