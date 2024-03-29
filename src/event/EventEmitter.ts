import EventEmitter3 from 'eventemitter3'
import { EventArgs, EventList } from './types.js'
import { EventListener } from './EventListener.js'

export class EventEmitter<Events extends EventList = EventList> {
  //@ts-ignore
  private _e3 = new EventEmitter3()

  declare $events: Events

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
    ...args: Events[EventName] extends (...args: any[]) => void
      ? Parameters<Events[EventName]>
      : never
  ) {
    this._e3.emit(eventName as any, ...(args as any))
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

  clear() {
    this._e3.removeAllListeners()
  }
}
