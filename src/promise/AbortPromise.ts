import { Signal } from '../signal'

export class AbortPromise<T> extends Promise<T> {
  public readonly abort: Signal

  constructor(
    executor: (
      resolve: (value: T | PromiseLike<T>) => void,
      reject: (reason?: any) => void,
      abort: Signal
    ) => void
  ) {
    let abort!: Signal
    super((resolve, reject) => {
      abort = new Signal()

      abort.once(() => {
        reject(new Error('Aborted'))
        abort.clear()
      })

      executor(resolve, reject, abort)
    })

    this.abort = abort
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
        abort.call()
      })

      super
        .then(onfulfilled, onrejected)
        .then(resolve, reject)
        .finally(() => {
          abort.clear()
        })
    })
  }
}
