export class ManualPromise<T> extends Promise<T> {
  private _resolve!: (value: T | PromiseLike<T>) => void
  private _reject!: (reason: any) => void

  status: 'pending' | 'resolved' | 'rejected' = 'pending'

  private value!: T

  constructor() {
    let _resolve!: (value: T | PromiseLike<T>) => void
    let _reject!: (reason: any) => void

    super((resolve, reject) => {
      _resolve = resolve
      _reject = reject
    })

    this._resolve = _resolve as any
    this._reject = _reject
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
    if (this.status === 'resolved')
      return Promise.resolve(this.value).then(onfulfilled)
    if (this.status === 'rejected')
      return Promise.reject(this.value).then(onrejected)
    return new Promise((resolve, reject) => {
      const _resolve = this._resolve
      const _reject = this._reject
      this._resolve = (value: T | PromiseLike<T>) => {
        _resolve(value)
        resolve(Promise.resolve(value).then(onfulfilled))
      }
      this._reject = (value: T) => {
        _reject(value)
        reject(Promise.reject(value).then(onrejected))
      }
    })
  }

  resolve(value: T) {
    this.value = value
    this.status = 'resolved'
    this._resolve(value)
  }

  reject(value: any) {
    this.value = value
    this.status = 'rejected'
    this._reject(value)
  }
}
