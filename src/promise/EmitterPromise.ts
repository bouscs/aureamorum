import { EventArgs, EventEmitter, EventList } from '../event'
import { AbortPromise } from './AbortPromise'

export class EmitterPromise<
  T,
  Events extends EventList
> extends AbortPromise<T> {
  private emitter: EventEmitter<Events>

  public on: EventEmitter<Events>['on']
  public once: EventEmitter<Events>['once']
  public off: EventEmitter<Events>['off']
  public emit: EventEmitter<Events>['emit']
  public waitFor: EventEmitter<Events>['waitFor']

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
    }) => void
  ) {
    const emitter = new EventEmitter<Events>()
    super((resolve, reject, abort) => {
      executor({
        resolve,
        reject,
        abort: () => {
          abort.call()
        },
        on: emitter.on.bind(emitter),
        once: emitter.once.bind(emitter),
        off: emitter.off.bind(emitter),
        waitFor: emitter.waitFor.bind(emitter),
        emit: emitter.emit.bind(emitter)
      })
    })

    this.emitter = emitter

    this.on = this.emitter.on.bind(this.emitter)
    this.once = this.emitter.once.bind(this.emitter)
    this.off = this.emitter.off.bind(this.emitter)
    this.emit = this.emitter.emit.bind(this.emitter)
    this.waitFor = this.emitter.waitFor.bind(this.emitter)
  }

  then<TResult1 = T, TResult2 = never>(
    onfulfilled?:
      | ((value: T) => TResult1 | PromiseLike<TResult1>)
      | null
      | undefined,
    onrejected?:
      | ((reason: any) => TResult2 | PromiseLike<TResult2>)
      | null
      | undefined
  ): Promise<TResult1 | TResult2> {
    return new AbortPromise((resolve, reject, abort) => {
      this.abort.once(() => {
        abort()
      })

      const thisEmit = this.emit

      this.emit = (eventName, ...args) => {
        thisEmit(eventName, ...args)
        emit(eventName, ...args)
      }

      on('error', reject as any)

      super
        .then(onfulfilled, onrejected)
        .then(resolve, reject)
        .finally(() => {
          off('error', reject as any)
          abort()
        })
    })
  }
}
