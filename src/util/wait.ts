import { Signal } from '../signal'

export async function wait(signal: Signal, times?: number): Promise<void>
export async function wait(seconds: number): Promise<void>
export async function wait(...args: any[]): Promise<void> {
  if (typeof args[0] === 'number') {
    return new Promise<void>(resolve => {
      setTimeout(() => {
        resolve()
      }, args[0] * 1000)
    })
  }

  if (args[0] instanceof Signal) {
    const signal = args[0]
    const times = (args[1] as number) || 1

    if (times <= 0) throw new Error('times must be greater than 0')

    for (let i = 0; i < times; i++) {
      await signal
    }

    return
  }
}
