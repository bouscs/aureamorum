import { EventEmitter } from '../event';
import { setObjectPath, getObjectPath } from '../util';
export class Store extends EventEmitter {
    constructor(store) {
        super();
        Object.defineProperty(this, "_store", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this._store = store || {};
    }
    mergeDeep(target, source, path = '') {
        const isObject = (obj) => obj && typeof obj === 'object' && !Array.isArray(obj);
        if (!isObject(target) || !isObject(source)) {
            return source;
        }
        Object.keys(source).forEach(key => {
            const targetValue = target[key];
            const sourceValue = source[key];
            if (isObject(targetValue) && isObject(sourceValue)) {
                target[key] = this.mergeDeep(targetValue, sourceValue, path + key + '.');
            }
            else {
                target[key] = sourceValue;
            }
            this.emit('set', {
                path: path + key,
                value: sourceValue,
                previous: targetValue
            });
            this.emit(`set(${path + key})`, {
                value: sourceValue,
                previous: targetValue
            });
        });
        return target;
    }
    set(state, value) {
        if (typeof state === 'string') {
            const path = state;
            if (typeof value === 'function') {
                value = value(this.get(path));
            }
            const targetValue = this.get(path);
            this.emit('set', {
                path,
                value,
                previous: targetValue
            });
            this.emit(`set(${path})`, {
                value,
                previous: targetValue
            });
            this.mergeDeep(targetValue, value, path + '.');
            setObjectPath(this._store, path, value);
        }
        else {
            if (typeof state === 'function') {
                state = state(this._store);
            }
            this.mergeDeep(this._store, state);
        }
    }
    get(path) {
        return getObjectPath(this._store, path);
    }
}
