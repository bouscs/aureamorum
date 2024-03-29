import { EventEmitter, EventList } from '../event/index.js'
import { Signal } from './Signal.js'
import { SignalCallback } from './types.js'

export class SignalListener<Callback extends (...args: any[]) => void> {
  callback: SignalCallback<Callback>

  signal: Signal<Callback>

  constructor(signal: Signal<Callback>, callback: SignalCallback<Callback>) {
    this.signal = signal
    this.callback = callback
  }

  off() {
    this.signal.off(this.callback)
  }

  until<T>(promise: Promise<T>): Promise<T>
  until<E extends EventList>(emitter: EventEmitter<E>, event: keyof E): void
  until(emitter: any, event?: any): void | Promise<any> {
    if (emitter instanceof EventEmitter) {
      emitter.once(event, this.off.bind(this))
    } else {
      const promise = emitter as Promise<any>

      return promise.then(this.off.bind(this))
    }
  }
}
