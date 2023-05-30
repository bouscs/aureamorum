import { Signal } from '../signal'
import { ManualPromise } from './ManualPromise'

export class AbortPromise<T> extends ManualPromise<T> {
  public readonly abort: Signal

  constructor(
    executor: (
      resolve: (value: T) => void,
      reject: (reason?: any) => void,
      abort: Signal
    ) => void,
    abortSignal?: Signal
  ) {
    const abort = abortSignal || new Signal({ once: true })

    super()

    this.abort = abort

    this.abort.then(() => {
      this.reject(undefined)
    })

    executor(this.resolve.bind(this), this.reject.bind(this), abort)
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
  //     this.abort.then(reject)

  //     super.then(onfulfilled, onrejected).then(resolve, reject)
  //   })
  // }
}
