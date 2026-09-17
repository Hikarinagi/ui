import { computed, onBeforeUnmount, onMounted, shallowRef, type ShallowRef } from 'vue'
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
  const mounted = shallowRef(false)
  const instance = shallowRef<OSInstance>()
  const listeners: Array<[OSEvent, () => void]> = []
  let frameId: number | undefined

  function onEvent(event: OSEvent, cb: () => void) {
    listeners.push([event, cb])
  }

  onMounted(() => {
    mounted.value = true
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
    mounted.value = false
    if (frameId !== undefined) cancelAnimationFrame(frameId)
    instance.value?.destroy()
    instance.value = undefined
    viewport.value = undefined
  })

  return {
    viewport,
    scrollElement: computed(() => viewport.value ?? (mounted.value ? host.value : undefined)),
    instance,
    onEvent,
  }
}
