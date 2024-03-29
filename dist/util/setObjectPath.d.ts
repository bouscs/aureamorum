import { ObjectPath } from './types.js';
export declare const setObjectPath: <T, U extends string>(obj: T, path: U, value: any, onSet?: ((path: string, value: any) => void) | undefined) => void;
