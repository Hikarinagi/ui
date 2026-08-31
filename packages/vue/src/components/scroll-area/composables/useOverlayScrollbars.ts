import { onBeforeUnmount, onMounted, shallowRef, type ShallowRef } from 'vue'
import {
  OverlayScrollbars,
  type OverlayScrollbars as OSInstance,
  type PartialOptions,
} from 'overlayscrollbars'

type OSEvent = 'scroll' | 'updated'

type IdleRequest = (callback: () => void, options?: { timeout: number }) => number

function idleScheduler(): [(task: () => void) => void, () => void] {
  if (typeof window === 'undefined') {
    const noop = () => {}
    return [noop, noop]
  }
  const hasIdle = typeof window.requestIdleCallback === 'function'
  const request: IdleRequest = hasIdle ? window.requestIdleCallback : window.requestAnimationFrame
  const cancelRequest = hasIdle ? window.cancelIdleCallback : window.cancelAnimationFrame
  let requestId: number | undefined
  let frameId: number | undefined

  const cancel = () => {
    if (requestId !== undefined) cancelRequest(requestId)
    if (frameId !== undefined) cancelAnimationFrame(frameId)
    requestId = undefined
    frameId = undefined
  }
  const schedule = (task: () => void) => {
    cancel()
    requestId = request(
      hasIdle
        ? () => {
            cancel()
            frameId = requestAnimationFrame(task)
          }
        : task,
      { timeout: 2233 },
    )
  }
  return [schedule, cancel]
}

export function useOverlayScrollbars(
  host: ShallowRef<HTMLElement | undefined>,
  content: ShallowRef<HTMLElement | undefined>,
  options: () => PartialOptions,
) {
  const viewport = shallowRef<HTMLElement>()
  const instance = shallowRef<OSInstance>()
  const listeners: Array<[OSEvent, () => void]> = []
  const [schedule, cancelSchedule] = idleScheduler()

  let lastGesture = Number.NEGATIVE_INFINITY
  let retryId: ReturnType<typeof setTimeout> | undefined

  const markGesture = () => {
    lastGesture = performance.now()
  }

  function onEvent(event: OSEvent, cb: () => void) {
    listeners.push([event, cb])
  }

  onMounted(() => {
    const target = host.value
    if (target) {
      for (const name of ['wheel', 'touchmove', 'scroll'] as const) {
        target.addEventListener(name, markGesture, { passive: true, capture: true })
      }
    }
    schedule(function takeover() {
      if (!host.value || !content.value) return
      if (performance.now() - lastGesture < 250) {
        retryId = setTimeout(takeover, 300)
        return
      }
      if (target) {
        for (const name of ['wheel', 'touchmove', 'scroll'] as const) {
          target.removeEventListener(name, markGesture, { capture: true })
        }
      }
      instance.value = OverlayScrollbars(
        {
          target: host.value,
          elements: { viewport: content.value, content: content.value },
        },
        options(),
      )
      viewport.value = instance.value.elements().viewport
      for (const [event, cb] of listeners) instance.value.on(event, cb)
    })
  })

  onBeforeUnmount(() => {
    cancelSchedule()
    clearTimeout(retryId)
    if (host.value) {
      for (const name of ['wheel', 'touchmove', 'scroll'] as const) {
        host.value.removeEventListener(name, markGesture, { capture: true })
      }
    }
    instance.value?.destroy()
    instance.value = undefined
    viewport.value = undefined
  })

  return { viewport, instance, onEvent }
}
