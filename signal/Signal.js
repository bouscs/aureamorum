import { SignalListener } from './SignalListener';
export class Signal extends Promise {
    _listeners = new Set();
    _onceListeners = new Set();
    _called = false;
    isOnce;
    get called() {
        return this._called;
    }
    constructor(once = false) {
        let _resolve;
        super(resolve => {
            _resolve = resolve;
        });
        this.once((() => {
            _resolve();
        }));
        this.isOnce = once;
    }
    then(onfulfilled, onrejected) {
        return new Promise((resolve) => {
            this.once((() => {
                resolve();
            }));
        }).then(onfulfilled, onrejected);
    }
    async call(...args) {
        if (this.isOnce && this._called)
            return;
        const callListener = async (listener) => {
            const result = await listener(...args);
            if (typeof result === 'function') {
                await result(new SignalListener(this, listener));
            }
        };
        for (const listener of this._listeners) {
            await callListener(listener);
        }
        for (const listener of this._onceListeners) {
            await callListener(listener);
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
}
