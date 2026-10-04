import {
  computed,
  nextTick,
  onScopeDispose,
  shallowRef,
  watch,
  type CSSProperties,
  type Ref,
} from 'vue'
import { useEventListener } from '@vueuse/core'
import type { DataTableColumn } from '../types'
import {
  resizeHandlePositions,
  type DataTableHandlePosition,
} from '../../../../../shared/src/lib/data-table/resize'

export function useTableResizeHandles<T extends object>(
  element: Ref<HTMLTableElement | undefined>,
  viewport: Ref<HTMLElement | undefined>,
  columns: Ref<DataTableColumn<T>[]>,
  enabled: () => boolean,
) {
  const positions = shallowRef<Record<string, DataTableHandlePosition>>({})
  let frame = 0
  let observer: ResizeObserver | undefined
  function update() {
    cancelAnimationFrame(frame)
    frame = 0
    if (!enabled()) return
    const table = element.value
    const area = viewport.value
    if (!table || !area) return
    const box = area.getBoundingClientRect()
    const scale = box.width / area.clientWidth || 1
    const rtl = getComputedStyle(table).direction === 'rtl'
    const cells = new Map(
      [...table.querySelectorAll<HTMLElement>('thead [data-hn-column]')].map(cell => [
        cell.dataset.hnColumn!,
        cell.getBoundingClientRect(),
      ]),
    )
    const next = resizeHandlePositions(columns.value, cells, box, scale, rtl)
    if (JSON.stringify(next) !== JSON.stringify(positions.value)) positions.value = next
  }
  function schedule() {
    if (!enabled()) return
    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(update)
  }
  useEventListener(viewport, 'scroll', schedule, { passive: true })
  watch(
    [element, viewport, columns, enabled],
    async (_, __, onCleanup) => {
      let cancelled = false
      onCleanup(() => {
        cancelled = true
      })
      await nextTick()
      if (cancelled) return
      observer?.disconnect()
      cancelAnimationFrame(frame)
      frame = 0
      if (!enabled() || !element.value || !viewport.value || typeof ResizeObserver === 'undefined')
        return
      observer = new ResizeObserver(update)
      observer.observe(viewport.value)
      element.value
        .querySelectorAll('thead [data-hn-column]')
        .forEach(cell => observer!.observe(cell, { box: 'border-box' }))
    },
    { flush: 'post' },
  )
  onScopeDispose(() => {
    cancelAnimationFrame(frame)
    observer?.disconnect()
  })
  const styles = computed(() =>
    Object.fromEntries(
      Object.entries(positions.value).map(([key, position]) => [
        key,
        {
          '--hn-table-resize-inset': `${position.inset}px`,
          visibility: position.visible ? 'visible' : 'hidden',
        } satisfies CSSProperties,
      ]),
    ),
  )
  return {
    update,
    handleStyle: (column: DataTableColumn<T>): CSSProperties =>
      styles.value[column.key] ?? { visibility: 'hidden' },
    handleVisible: (column: DataTableColumn<T>) => positions.value[column.key]?.visible ?? false,
  }
}
