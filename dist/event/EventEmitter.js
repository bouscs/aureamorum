var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import EventEmitter3 from 'eventemitter3';
import { EventListener } from './EventListener';
export class EventEmitter {
    constructor() {
        Object.defineProperty(this, "_e3", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new EventEmitter3()
        });
    }
    on(eventName, listener) {
        this._e3.on(eventName, listener);
        return new EventListener(this, eventName, listener);
    }
    once(eventName, listener) {
        this._e3.once(eventName, listener);
        return new EventListener(this, eventName, listener);
    }
    off(eventName, listener) {
        this._e3.off(eventName, listener);
    }
    emit(eventName, ...args) {
        this._e3.emit(eventName, ...args);
    }
    waitFor(eventName) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                this.once(eventName, ((...args) => {
                    resolve(args);
                }));
            });
        });
    }
    clear() {
        this._e3.removeAllListeners();
    }
}
