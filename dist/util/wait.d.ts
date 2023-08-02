import { Signal } from '../signal/index.js';
export declare function wait(signal: Signal, times?: number): Promise<void>;
export declare function wait(seconds: number): Promise<void>;
