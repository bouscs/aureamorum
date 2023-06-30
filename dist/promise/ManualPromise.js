export class ManualPromise extends Promise {
    constructor() {
        let _innerResolve;
        let _innerReject;
        let _resolve;
        let _reject;
        const inner = new Promise((resolve, reject) => {
            _innerResolve = resolve;
            _innerReject = reject;
        });
        super((resolve, reject) => {
            _resolve = resolve;
            _reject = reject;
        });
        Object.defineProperty(this, "inner", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_resolve", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_reject", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "status", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'pending'
        });
        Object.defineProperty(this, "value", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this._resolve = _innerResolve;
        this._reject = _innerReject;
        this.inner = inner.then(value => {
            this.status = 'resolved';
            this.value = value;
            _resolve(value);
            return value;
        }, reason => {
            this.status = 'rejected';
            this.value = reason;
            _reject(reason);
            return reason;
        });
        this.then = this.inner.then.bind(this.inner);
    }
    resolve(value) {
        if (this.status !== 'pending')
            return;
        this._resolve(value);
    }
    reject(value) {
        if (this.status !== 'pending')
            return;
        this._reject(value);
    }
}
