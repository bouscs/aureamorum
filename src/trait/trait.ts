import { Class, Obj } from '../index.js'

export interface TraitOptions {
  name?: string
}

export const trait = <TraitInterface extends Obj>(options?: TraitOptions) => {
  const traitName = options?.name ?? 'trait'
  const symbol = Symbol(traitName)

  return {
    symbol,
    for: <TargetClass extends Class>(target: TargetClass) => {
      return (
        decorated: Class<TraitInterface>,
        context: ClassDecoratorContext
      ) => {
        const { name } = context

        if (name === undefined) {
          throw new Error('Trait must be used as a class decorator')
        }

        if (target.prototype[symbol] !== undefined) {
          throw new Error(
            `Trait '${traitName}' already exists in class '${target.name}'`
          )
        }

        target.prototype[symbol] = new decorated()

        return function () {
          throw new Error('Trait cannot be instantiated')
        } as unknown as typeof decorated
      }
    },
    of: (target: Obj) => {
      return target[symbol as any] as TraitInterface
    }
  }
}
