export declare const cachedSymbol: unique symbol;
export declare function cached<This, Value>(value: () => Value, { kind, name }: ClassGetterDecoratorContext<This, Value>): (this: This) => any;
export declare const clearCached: <T, K extends keyof T>(target: T, property: K) => void;
export declare const refreshCached: <T, K extends keyof T>(target: T, property: K) => void;
