import { Signal } from '../signal';
import { EventEmitter } from './EventEmitter';
export declare class EventListener<Events, EventName extends keyof Events> {
    callback: Events[EventName];
    emitter: EventEmitter<Events>;
    event: EventName;
    constructor(emitter: EventEmitter<Events>, event: EventName, callback: Events[EventName]);
    off(): void;
    until(signal: Signal): Signal;
    until<E>(emitter: EventEmitter<E>, event: keyof E): void;
}
