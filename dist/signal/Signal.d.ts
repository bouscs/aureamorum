import { SignalListener } from './SignalListener.js';
import { SignalCallback } from './types.js';
export interface SignalOptions {
    once?: boolean;
}
export declare class Signal<Callback extends (...args: any[]) => void = () => void | ((listener: SignalListener<any>) => void)> extends Promise<void> {
    private _listeners;
    private _onceListeners;
    private _called;
    isOnce: boolean;
    get called(): boolean;
    constructor(options?: SignalOptions);
    then<TResult1 = void, TResult2 = never>(onfulfilled?: ((value: void) => TResult1 | PromiseLike<TResult1>) | null | undefined, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined): Promise<TResult1 | TResult2>;
    call(...args: Parameters<Callback>): void;
    on(listener: SignalCallback<Callback>): SignalListener<Callback>;
    once(listener: SignalCallback<Callback>): SignalListener<Callback>;
    off(listener: SignalCallback<Callback>): void;
    clear(): void;
}
