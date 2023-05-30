export class ManualPromise<T> extends Promise<T> {
  private inner: Promise<T>
  private _resolve!: (value: T | PromiseLike<T>) => void
  private _reject!: (reason: any) => void

  status: 'pending' | 'resolved' | 'rejected' = 'pending'

  private value!: T

  constructor() {
    let _innerResolve!: (value: T | PromiseLike<T>) => void
    let _innerReject!: (reason: any) => void
    let _resolve!: (value: T | PromiseLike<T>) => void
    let _reject!: (reason: any) => void

    const inner = new Promise<T>((resolve, reject) => {
      _innerResolve = resolve
      _innerReject = reject
    })

    super((resolve, reject) => {
      _resolve = resolve
      _reject = reject
    })

    this._resolve = _innerResolve
    this._reject = _innerReject

    this.inner = inner.then(
      value => {
        this.status = 'resolved'
        this.value = value
        _resolve(value)

        return value
      },
      reason => {
        this.status = 'rejected'
        this.value = reason
        _reject(reason)

        return reason
      }
    )

    this.then = this.inner.then.bind(this.inner)
  }

  resolve(value: T) {
    if (this.status !== 'pending') return

    this._resolve(value)
  }

  reject(value: any) {
    if (this.status !== 'pending') return

    this._reject(value)
  }
}
