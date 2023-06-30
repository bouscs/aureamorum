import { EventEmitter, EventListener } from '../event';
import { NestedPartial, ObjectPath } from '../util';
export type StoreEvents = {
    set: (options: {
        path: any;
        previous: any;
        value: any;
    }) => void;
    [key: `set(${string})`]: (options: {
        previous: any;
        value: any;
    }) => void;
    [key: `change(${string})`]: (options: {
        previous: any;
        value: any;
    }) => void;
};
export interface Store<StoreObject> extends EventEmitter<StoreEvents> {
    on<Key extends string>(eventName: `set(${Key})`, listener: (options: {
        value: ObjectPath<StoreObject, Key>;
        previous: ObjectPath<StoreObject, Key>;
    }) => void): EventListener<StoreEvents, `set(${Key})`>;
    on<Key extends string>(eventName: `change(${Key})`, listener: (options: {
        value: ObjectPath<StoreObject, Key>;
        previous: ObjectPath<StoreObject, Key>;
    }) => void): EventListener<StoreEvents, `change(${Key})`>;
    on<EventName extends keyof StoreEvents>(eventName: EventName, listener: StoreEvents[EventName]): EventListener<StoreEvents, EventName>;
    off<Key extends string>(eventName: `set(${Key})`, listener: (options: {
        value: ObjectPath<StoreObject, Key>;
        previous: ObjectPath<StoreObject, Key>;
    }) => void): void;
    off<Key extends string>(eventName: `change(${Key})`, listener: (options: {
        value: ObjectPath<StoreObject, Key>;
        previous: ObjectPath<StoreObject, Key>;
    }) => void): void;
    off<EventName extends keyof StoreEvents>(eventName: EventName, listener: StoreEvents[EventName]): void;
}
export declare class Store<StoreObject> extends EventEmitter<StoreEvents> {
    private _store;
    constructor(store?: StoreObject);
    mergeDeep(target: any, source: any, path?: string): any;
    set(state: NestedPartial<StoreObject>): void;
    set(state: (state: StoreObject) => NestedPartial<StoreObject>): void;
    set<T extends string>(path: T, value: ObjectPath<StoreObject, T>): void;
    set<T extends string>(path: T, callback: (value: ObjectPath<StoreObject, T>) => ObjectPath<StoreObject, T>): void;
    get<Path extends string>(path: Path): ObjectPath<StoreObject, Path>;
}
