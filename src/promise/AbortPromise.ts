import { Signal } from '../signal'
import { ManualPromise } from './ManualPromise'

export class AbortPromise<T> extends ManualPromise<T> {
  public readonly abort: Signal

  private innerPromise: Promise<T>

  constructor(
    executor: (
      resolve: (value: T | PromiseLike<T>) => void,
      reject: (reason?: any) => void,
      abort: Signal
    ) => void
  ) {
    const abort = new Signal()

    super()

    abort.once(() => {
      this.reject(new Error('Aborted'))
      abort.clear()
    })

    this.abort = abort

    this.innerPromise = new Promise<T>((resolve, reject) => {
      executor(resolve, reject, abort)
    })

    this.innerPromise
      .then(value => {
        this.resolve(value)
      })
      .catch(reason => {
        this.reject(reason)
      })
      .finally(() => {
        abort.clear()
      })

    this.then = this.innerPromise.then.bind(this.innerPromise)
  }

  // then<TResult1 = T, TResult2 = never>(
  //   onfulfilled?:
  //     | ((value: T) => TResult1 | PromiseLike<TResult1>)
  //     | null
  //     | undefined,
  //   onrejected?:
  //     | ((reason: any) => TResult2 | PromiseLike<TResult2>)
  //     | null
  //     | undefined
  // ): Promise<TResult1 | TResult2> {
  //   return new Promise((resolve, reject) => {
  //     console.log('AbortPromise.then')
  //     console.log(resolve)
  //     if (this.abort.called) {
  //       reject(new Error('Aborted'))
  //     } else {
  //       this.abort.once(() => {
  //         reject(new Error('Aborted'))
  //       })
  //     }

  //     super.then(onfulfilled, onrejected).then(resolve, reject)
  //   })
  // }
}
