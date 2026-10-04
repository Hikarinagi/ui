import { markRaw, reactive, type Component } from 'vue'
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

export type ToastItem = SharedToastItem<Component>

export const toastState: { items: ToastItem[] } = reactive({ items: [] })

export const { toast, dismiss, pauseTimers, resumeTimers } = createToastStore<Component>({
  state: toastState,
  raw: component => markRaw(component),
})
