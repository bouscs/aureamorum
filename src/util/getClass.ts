import { Class } from './types'

export const getClass = <T extends Class>(object: InstanceType<T>): T => {
  return Object.getPrototypeOf(object).constructor
}
