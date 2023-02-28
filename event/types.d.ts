export type EventList = Record<string | symbol, (...args: unknown[]) => void>;
export type EventType<Events extends EventList, EventName extends keyof Events> = Events[EventName] extends (...args: unknown[]) => void ? Events[EventName] : never;
export type EventArgs<Events, EventName extends keyof Events> = Events[EventName] extends (...args: infer Args) => void ? Args : never;
