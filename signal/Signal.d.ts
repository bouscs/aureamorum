import { SignalListener } from './SignalListener';
export declare class Signal<Callback extends (...args: any[]) => void | ((listener: SignalListener<Callback>) => void) = () => void> extends Promise<void> {
    private _listeners;
    private _onceListeners;
    private _called;
    isOnce: boolean;
    get called(): boolean;
    constructor(once?: boolean);
    then<TResult1 = void, TResult2 = never>(onfulfilled?: ((value: void) => TResult1 | PromiseLike<TResult1>) | null | undefined, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined): Promise<TResult1 | TResult2>;
    call(...args: Parameters<Callback>): Promise<void>;
    on(listener: Callback): SignalListener<Callback>;
    once(listener: Callback): any;
    off(listener: Callback): void;
}
