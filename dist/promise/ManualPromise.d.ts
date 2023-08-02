export declare class ManualPromise<T> extends Promise<T> {
    private inner;
    private _resolve;
    private _reject;
    status: 'pending' | 'resolved' | 'rejected';
    constructor();
    resolve(value: T): void;
    reject(value: any): void;
}
