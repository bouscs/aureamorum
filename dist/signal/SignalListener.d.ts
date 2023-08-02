import { EventEmitter, EventList } from '../event/index.js';
import { Signal } from './Signal.js';
import { SignalCallback } from './types.js';
export declare class SignalListener<Callback extends (...args: any[]) => void> {
    callback: SignalCallback<Callback>;
    signal: Signal<Callback>;
    constructor(signal: Signal<Callback>, callback: SignalCallback<Callback>);
    off(): void;
    until<T>(promise: Promise<T>): Promise<T>;
    until<E extends EventList>(emitter: EventEmitter<E>, event: keyof E): void;
}
