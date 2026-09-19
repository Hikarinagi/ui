import { onBeforeUnmount, onMounted, shallowRef, watch, type ShallowRef } from 'vue'
import { useEventListener } from '@vueuse/core'
import { useLayoutTransition } from '../../../lib/layout-stability'
import {
  OverlayScrollbars,
  type OverlayScrollbars as OSInstance,
  type PartialOptions,
} from 'overlayscrollbars'

type OSEvent = 'scroll' | 'updated'

export function useOverlayScrollbars(
  host: ShallowRef<HTMLElement | undefined>,
  content: ShallowRef<HTMLElement | undefined>,
  options: () => PartialOptions,
) {
  const viewport = shallowRef<HTMLElement>()
  const instance = shallowRef<OSInstance>()
  const listeners: Array<[OSEvent, () => void]> = []
  let frameId: number | undefined
  const transitioning = useLayoutTransition()
  let paused: OSInstance | undefined
  const stop = watch(
    [instance, () => transitioning?.value],
    ([current, active]) => {
      if (active && current === paused) return
      const previous = paused
      paused = undefined
      if (previous && !previous.state().destroyed) previous.sleep(false)
      if (active && current && !current.state().sleeping && !current.state().destroyed) {
        paused = current
        current.sleep(true)
      }
    },
    { flush: 'sync' },
  )
  let updateFrame = 0
  useEventListener(content, ['transitionend', 'animationend'], () => {
    if (transitioning?.value) return
    cancelAnimationFrame(updateFrame)
    updateFrame = requestAnimationFrame(() => instance.value?.update(true))
  })

  function onEvent(event: OSEvent, cb: () => void) {
    listeners.push([event, cb])
  }

  onMounted(() => {
    frameId = requestAnimationFrame(() => {
      frameId = undefined
      if (!host.value || !content.value) return
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
    stop()
    paused = undefined
    cancelAnimationFrame(updateFrame)
    if (frameId !== undefined) cancelAnimationFrame(frameId)
    instance.value?.destroy()
    instance.value = undefined
    viewport.value = undefined
  })

  return { viewport, instance, onEvent }
}
