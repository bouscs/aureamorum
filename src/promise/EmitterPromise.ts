import { EventArgs, EventEmitter, EventList } from '../event'
import { Signal } from '../signal'
import { AbortPromise } from './AbortPromise'
import { ManualPromise } from './ManualPromise'

export interface EmitterPromiseEvents<T> {
  resolve: (value: T) => void
  reject: (reason?: any) => void
  abort: () => void
  error: (reason: any) => void
  progress: (value: number, message?: string, data?: any) => void
}

export type EmitterPromiseExecutorResult<T> =
  | T
  | Promise<any>
  | ((...args: any) => EmitterPromiseExecutorResult<any>)[]

export class EmitterPromise<
  T,
  Events extends EmitterPromiseEvents<T> = EmitterPromiseEvents<T>
> extends AbortPromise<T> {
  public emitter: EventEmitter<Events>

  public on: EventEmitter<Events>['on']
  public once: EventEmitter<Events>['once']
  public off: EventEmitter<Events>['off']
  public emit: EventEmitter<Events>['emit']
  public waitFor: EventEmitter<Events>['waitFor']

  constructor(
    executor: (options: {
      abort: Signal

      on: EventEmitter<Events>['on']
      once: EventEmitter<Events>['once']
      off: EventEmitter<Events>['off']
      emit: EventEmitter<Events>['emit']
      waitFor: EventEmitter<Events>['waitFor']
    }) => Promise<T>
  ) {
    const emitter = new EventEmitter<EmitterPromiseEvents<T>>()
    super((resolve, reject, abort) => {
      executor({
        abort,
        on: emitter.on.bind(emitter) as any,
        once: emitter.once.bind(emitter) as any,
        off: emitter.off.bind(emitter),
        waitFor: emitter.waitFor.bind(emitter) as any,
        emit: emitter.emit.bind(emitter)
      })
        .then(
          res => {
            resolve(res)
          },
          reason => {
            reject(reason)
          }
        )
        .catch(reason => {
          reject(reason)
        })
        .finally(() => {
          emitter.clear()
        })
    })

    this.emitter = emitter as any

    this.on = this.emitter.on.bind(this.emitter)
    this.once = this.emitter.once.bind(this.emitter)
    this.off = this.emitter.off.bind(this.emitter)
    this.emit = this.emitter.emit.bind(this.emitter)
    this.waitFor = this.emitter.waitFor.bind(this.emitter)
  }

  static sequence<
    T,
    Events extends EmitterPromiseEvents<T> = EmitterPromiseEvents<T>
  >(
    sequenceCreator: (options: {
      abort: Signal

      on: EventEmitter<Events>['on']
      once: EventEmitter<Events>['once']
      off: EventEmitter<Events>['off']
      emit: EventEmitter<Events>['emit']
      waitFor: EventEmitter<Events>['waitFor']
    }) => ((...args: any) => any)[]
  ) {
    return new EmitterPromise<T, Events>(async options => {
      const sequence = sequenceCreator(options)
      let result: any = null
      let rejected = false
      for (const item of sequence) {
        if (options.abort.called) {
          return Promise.reject()
        }

        const newResult = item(result)

        if (newResult instanceof Promise) {
          result = await newResult
            .then(
              value => value,
              reason => {
                rejected = true
                return Promise.reject(reason)
              }
            )
            .catch(reason => {
              rejected = true
              return Promise.reject(reason)
            })
          if (rejected) {
            return Promise.reject(result)
          }
        } else {
          result = newResult
        }
      }

      return result
    })
  }
}
