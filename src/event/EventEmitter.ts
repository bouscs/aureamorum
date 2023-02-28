import EventEmitter3 from 'eventemitter3'
import { EventArgs } from './types'
import { EventListener } from './EventListener'

export class EventEmitter<Events> {
  private _e3 = new EventEmitter3()

  on<EventName extends keyof Events>(
    eventName: EventName,
    listener: Events[EventName]
  ): EventListener<Events, EventName> {
    this._e3.on(eventName as any, listener as any)

    return new EventListener(this, eventName, listener)
  }

  once<EventName extends keyof Events>(
    eventName: EventName,
    listener: Events[EventName]
  ): EventListener<Events, EventName> {
    this._e3.once(eventName as any, listener as any)

    return new EventListener(this, eventName, listener)
  }

  off<EventName extends keyof Events>(
    eventName: EventName,
    listener: Events[EventName]
  ) {
    this._e3.off(eventName as any, listener as any)
  }

  emit<EventName extends keyof Events>(
    eventName: EventName,
    ...args: EventArgs<Events, EventName>
  ) {
    this._e3.emit(eventName as any, ...args)
  }

  async waitFor<EventName extends keyof Events>(
    eventName: EventName
  ): Promise<EventArgs<Events, EventName>> {
    return new Promise(resolve => {
      this.once(eventName, ((...args: any[]) => {
        resolve(args as any)
      }) as any)
    })
  }
}
