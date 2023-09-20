import { ObjectPath } from './types.js'

export const getObjectPath = <T, U extends string>(
  obj: T,
  path: U
): ObjectPath<T, U> => {
  const pathArray = path.split('.')
  if (obj === undefined) return undefined as ObjectPath<T, U>
  let current: any = obj
  for (let i = 0; i < pathArray.length; i++) {
    if (current[pathArray[i]] === undefined) {
      return undefined as ObjectPath<T, U>
    } else {
      current = current[pathArray[i]]
    }
  }
  return current as ObjectPath<T, U>
}
