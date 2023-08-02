import { Class } from './types.js'

export const getClass = <T extends Class>(object: InstanceType<T>): T => {
  return Object.getPrototypeOf(object).constructor
}
