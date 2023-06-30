import { ObjectPath } from './types';
export declare const getObjectPath: <T, U extends string>(obj: T, path: U) => ObjectPath<T, U>;
