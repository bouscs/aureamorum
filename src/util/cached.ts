export function cached<This, Value>(
  value: () => Value,
  { kind, name }: ClassGetterDecoratorContext<This, Value>
) {
  if (kind === 'getter') {
    return function (this: This) {
      const result = value.call(this)
      Object.defineProperty(this, name, {
        value: result,
        writable: false
      })
      return result
    }
  }
}
