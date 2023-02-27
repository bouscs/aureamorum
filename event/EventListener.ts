import { Signal } from '$/signal/Signal'
import { EventEmitter } from './EventEmitter'

export class EventListener<Events, EventName extends keyof Events> {
  callback: Events[EventName]
  emitter: EventEmitter<Events>

  event: EventName

  constructor(
    emitter: EventEmitter<Events>,
    event: EventName,
    callback: Events[EventName]
  ) {
    this.callback = callback
    this.emitter = emitter
    this.event = event
  }

  off() {
    this.emitter.off(this.event, this.callback)
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
