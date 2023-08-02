import { EventEmitter, EventListener } from '../event/index.js'
import {
  NestedPartial,
  ObjectPath,
  setObjectPath,
  getObjectPath
} from '../util/index.js'

export type StoreEvents = {
  set: (options: { path: any; previous: any; value: any }) => void
  [key: `set(${string})`]: (options: { previous: any; value: any }) => void
  [key: `change(${string})`]: (options: { previous: any; value: any }) => void
}

export interface Store<StoreObject> extends EventEmitter<StoreEvents> {
  on<Key extends string>(
    eventName: `set(${Key})`,
    listener: (options: {
      value: ObjectPath<StoreObject, Key>
      previous: ObjectPath<StoreObject, Key>
    }) => void
  ): EventListener<StoreEvents, `set(${Key})`>
  on<Key extends string>(
    eventName: `change(${Key})`,
    listener: (options: {
      value: ObjectPath<StoreObject, Key>
      previous: ObjectPath<StoreObject, Key>
    }) => void
  ): EventListener<StoreEvents, `change(${Key})`>
  on<EventName extends keyof StoreEvents>(
    eventName: EventName,
    listener: StoreEvents[EventName]
  ): EventListener<StoreEvents, EventName>

  off<Key extends string>(
    eventName: `set(${Key})`,
    listener: (options: {
      value: ObjectPath<StoreObject, Key>
      previous: ObjectPath<StoreObject, Key>
    }) => void
  ): void
  off<Key extends string>(
    eventName: `change(${Key})`,
    listener: (options: {
      value: ObjectPath<StoreObject, Key>
      previous: ObjectPath<StoreObject, Key>
    }) => void
  ): void
  off<EventName extends keyof StoreEvents>(
    eventName: EventName,
    listener: StoreEvents[EventName]
  ): void
}

export class Store<StoreObject> extends EventEmitter<StoreEvents> {
  private _store: StoreObject

  constructor(store?: StoreObject) {
    super()

    this._store = store || ({} as StoreObject)
  }

  mergeDeep(target: any, source: any, path = '') {
    const isObject = (obj: any) =>
      obj && typeof obj === 'object' && !Array.isArray(obj)

    if (!isObject(target) || !isObject(source)) {
      return source
    }

    Object.keys(source).forEach(key => {
      const targetValue = target[key]
      const sourceValue = source[key]

      if (isObject(targetValue) && isObject(sourceValue)) {
        target[key] = this.mergeDeep(targetValue, sourceValue, path + key + '.')
      } else {
        target[key] = sourceValue
      }

      this.emit('set', {
        path: path + key,
        value: sourceValue,
        previous: targetValue
      })

      this.emit(`set(${path + key})`, {
        value: sourceValue,
        previous: targetValue
      } as any)
    })

    return target
  }

  set(state: NestedPartial<StoreObject>): void
  set(state: (state: StoreObject) => NestedPartial<StoreObject>): void
  set<T extends string>(path: T, value: ObjectPath<StoreObject, T>): void
  set<T extends string>(
    path: T,
    callback: (value: ObjectPath<StoreObject, T>) => ObjectPath<StoreObject, T>
  ): void
  set(
    state:
      | NestedPartial<StoreObject>
      | ((state: StoreObject) => NestedPartial<StoreObject>)
      | string,
    value?: any
  ): void {
    if (typeof state === 'string') {
      const path = state

      if (typeof value === 'function') {
        value = value(this.get(path))
      }

      const targetValue = this.get(path)

      this.emit('set', {
        path,
        value,
        previous: targetValue
      })

      this.emit(`set(${path})`, {
        value,
        previous: targetValue
      })

      this.mergeDeep(targetValue, value, path + '.')

      setObjectPath(this._store, path, value)
    } else {
      if (typeof state === 'function') {
        state = state(this._store)
      }
      this.mergeDeep(this._store, state)
    }
  }

  get<Path extends string>(path: Path): ObjectPath<StoreObject, Path> {
    return getObjectPath(this._store, path)!
  }
}
