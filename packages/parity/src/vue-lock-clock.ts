import { vi } from 'vitest'

export const VUE_LOCK_NOW = Date.UTC(2026, 0, 15, 9, 30)

export function freezeVueLockClock() {
  vi.useFakeTimers({ toFake: ['Date'], now: VUE_LOCK_NOW })
}

let started = false

export function startVueLockClock() {
  if (started) return
  started = true
  const native = Date
  const offset = VUE_LOCK_NOW - native.now()
  globalThis.Date = new Proxy(native, {
    construct: (target, args) =>
      args.length ? Reflect.construct(target, args) : new target(target.now() + offset),
    get: (target, key, receiver) =>
      key === 'now' ? () => target.now() + offset : Reflect.get(target, key, receiver),
  })
}
