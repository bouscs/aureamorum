import EventEmitter3 from 'eventemitter3';
import { EventListener } from './EventListener';
export class EventEmitter {
    _e3 = new EventEmitter3();
    on(eventName, listener) {
        this._e3.on(eventName, listener);
        return new EventListener(this, eventName, listener);
    }
    once(eventName, listener) {
        this._e3.once(eventName, listener);
        return new EventListener(this, eventName, listener);
    }
    off(eventName, listener) {
        this._e3.off(eventName, listener);
    }
    emit(eventName, ...args) {
        this._e3.emit(eventName, ...args);
    }
}
