import { Signal } from '../signal/index.js'
import { EventEmitter } from './EventEmitter.js'
import { EventList } from './types.js'

export class EventListener<
  Events extends EventList = EventList,
  EventName extends keyof Events = any
> {
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
  until<E extends EventList>(emitter: EventEmitter<E>, event: keyof E): void
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
