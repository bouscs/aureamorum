export const setOnChange = <
  This,
  Value extends Record<string | symbol | number, any>
>(options: {
  watchedProperties: (keyof Value)[]
  reflectChanges?: keyof This
  // onChange?: (this: This, )
}) => {
  options
  return function (
    value: ((this: This) => Value) | ClassAccessorDecoratorTarget<This, Value>,
    context:
      | ClassAccessorDecoratorContext<This, Value>
      | ClassGetterDecoratorContext<This, Value>
  ) {
    if (context.kind === 'accessor') {
      value = value as ClassAccessorDecoratorTarget<This, Value>

      return {}
    }
  }
}
