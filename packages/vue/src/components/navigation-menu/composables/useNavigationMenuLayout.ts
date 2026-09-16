import { computed, shallowRef, watch, type Ref } from 'vue'
import { useElementBounding, useResizeObserver, useWindowSize } from '@vueuse/core'
import type { NavigationMenuOrientation } from '../types'

export function useNavigationMenuLayout(
  root: Ref<HTMLElement | undefined>,
  orientation: () => NavigationMenuOrientation,
  direction: () => 'ltr' | 'rtl',
) {
  const { left, right, update } = useElementBounding(root)
  const { width } = useWindowSize()
  const ancestors = shallowRef<HTMLElement[]>([])
  const bounds = shallowRef({ start: 16, end: width.value - 16 })

  function measure() {
    let start = 16
    let end = width.value - 16
    for (const element of ancestors.value) {
      const overflow = element.ownerDocument.defaultView?.getComputedStyle(element).overflowX
      if (overflow === 'visible') continue
      const rect = element.getBoundingClientRect()
      start = Math.max(start, rect.left + element.clientLeft + 8)
      end = Math.min(end, rect.left + element.clientLeft + element.clientWidth - 8)
    }
    bounds.value = { start, end }
  }

  watch(
    root,
    element => {
      const parents: HTMLElement[] = []
      for (let parent = element?.parentElement; parent; parent = parent.parentElement)
        parents.push(parent)
      ancestors.value = parents
      measure()
    },
    { flush: 'post' },
  )
  watch([left, right, width], measure, { flush: 'post' })
  useResizeObserver(ancestors, () => {
    update()
    measure()
  })

  const available = computed(() => {
    const before = Math.max(0, left.value - bounds.value.start - 10)
    const after = Math.max(0, bounds.value.end - right.value - 10)
    return direction() === 'rtl' ? { start: after, end: before } : { start: before, end: after }
  })
  const side = computed(() =>
    orientation() === 'vertical' &&
    available.value.end < 320 &&
    available.value.start > available.value.end
      ? 'start'
      : 'end',
  )
  const placement = computed(() => {
    if (orientation() === 'horizontal') return 'bottom'
    if (side.value === 'end') return direction() === 'rtl' ? 'left' : 'right'
    return direction() === 'rtl' ? 'right' : 'left'
  })
  const style = computed(() =>
    root.value
      ? {
          '--hn-navigation-max-width': `${orientation() === 'vertical' ? available.value[side.value] : Math.max(0, bounds.value.end - bounds.value.start - 2)}px`,
          '--hn-navigation-min-x': `${bounds.value.start - left.value}px`,
          '--hn-navigation-bound-end': `${bounds.value.end - left.value}px`,
        }
      : undefined,
  )
  return { side, placement, style }
}
