import { ObjectPath } from './types'

export const getObjectPath = <T, U extends string>(
  obj: T,
  path: U
): ObjectPath<T, U> => {
  const pathArray = path.split('.')
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
