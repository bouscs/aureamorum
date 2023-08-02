import { EventEmitter, EventList } from '../event/index.js';
import { Signal } from '../signal/index.js';
export interface ClockEvents extends EventList {
    update: (delta: number, time: number) => void;
    fixedUpdate: (time: number) => void;
}
export declare class Clock extends EventEmitter<ClockEvents> {
    animationFrame: number;
    minTimeStep: number;
    fixedTimeStep: number;
    updateSignal: Signal<(delta: number, time: number) => void>;
    fixedUpdateSignal: Signal<(time: number) => void>;
    private doTick;
    private running;
    private lastTime;
    private fixedStepAccumulator;
    private fixedStepCounter;
    private _time;
    private _delta;
    get time(): number;
    get delta(): number;
    start(): Promise<void>;
    pause(): void;
    resume(): void;
    stop(): void;
    tick(): Promise<void>;
}
