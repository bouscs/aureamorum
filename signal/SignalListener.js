import { EventEmitter } from '../event';
export class SignalListener {
    callback;
    signal;
    constructor(signal, callback) {
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
            const signal = emitter;
            signal.once(this.off.bind(this));
            return signal;
        }
    }
}
