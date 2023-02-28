import { EventArgs } from './types';
import { EventListener } from './EventListener';
export declare class EventEmitter<Events> {
    private _e3;
    on<EventName extends keyof Events>(eventName: EventName, listener: Events[EventName]): EventListener<Events, EventName>;
    once<EventName extends keyof Events>(eventName: EventName, listener: Events[EventName]): EventListener<Events, EventName>;
    off<EventName extends keyof Events>(eventName: EventName, listener: Events[EventName]): void;
    emit<EventName extends keyof Events>(eventName: EventName, ...args: EventArgs<Events, EventName>): void;
}
