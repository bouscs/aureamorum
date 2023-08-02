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
import { Signal } from '../signal/index.js';
export class Clock extends EventEmitter {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "animationFrame", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "minTimeStep", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1 / 200
        });
        Object.defineProperty(this, "fixedTimeStep", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1 / 60
        });
        Object.defineProperty(this, "updateSignal", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Signal()
        });
        Object.defineProperty(this, "fixedUpdateSignal", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Signal()
        });
        Object.defineProperty(this, "doTick", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "running", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "lastTime", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "fixedStepAccumulator", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "fixedStepCounter", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "_time", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "_delta", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
    }
    get time() {
        return this._time;
    }
    get delta() {
        return this._delta;
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            this.doTick = true;
            this.running = true;
            this.fixedStepAccumulator = 0;
            this.fixedStepCounter = 0;
            this._time = 0;
            this._delta = 0;
            this.lastTime = performance.now();
            while (this.running) {
                yield this.tick();
            }
        });
    }
    pause() {
        this.doTick = false;
    }
    resume() {
        this.doTick = true;
    }
    stop() {
        this.doTick = false;
    }
    tick() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => setTimeout(() => {
                if (!this.doTick) {
                    this.lastTime = performance.now();
                    resolve();
                    return;
                }
                const time = performance.now();
                const deltaTime = time - this.lastTime;
                this.lastTime = time;
                this._time += deltaTime;
                this.fixedStepAccumulator += deltaTime;
                this._delta = deltaTime;
                this.emit('update', this.delta, this.time);
                this.updateSignal.call(this.delta, this.time);
                if (this.fixedStepAccumulator / 1000 >= this.fixedTimeStep) {
                    const frames = Math.floor(this.fixedStepAccumulator / 1000 / this.fixedTimeStep);
                    this.fixedStepAccumulator %= this.fixedTimeStep * 1000;
                    for (let i = 0; i < frames; i++) {
                        this.fixedStepCounter++;
                        this.emit('fixedUpdate', this.fixedStepCounter);
                        this.fixedUpdateSignal.call(this.fixedStepCounter);
                    }
                }
                resolve();
            }, this.minTimeStep * 1000));
        });
    }
}
