import { onBeforeUnmount, onMounted, shallowRef, type ShallowRef } from 'vue'
import {
  OverlayScrollbars,
  type OverlayScrollbars as OSInstance,
  type PartialOptions,
} from 'overlayscrollbars'

type OSEvent = 'scroll' | 'updated'

export function useOverlayScrollbars(
  host: ShallowRef<HTMLElement | undefined>,
  options: () => PartialOptions,
) {
  const viewport = shallowRef<HTMLElement>()
  const instance = shallowRef<OSInstance>()
  const listeners: Array<[OSEvent, () => void]> = []

  let contentResize: ResizeObserver | undefined
  let observed: Element[] = []

  function observeContent() {
    const vp = viewport.value
    if (!vp || !contentResize) return
    const children = Array.from(vp.children)
    if (children.length === observed.length && children.every((c, i) => c === observed[i])) return
    contentResize.disconnect()
    observed = children
    for (const child of children) contentResize.observe(child)
  }

  function onEvent(event: OSEvent, cb: () => void) {
    listeners.push([event, cb])
  }

  onMounted(() => {
    if (!host.value) return
    instance.value = OverlayScrollbars(host.value, options())
    viewport.value = instance.value.elements().viewport
    contentResize = new ResizeObserver(() => instance.value?.update(true))
    instance.value.on('updated', observeContent)
    for (const [event, cb] of listeners) instance.value.on(event, cb)
    observeContent()
  })

  onBeforeUnmount(() => {
    contentResize?.disconnect()
    contentResize = undefined
    instance.value?.destroy()
    instance.value = undefined
    viewport.value = undefined
  })

  return { viewport, instance, onEvent }
}
