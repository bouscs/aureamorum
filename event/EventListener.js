import { EventEmitter } from './EventEmitter';
export class EventListener {
    callback;
    emitter;
    event;
    constructor(emitter, event, callback) {
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
