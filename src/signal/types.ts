import { SignalListener } from './SignalListener'

export type SignalCallback<Callback extends (...args: any[]) => any> = (
  ...args: Parameters<Callback>
) => void | ((listener: SignalListener<Callback>) => void)
