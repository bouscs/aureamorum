import { Signal } from '../signal';
import { ManualPromise } from './ManualPromise';
export declare class AbortPromise<T> extends ManualPromise<T> {
    readonly abort: Signal;
    constructor(executor: (resolve: (value: T) => void, reject: (reason?: any) => void, abort: Signal) => void, abortSignal?: Signal);
}
