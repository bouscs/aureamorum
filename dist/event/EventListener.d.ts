import { Signal } from '../signal';
import { EventEmitter } from './EventEmitter';
import { EventList } from './types';
export declare class EventListener<Events extends EventList = EventList, EventName extends keyof Events = any> {
    callback: Events[EventName];
    emitter: EventEmitter<Events>;
    event: EventName;
    constructor(emitter: EventEmitter<Events>, event: EventName, callback: Events[EventName]);
    off(): void;
    until(signal: Signal): Signal;
    until<E extends EventList>(emitter: EventEmitter<E>, event: keyof E): void;
}
