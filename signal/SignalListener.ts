import { EventEmitter } from '$/event/EventEmitter'
import { Signal } from './Signal'

export class SignalListener<Callback extends (...args: any[]) => void> {
  callback: Callback

  signal: Signal<Callback>

  constructor(signal: Signal<Callback>, callback: Callback) {
    this.signal = signal
    this.callback = callback
  }

  off() {
    this.signal.off(this.callback)
  }

  until(signal: Signal): Signal
  until<E>(emitter: EventEmitter<E>, event: keyof E): void
  until(emitter: any, event?: any): void | Signal {
    if (emitter instanceof EventEmitter) {
      emitter.once(event, this.off.bind(this))
    } else {
      const signal = emitter as Signal
      signal.once(this.off.bind(this))
      return signal
    }
  }
}
