import { Signal } from '../signal/index.js';
import { EventEmitter } from './EventEmitter.js';
import { EventList } from './types.js';
export declare class EventListener<Events extends EventList = EventList, EventName extends keyof Events = any> {
    callback: Events[EventName];
    emitter: EventEmitter<Events>;
    event: EventName;
    constructor(emitter: EventEmitter<Events>, event: EventName, callback: Events[EventName]);
    off(): void;
    until(signal: Signal): Signal;
    until<E extends EventList>(emitter: EventEmitter<E>, event: keyof E): void;
}
