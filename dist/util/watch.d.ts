export declare const watch: <This, Value extends Record<string | number | symbol, any>>({ watchedProperties, onPropertiesChange }: {
    watchedProperties: (keyof Value)[];
    reflectChanges?: keyof This | undefined;
    onPropertiesChange?: ((this: This, value: Value) => void) | undefined;
    onSet?: ((this: This, value: Value) => void) | undefined;
}) => (value: ClassAccessorDecoratorTarget<This, Value>) => ClassAccessorDecoratorResult<This, Value>;
