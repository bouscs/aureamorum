import { EventArgs, EventList } from './types.js';
import { EventListener } from './EventListener.js';
export declare class EventEmitter<Events extends EventList = EventList> {
    private _e3;
    $events: Events;
    on<EventName extends keyof Events>(eventName: EventName, listener: Events[EventName]): EventListener<Events, EventName>;
    once<EventName extends keyof Events>(eventName: EventName, listener: Events[EventName]): EventListener<Events, EventName>;
    off<EventName extends keyof Events>(eventName: EventName, listener: Events[EventName]): void;
    emit<EventName extends keyof Events>(eventName: EventName, ...args: Events[EventName] extends (...args: any[]) => void ? Parameters<Events[EventName]> : never): void;
    waitFor<EventName extends keyof Events>(eventName: EventName): Promise<EventArgs<Events, EventName>>;
    clear(): void;
}
