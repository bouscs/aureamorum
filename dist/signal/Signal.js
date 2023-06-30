import { SignalListener } from './SignalListener';
export class Signal extends Promise {
    get called() {
        return this._called;
    }
    constructor(options = {}) {
        let _resolve;
        super(resolve => {
            _resolve = resolve;
        });
        Object.defineProperty(this, "_listeners", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Set()
        });
        Object.defineProperty(this, "_onceListeners", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Set()
        });
        Object.defineProperty(this, "_called", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "isOnce", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.once((() => {
            _resolve();
        }));
        this.isOnce = Boolean(options.once);
    }
    then(onfulfilled, onrejected) {
        return new Promise((resolve) => {
            if (this._called && this.isOnce) {
                resolve();
                return;
            }
            this.once((() => {
                resolve();
            }));
        }).then(onfulfilled, onrejected);
    }
    call(...args) {
        if (this.isOnce && this._called)
            return;
        const callListener = (listener) => {
            const result = listener(...args);
            if (typeof result === 'function') {
                result(new SignalListener(this, listener));
            }
        };
        for (const listener of this._listeners) {
            callListener(listener);
        }
        for (const listener of this._onceListeners) {
            callListener(listener);
        }
        this._onceListeners.clear();
        this._called = true;
        if (this.isOnce) {
            this._listeners.clear();
            this._onceListeners.clear();
        }
    }
    on(listener) {
        this._listeners.add(listener);
        return new SignalListener(this, listener);
    }
    once(listener) {
        this._onceListeners.add(listener);
        return new SignalListener(this, listener);
    }
    off(listener) {
        this._listeners.delete(listener);
        this._onceListeners.delete(listener);
    }
    clear() {
        this._listeners.clear();
        this._onceListeners.clear();
    }
}
