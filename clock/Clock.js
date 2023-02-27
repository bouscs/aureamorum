import { EventEmitter } from '$/event/EventEmitter';
import { Signal } from '$/signal/Signal';
export class Clock extends EventEmitter {
    animationFrame = 0;
    minTimeStep = 1 / 200;
    fixedTimeStep = 1 / 60;
    updateSignal = new Signal();
    fixedUpdateSignal = new Signal();
    doTick = false;
    running = false;
    lastTime = 0;
    fixedStepAccumulator = 0;
    _time = 0;
    _delta = 0;
    get time() {
        return this._time;
    }
    get delta() {
        return this._delta;
    }
    async start() {
        this.doTick = true;
        this.running = true;
        this.fixedStepAccumulator = 0;
        this._time = 0;
        this._delta = 0;
        this.lastTime = performance.now();
        while (this.running) {
            await this.tick();
        }
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
    async tick() {
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
                    this.emit('fixedUpdate', this.time);
                    this.fixedUpdateSignal.call(this.time);
                }
            }
            resolve();
        }, this.minTimeStep * 1000));
    }
}
