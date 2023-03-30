export const watch = <
  This,
  Value extends Record<string | symbol | number, any>
>({
  watchedProperties,
  onPropertiesChange,
  onSet
}: {
  watchedProperties: (keyof Value)[]
  reflectChanges?: keyof This
  onPropertiesChange?: (this: This, value: Value) => void
  onSet?: (this: This, value: Value) => void
}) => {
  return function (
    value: ClassAccessorDecoratorTarget<This, Value>,
    context: ClassAccessorDecoratorContext<This, Value>
  ): ClassAccessorDecoratorResult<This, Value> {
    return {
      get(this: This) {
        const target = this
        const r = value.get.call(this)

        const props = new Map()

        for (const prop of watchedProperties) {
          props.set(prop, r[prop])
        }

        Object.defineProperties(
          r,
          watchedProperties.reduce((acc, current) => {
            return {
              ...acc,
              get [current]() {
                return props.get(current)
              },
              set [current](value: any) {
                props.set(current, value)

                onPropertiesChange?.call(target, value.get.call(target))
              }
            }
          }, {} as any)
        )

        return r
      }
    } as ClassAccessorDecoratorResult<This, Value>
  }
}
