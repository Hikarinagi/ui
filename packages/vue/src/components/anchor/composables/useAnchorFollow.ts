import { useResizeObserver } from '@vueuse/core'
import { onBeforeUnmount, onMounted, shallowRef, watch, type Ref } from 'vue'
import { prefersReducedMotion } from '../../../motion'

export function useAnchorFollow(
  root: Readonly<Ref<HTMLElement | null>>,
  current: Readonly<Ref<string | undefined>>,
  enabled: () => boolean,
) {
  const viewport = shallowRef<HTMLElement>()
  let mounted = false
  let frame = 0
  let lastCurrent: string | undefined

  function findViewport(nav: HTMLElement, target: HTMLElement) {
    const doc = nav.ownerDocument
    const view = doc.defaultView!
    for (
      let node: HTMLElement | null = nav;
      node && node !== doc.body && node !== doc.documentElement;
      node = node.parentElement
    ) {
      // A shared page/content scroller is not the directory's own viewport.
      if (node.contains(target)) break
      if (/^(auto|scroll|overlay)$/.test(view.getComputedStyle(node).overflowY)) return node
    }
  }

  function follow() {
    frame = 0
    const nav = root.value
    const id = current.value
    if (!enabled() || !nav || !id) return
    const target = nav.ownerDocument.getElementById(id)
    const link = nav.querySelector<HTMLElement>('a[aria-current="location"]')
    if (!target || !link || !link.getClientRects().length) return
    const port = findViewport(nav, target)
    viewport.value = port
    const changed = lastCurrent !== undefined && lastCurrent !== id
    lastCurrent = id
    if (!port || port.clientHeight <= 0 || port.scrollHeight <= port.clientHeight) return

    const box = port.getBoundingClientRect()
    const row = link.getBoundingClientRect()
    const scale = port.offsetHeight ? box.height / port.offsetHeight : 1
    if (scale <= 0) return
    const top = box.top + port.clientTop * scale
    const bottom = top + port.clientHeight * scale
    if (row.top >= top && row.bottom <= bottom) return
    // A wrapped item taller than the viewport cannot be fully visible. Avoid
    // alternating between its top and bottom when resize observers run again.
    if (row.top <= top && row.bottom >= bottom) return

    const style = port.ownerDocument.defaultView!.getComputedStyle(port)
    const margin = Math.min(row.height / scale / 2, port.clientHeight / 4)
    const padding = (value: string) =>
      Math.min(
        Math.max(0, (port.clientHeight - row.height / scale) / 2),
        value === 'auto'
          ? margin
          : (parseFloat(value) || 0) * (value.endsWith('%') ? port.clientHeight / 100 : 1),
      )
    const before = padding(style.scrollPaddingTop)
    const after = padding(style.scrollPaddingBottom)
    const delta =
      row.height > bottom - top || row.top < top
        ? (row.top - top) / scale - before
        : (row.bottom - bottom) / scale + after
    const next = Math.max(
      0,
      Math.min(port.scrollHeight - port.clientHeight, port.scrollTop + delta),
    )
    if (Math.abs(next - port.scrollTop) < 1) return
    port.scrollTo({
      top: next,
      behavior: changed && !prefersReducedMotion() ? 'smooth' : 'instant',
    })
  }

  function schedule() {
    if (mounted && !frame) frame = requestAnimationFrame(follow)
  }

  watch([root, current, enabled], schedule, { flush: 'post' })
  useResizeObserver(
    () =>
      [root.value, root.value?.parentElement, viewport.value].filter(
        (el): el is HTMLElement => !!el,
      ),
    schedule,
  )
  onMounted(() => {
    mounted = true
    schedule()
  })
  onBeforeUnmount(() => {
    mounted = false
    cancelAnimationFrame(frame)
  })
}
