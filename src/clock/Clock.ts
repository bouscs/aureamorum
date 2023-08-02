import { EventEmitter, EventList } from '../event/index.js'
import { Signal } from '../signal/index.js'

export interface ClockEvents extends EventList {
  update: (delta: number, time: number) => void
  fixedUpdate: (time: number) => void
}

export class Clock extends EventEmitter<ClockEvents> {
  animationFrame = 0

  minTimeStep = 1 / 200

  fixedTimeStep = 1 / 60

  updateSignal = new Signal<(delta: number, time: number) => void>()
  fixedUpdateSignal = new Signal<(time: number) => void>()

  private doTick = false
  private running = false

  private lastTime = 0

  private fixedStepAccumulator = 0
  private fixedStepCounter = 0

  private _time = 0
  private _delta = 0

  get time() {
    return this._time
  }

  get delta() {
    return this._delta
  }

  async start() {
    this.doTick = true
    this.running = true
    this.fixedStepAccumulator = 0
    this.fixedStepCounter = 0
    this._time = 0
    this._delta = 0
    this.lastTime = performance.now()

    while (this.running) {
      await this.tick()
    }
  }

  pause() {
    this.doTick = false
  }

  resume() {
    this.doTick = true
  }

  stop() {
    this.doTick = false
  }

  async tick() {
    return new Promise<void>(resolve =>
      setTimeout(() => {
        if (!this.doTick) {
          this.lastTime = performance.now()
          resolve()
          return
        }
        const time = performance.now()
        const deltaTime = time - this.lastTime

        this.lastTime = time
        this._time += deltaTime
        this.fixedStepAccumulator += deltaTime
        this._delta = deltaTime

        this.emit('update', this.delta, this.time)
        this.updateSignal.call(this.delta, this.time)

        if (this.fixedStepAccumulator / 1000 >= this.fixedTimeStep) {
          const frames = Math.floor(
            this.fixedStepAccumulator / 1000 / this.fixedTimeStep
          )

          this.fixedStepAccumulator %= this.fixedTimeStep * 1000

          for (let i = 0; i < frames; i++) {
            this.fixedStepCounter++
            this.emit('fixedUpdate', this.fixedStepCounter)
            this.fixedUpdateSignal.call(this.fixedStepCounter)
          }
        }

        resolve()
      }, this.minTimeStep * 1000)
    )
  }
}
