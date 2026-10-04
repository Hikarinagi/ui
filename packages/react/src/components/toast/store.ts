import type { ComponentType } from 'react'
import {
  createToastStore,
  type ToastItem as SharedToastItem,
} from '../../../../shared/src/behavior/toast'

export type {
  ToastTone,
  ToasterPosition,
  ToastAction,
  ToastOptions,
  ToastPromiseMessages,
} from '../../../../shared/src/behavior/toast'

export type ToastComponent = ComponentType<any>

export type ToastItem = SharedToastItem<ToastComponent>

const listeners = new Set<() => void>()
let version = 0

export const toastState: { items: ToastItem[] } = { items: [] }

export function subscribeToasts(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function toastVersion() {
  return version
}

export const { toast, dismiss, pauseTimers, resumeTimers } = createToastStore<ToastComponent>({
  state: toastState,
  notify: () => {
    version += 1
    for (const listener of listeners) listener()
  },
})
