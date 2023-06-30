export declare const setOnChange: <This, Value extends Record<string | number | symbol, any>>(options: {
    watchedProperties: (keyof Value)[];
    reflectChanges?: keyof This | undefined;
}) => (value: ((this: This) => Value) | ClassAccessorDecoratorTarget<This, Value>, context: ClassAccessorDecoratorContext<This, Value> | ClassGetterDecoratorContext<This, Value>) => {} | undefined;
