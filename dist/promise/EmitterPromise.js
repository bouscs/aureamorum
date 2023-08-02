var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { EventEmitter } from '../event/index.js';
import { AbortPromise } from './AbortPromise.js';
export class EmitterPromise extends AbortPromise {
    constructor(executor) {
        const emitter = new EventEmitter();
        super((resolve, reject, abort) => {
            executor({
                abort,
                on: emitter.on.bind(emitter),
                once: emitter.once.bind(emitter),
                off: emitter.off.bind(emitter),
                waitFor: emitter.waitFor.bind(emitter),
                emit: emitter.emit.bind(emitter)
            })
                .then(res => {
                resolve(res);
            }, reason => {
                reject(reason);
            })
                .catch(reason => {
                reject(reason);
            })
                .finally(() => {
                emitter.clear();
            });
        });
        Object.defineProperty(this, "emitter", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "on", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "once", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "off", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "emit", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "waitFor", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.emitter = emitter;
        this.on = this.emitter.on.bind(this.emitter);
        this.once = this.emitter.once.bind(this.emitter);
        this.off = this.emitter.off.bind(this.emitter);
        this.emit = this.emitter.emit.bind(this.emitter);
        this.waitFor = this.emitter.waitFor.bind(this.emitter);
    }
    static sequence(sequenceCreator, options) {
        return new EmitterPromise((opt) => __awaiter(this, void 0, void 0, function* () {
            const sequence = sequenceCreator(opt);
            let result = null;
            let rejected = false;
            for (const item of sequence) {
                if (opt.abort.called) {
                    return Promise.reject();
                }
                const newResult = item(result);
                if (newResult instanceof Promise) {
                    result = yield newResult
                        .then(value => value, reason => {
                        rejected = true;
                        return Promise.reject(reason);
                    })
                        .catch(reason => {
                        rejected = true;
                        return Promise.reject(reason);
                    });
                    if (rejected) {
                        return Promise.reject(result);
                    }
                }
                else {
                    result = newResult;
                }
                if (options === null || options === void 0 ? void 0 : options.afterEach) {
                    yield options.afterEach(result);
                }
            }
            return result;
        }));
    }
}
