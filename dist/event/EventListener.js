import { EventEmitter } from './EventEmitter.js';
export class EventListener {
    constructor(emitter, event, callback) {
        Object.defineProperty(this, "callback", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "emitter", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "event", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.callback = callback;
        this.emitter = emitter;
        this.event = event;
    }
    off() {
        this.emitter.off(this.event, this.callback);
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
