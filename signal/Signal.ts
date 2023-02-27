import { SignalListener } from './SignalListener'

export class Signal<
  Callback extends (
    ...args: any[]
  ) => void | ((listener: SignalListener<Callback>) => void) = () => void
> extends Promise<void> {
  private _listeners: Set<Callback> = new Set()
  private _onceListeners: Set<Callback> = new Set()
  private _called = false

  isOnce: boolean

  get called() {
    return this._called
  }

  constructor(once = false) {
    let _resolve!: () => void

    super(resolve => {
      _resolve = resolve
    })

    this.once((() => {
      _resolve()
    }) as Callback)
    this.isOnce = once
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
      this.once((() => {
        resolve()
      }) as Callback)
    }).then(onfulfilled, onrejected)
  }

  async call(...args: Parameters<Callback>) {
    if (this.isOnce && this._called) return

    const callListener = async (listener: Callback) => {
      const result = await listener(...args)

      if (typeof result === 'function') {
        await result(new SignalListener(this, listener))
      }
    }

    for (const listener of this._listeners) {
      await callListener(listener)
    }

    for (const listener of this._onceListeners) {
      await callListener(listener)
    }

    this._onceListeners.clear()

    this._called = true

    if (this.isOnce) {
      this._listeners.clear()
      this._onceListeners.clear()
    }
  }

  on(listener: Callback): SignalListener<Callback> {
    this._listeners.add(listener)

    return new SignalListener(this, listener)
  }

  once(listener: Callback) {
    this._onceListeners.add(listener)

    return new SignalListener(this, listener)
  }

  off(listener: Callback) {
    this._listeners.delete(listener)
    this._onceListeners.delete(listener)
  }
}
