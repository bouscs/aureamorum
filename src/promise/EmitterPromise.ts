import { EventArgs, EventEmitter, EventList } from '../event'
import { AbortPromise } from './AbortPromise'

export interface EmitterPromiseEvents<T> {
  resolve: (value: T) => void
  reject: (reason?: any) => void
  abort: () => void
  error: (reason: any) => void
  progress: (value: number, message?: string, data?: any) => void
}

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

  a!: Events

  constructor(
    executor: (options: {
      resolve: (value: T) => void
      reject: (reason?: any) => void
      abort: () => void

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
        resolve: (value: T) => {
          emitter.emit('resolve', value)
          emitter.clear()
          resolve(value)
        },
        reject: (reason?: any) => {
          emitter.emit('reject', reason)
          emitter.clear()
          reject(reason)
        },
        abort: () => {
          emitter.emit('abort')
          abort.call()
        },
        on: emitter.on.bind(emitter) as any,
        once: emitter.once.bind(emitter) as any,
        off: emitter.off.bind(emitter),
        waitFor: emitter.waitFor.bind(emitter) as any,
        emit: emitter.emit.bind(emitter)
      }).then(value => {
        emitter.emit('resolve', value)
        emitter.clear()
        resolve(value)
      })
    })

    this.emitter = emitter as any

    this.on = this.emitter.on.bind(this.emitter)
    this.once = this.emitter.once.bind(this.emitter)
    this.off = this.emitter.off.bind(this.emitter)
    this.emit = this.emitter.emit.bind(this.emitter)
    this.waitFor = this.emitter.waitFor.bind(this.emitter)
  }
}
