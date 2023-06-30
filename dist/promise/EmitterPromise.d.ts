import { EventEmitter } from '../event';
import { Signal } from '../signal';
import { AbortPromise } from './AbortPromise';
export interface EmitterPromiseEvents<T> {
    resolve: (value: T) => void;
    reject: (reason?: any) => void;
    abort: () => void;
    error: (reason: any) => void;
    progress: (value: number, message?: string, data?: any) => void;
}
export type EmitterPromiseExecutorResult<T> = T | Promise<any> | ((...args: any) => EmitterPromiseExecutorResult<any>)[];
export declare class EmitterPromise<T, Events extends EmitterPromiseEvents<T> = EmitterPromiseEvents<T>> extends AbortPromise<T> {
    emitter: EventEmitter<Events>;
    on: EventEmitter<Events>['on'];
    once: EventEmitter<Events>['once'];
    off: EventEmitter<Events>['off'];
    emit: EventEmitter<Events>['emit'];
    waitFor: EventEmitter<Events>['waitFor'];
    constructor(executor: (options: {
        abort: Signal;
        on: EventEmitter<Events>['on'];
        once: EventEmitter<Events>['once'];
        off: EventEmitter<Events>['off'];
        emit: EventEmitter<Events>['emit'];
        waitFor: EventEmitter<Events>['waitFor'];
    }) => Promise<T>);
    static sequence<T, Events extends EmitterPromiseEvents<T> = EmitterPromiseEvents<T>>(sequenceCreator: (options: {
        abort: Signal;
        on: EventEmitter<Events>['on'];
        once: EventEmitter<Events>['once'];
        off: EventEmitter<Events>['off'];
        emit: EventEmitter<Events>['emit'];
        waitFor: EventEmitter<Events>['waitFor'];
    }) => ((...args: any) => any)[], options?: {
        afterEach?: (value?: any) => Promise<any>;
    }): EmitterPromise<T, Events>;
}
