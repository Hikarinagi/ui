import { markRaw, reactive, type Component } from 'vue'
import { DURATION } from '../../motion'

export type ToastTone = 'neutral' | 'success' | 'danger' | 'warning' | 'info' | 'loading'

export type ToasterPosition =
  'bottom-end' | 'bottom-start' | 'bottom-center' | 'top-end' | 'top-start' | 'top-center'

export interface ToastAction {
  label: string
  onClick?: () => void
}

export interface ToastItem {
  id: number | string
  tone: ToastTone
  message: string
  description?: string
  duration: number
  open: boolean
  action?: ToastAction
  cancel?: ToastAction
  component?: Component
  componentProps?: Record<string, unknown>
  onDismiss?: (id: number | string) => void
  onAutoClose?: (id: number | string) => void
}

export interface ToastOptions {
  id?: number | string
  tone?: ToastTone
  description?: string
  duration?: number
  action?: ToastAction
  cancel?: ToastAction
  onDismiss?: (id: number | string) => void
  onAutoClose?: (id: number | string) => void
}

type MessageInput<T> = string | { message: string; description?: string } | T

export interface ToastPromiseMessages<T> {
  loading: string
  success: MessageInput<(value: T) => string | { message: string; description?: string }>
  error: MessageInput<(reason: unknown) => string | { message: string; description?: string }>
}

const MAX_VISIBLE = 5
const SETTLE_DELAY = (DURATION.exit + 0.06) * 1000

let seed = 0

export const toastState = reactive<{ items: ToastItem[] }>({ items: [] })

interface Timer {
  handle: ReturnType<typeof setTimeout> | undefined
  remaining: number
  startedAt: number
}

const timers = new Map<number | string, Timer>()
const pauseReasons = new Set<string>()

function fire(id: number | string) {
  timers.delete(id)
  const item = toastState.items.find(t => t.id === id)
  if (item) close(item, 'auto')
}

function startTimer(item: ToastItem) {
  stopTimer(item.id)
  if (item.duration <= 0) return
  const timer: Timer = { handle: undefined, remaining: item.duration, startedAt: Date.now() }
  timers.set(item.id, timer)
  if (pauseReasons.size === 0) timer.handle = setTimeout(() => fire(item.id), timer.remaining)
}

function stopTimer(id: number | string) {
  const timer = timers.get(id)
  if (timer?.handle) clearTimeout(timer.handle)
  timers.delete(id)
}

export function pauseTimers(reason: string) {
  if (pauseReasons.has(reason)) return
  const wasRunning = pauseReasons.size === 0
  pauseReasons.add(reason)
  if (!wasRunning) return
  for (const timer of timers.values()) {
    if (!timer.handle) continue
    clearTimeout(timer.handle)
    timer.handle = undefined
    timer.remaining = Math.max(0, timer.remaining - (Date.now() - timer.startedAt))
  }
}

export function resumeTimers(reason: string) {
  pauseReasons.delete(reason)
  if (pauseReasons.size > 0) return
  for (const [id, timer] of timers) {
    if (timer.handle) continue
    timer.startedAt = Date.now()
    timer.handle = setTimeout(() => fire(id), timer.remaining)
  }
}

function settle(item: ToastItem) {
  const index = toastState.items.indexOf(item)
  if (index >= 0) toastState.items.splice(index, 1)
}

function close(item: ToastItem, source: 'manual' | 'auto') {
  if (!item.open) return
  item.open = false
  stopTimer(item.id)
  if (source === 'auto') item.onAutoClose?.(item.id)
  item.onDismiss?.(item.id)
  setTimeout(() => settle(item), SETTLE_DELAY)
}

export function dismiss(id?: number | string) {
  for (const item of toastState.items) {
    if (id !== undefined && item.id !== id) continue
    close(item, 'manual')
  }
}

function defaultDuration(tone: ToastTone) {
  return tone === 'loading' ? 0 : 4000
}

interface InternalOptions extends ToastOptions {
  component?: Component
  componentProps?: Record<string, unknown>
}

function push(message: string, options: InternalOptions = {}) {
  const tone = options.tone ?? 'neutral'
  const existing =
    options.id !== undefined ? toastState.items.find(t => t.id === options.id) : undefined

  if (existing && existing.open) {
    existing.tone = tone
    existing.message = message
    existing.description = options.description
    existing.duration = options.duration ?? defaultDuration(tone)
    existing.action = options.action
    existing.cancel = options.cancel
    existing.component = options.component ? markRaw(options.component) : undefined
    existing.componentProps = options.componentProps
    if (options.onDismiss) existing.onDismiss = options.onDismiss
    if (options.onAutoClose) existing.onAutoClose = options.onAutoClose
    startTimer(existing)
    return existing.id
  }

  if (existing) settle(existing)

  const item: ToastItem = {
    id: options.id ?? ++seed,
    tone,
    message,
    description: options.description,
    duration: options.duration ?? defaultDuration(tone),
    open: true,
    action: options.action,
    cancel: options.cancel,
    component: options.component ? markRaw(options.component) : undefined,
    componentProps: options.componentProps,
    onDismiss: options.onDismiss,
    onAutoClose: options.onAutoClose,
  }
  toastState.items.push(item)
  startTimer(item)

  const visible = toastState.items.filter(t => t.open)
  for (const stale of visible.slice(0, Math.max(0, visible.length - MAX_VISIBLE))) {
    close(stale, 'manual')
  }
  return item.id
}

function resolveMessage(
  input: MessageInput<(v: never) => string | { message: string; description?: string }>,
  value: unknown,
): { message: string; description?: string } {
  const raw = typeof input === 'function' ? (input as (v: unknown) => unknown)(value) : input
  if (typeof raw === 'string') return { message: raw }
  return raw as { message: string; description?: string }
}

type TonedOptions = Omit<ToastOptions, 'tone'>

function promiseToast<T>(
  promise: Promise<T>,
  messages: ToastPromiseMessages<T>,
  options: TonedOptions = {},
): Promise<T> {
  const id = push(messages.loading, { ...options, tone: 'loading', duration: 0 })
  promise
    .then(value => {
      const done = resolveMessage(messages.success, value)
      push(done.message, { ...options, id, tone: 'success', description: done.description })
    })
    .catch(reason => {
      const done = resolveMessage(messages.error, reason)
      push(done.message, { ...options, id, tone: 'danger', description: done.description })
    })
  return promise
}

export const toast = Object.assign(
  (message: string, options?: ToastOptions) => push(message, options),
  {
    success: (message: string, options?: TonedOptions) =>
      push(message, { ...options, tone: 'success' }),
    danger: (message: string, options?: TonedOptions) =>
      push(message, { ...options, tone: 'danger' }),
    warning: (message: string, options?: TonedOptions) =>
      push(message, { ...options, tone: 'warning' }),
    info: (message: string, options?: TonedOptions) => push(message, { ...options, tone: 'info' }),
    loading: (message: string, options?: TonedOptions) =>
      push(message, { ...options, tone: 'loading' }),
    custom: (
      component: Component,
      options?: TonedOptions & { props?: Record<string, unknown> },
    ) => {
      const { props: componentProps, ...rest } = options ?? {}
      return push('', { ...rest, component, componentProps })
    },
    promise: promiseToast,
    dismiss,
  },
)
