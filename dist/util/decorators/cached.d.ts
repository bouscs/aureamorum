export declare function cached<This, Value>(value: () => Value, context: ClassGetterDecoratorContext<This, Value>): ((this: This) => Value) | undefined;
