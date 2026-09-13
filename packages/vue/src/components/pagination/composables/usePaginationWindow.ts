import { computed, nextTick, ref, shallowRef, watch } from 'vue'
import { useEventListener, useResizeObserver } from '@vueuse/core'
import type ScrollArea from '../../scroll-area/ScrollArea.vue'
import type { PaginationEllipsisController } from './usePaginationEllipsis'

export function usePaginationWindow(controller: PaginationEllipsisController) {
  const scroll = shallowRef<InstanceType<typeof ScrollArea>>()
  const rowsHost = shallowRef<HTMLElement>()
  const viewport = computed(() => scroll.value?.viewport)
  const top = ref(0)
  const height = ref(224)
  const rowHeight = ref(36)
  const activePage = ref(1)
  const range = controller.displayRange
  const count = computed(() => (range.value ? range.value.to - range.value.from + 1 : 0))
  const extent = computed(() => count.value * rowHeight.value)
  const rows = computed(() => {
    if (!range.value) return []
    const start = Math.max(0, Math.floor(top.value / rowHeight.value) - 3)
    const end = Math.min(count.value, start + Math.ceil(height.value / rowHeight.value) + 7)
    const values = Array.from(
      { length: Math.max(0, end - start) },
      (_, i) => start + i + range.value!.from,
    )
    if (
      activePage.value >= range.value.from &&
      activePage.value <= range.value.to &&
      !values.includes(activePage.value)
    )
      values.push(activePage.value)
    return values.map(page => ({ page, top: (page - range.value!.from) * rowHeight.value }))
  })

  function measure() {
    if (viewport.value) height.value = viewport.value.clientHeight || 224
    const button = rowsHost.value?.querySelector<HTMLElement>('[data-hn-pagination-choice]')
    if (button)
      rowHeight.value =
        button.offsetHeight + (Number.parseFloat(getComputedStyle(rowsHost.value!).rowGap) || 0)
  }

  async function focusPage(page: number) {
    if (!range.value || !controller.open.value) return
    activePage.value = Math.min(range.value.to, Math.max(range.value.from, page))
    const element = viewport.value
    if (element) {
      const offset = (activePage.value - range.value.from) * rowHeight.value
      if (offset < element.scrollTop) element.scrollTop = offset
      else if (offset + rowHeight.value > element.scrollTop + element.clientHeight)
        element.scrollTop = offset + rowHeight.value - element.clientHeight
      top.value = element.scrollTop
    }
    await nextTick()
    rowsHost.value
      ?.querySelector<HTMLElement>('[data-hn-pagination-choice="' + activePage.value + '"]')
      ?.focus({ preventScroll: true })
  }

  function keydown(event: KeyboardEvent) {
    if (!range.value) return
    const step = Math.max(1, Math.floor(height.value / rowHeight.value))
    const targets: Record<string, number> = {
      ArrowDown: activePage.value + 1,
      ArrowUp: activePage.value - 1,
      Home: range.value.from,
      End: range.value.to,
      PageDown: activePage.value + step,
      PageUp: activePage.value - step,
    }
    const target = targets[event.key]
    if (target === undefined) return
    event.preventDefault()
    event.stopPropagation()
    void focusPage(target)
  }

  watch(
    [range, controller.open],
    () => {
      if (!controller.open.value || !range.value) return
      activePage.value = range.value.from
      top.value = 0
      if (viewport.value) viewport.value.scrollTop = 0
    },
    { immediate: true },
  )
  watch(
    [controller.focusRequest, viewport],
    async ([request, element]) => {
      if (!request || !element || !range.value) return
      await nextTick()
      measure()
      await focusPage(request.edge === 'first' ? range.value.from : range.value.to)
      controller.focusRequest.value = undefined
    },
    { flush: 'post' },
  )
  useResizeObserver(
    () => rowsHost.value?.querySelector<HTMLElement>('[data-hn-pagination-choice]'),
    measure,
  )
  useResizeObserver(rowsHost, measure)
  useResizeObserver(viewport, measure)
  useEventListener(
    viewport,
    'scroll',
    () => {
      top.value = viewport.value?.scrollTop ?? 0
    },
    { passive: true },
  )
  return { scroll, rowsHost, activePage, extent, rows, keydown }
}
