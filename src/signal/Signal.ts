import { SignalListener } from './SignalListener.js'
import { SignalCallback } from './types.js'

export interface SignalOptions {
  once?: boolean
}

export class Signal<
  Callback extends (...args: any[]) => void = () =>
    | void
    | ((listener: SignalListener<any>) => void)
> extends Promise<void> {
  private _listeners: Set<SignalCallback<Callback>> = new Set()
  private _onceListeners: Set<SignalCallback<Callback>> = new Set()
  private _called = false

  isOnce: boolean

  get called() {
    return this._called
  }

  constructor(options: SignalOptions = {}) {
    let _resolve!: () => void

    super(resolve => {
      _resolve = resolve
    })

    this.once((() => {
      _resolve()
    }) as Callback)
    this.isOnce = Boolean(options.once)
  }

  then<TResult1 = void, TResult2 = never>(
    onfulfilled?:
      | ((value: void) => TResult1 | PromiseLike<TResult1>)
      | null
      | undefined,
    onrejected?:
      | ((reason: any) => TResult2 | PromiseLike<TResult2>)
      | null
      | undefined
  ): Promise<TResult1 | TResult2> {
    return new Promise<void>((resolve: () => void) => {
      if (this._called && this.isOnce) {
        resolve()
        return
      }
      this.once((() => {
        resolve()
      }) as Callback)
    }).then(onfulfilled, onrejected)
  }

  call(...args: Parameters<Callback>) {
    if (this.isOnce && this._called) return

    const callListener = (listener: SignalCallback<Callback>) => {
      const result = listener(...args)

      if (typeof result === 'function') {
        result(new SignalListener<Callback>(this, listener))
      }
    }

    for (const listener of this._listeners) {
      callListener(listener)
    }

    for (const listener of this._onceListeners) {
      callListener(listener)
    }

    this._onceListeners.clear()

    this._called = true

    if (this.isOnce) {
      this._listeners.clear()
      this._onceListeners.clear()
    }
  }

  on(listener: SignalCallback<Callback>): SignalListener<Callback> {
    this._listeners.add(listener)

    return new SignalListener(this, listener)
  }

  once(listener: SignalCallback<Callback>) {
    this._onceListeners.add(listener)

    return new SignalListener(this, listener)
  }

  off(listener: SignalCallback<Callback>) {
    this._listeners.delete(listener)
    this._onceListeners.delete(listener)
  }

  clear() {
    this._listeners.clear()
    this._onceListeners.clear()
  }
}
