import { EventEmitter } from '../event';
import { Signal } from './Signal';
export declare class SignalListener<Callback extends (...args: any[]) => void> {
    callback: Callback;
    signal: Signal<Callback>;
    constructor(signal: Signal<Callback>, callback: Callback);
    off(): void;
    until(signal: Signal): Signal;
    until<E>(emitter: EventEmitter<E>, event: keyof E): void;
}
