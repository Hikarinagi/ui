import {
  computed,
  nextTick,
  onMounted,
  onScopeDispose,
  shallowRef,
  watch,
  type CSSProperties,
  type Ref,
} from 'vue'
import { useResizeObserver } from '@vueuse/core'
import { defaultRangeExtractor } from '@tanstack/vue-virtual'
import { useVirtualWindow, virtualFlow } from '../../../lib/virtual/useVirtualWindow'
import { prefersReducedMotion } from '../../../motion'
import { paginationInteger } from '../../pagination/composables/usePagination'
import { scrollDataListItem } from '../utils/scroll'
import type {
  DataListItemSlot,
  DataListKey,
  DataListLayout,
  DataListProps,
  DataListRange,
} from '../types'
import type { VirtualListScrollOptions } from '../../virtual-list/types'

export function useDataListWindow<T>(
  props: {
    options: DataListProps<T>
    entries: readonly DataListItemSlot<T>[]
    layout: DataListLayout
  },
  content: Ref<HTMLElement | undefined>,
  viewport: Ref<HTMLElement | undefined>,
  onRange: (range: DataListRange) => void,
) {
  const settings = computed(() =>
    typeof props.options.virtualize === 'object' ? props.options.virtualize : {},
  )
  const columns = shallowRef(
    props.layout === 'grid' ? paginationInteger(settings.value.initialColumns ?? NaN, 1, 1) : 1,
  )
  const gap = shallowRef(0)
  const margin = shallowRef(0)
  const focused = shallowRef<DataListKey>()
  const focusedIndex = computed(() =>
    focused.value === undefined
      ? -1
      : props.entries.findIndex(entry => entry.key === focused.value),
  )
  const rangeExtractor = computed(() => {
    const retained = Math.floor(focusedIndex.value / columns.value)
    return (range: Parameters<typeof defaultRangeExtractor>[0]) => {
      const indexes = defaultRangeExtractor(range)
      if (retained >= 0 && !indexes.includes(retained)) indexes.push(retained)
      return indexes.sort((a, b) => a - b)
    }
  })
  const enabled = computed(() => !!props.options.virtualize && props.entries.length > 0)
  const virtualizer = useVirtualWindow(
    computed(() => ({
      enabled: enabled.value,
      count: Math.ceil(props.entries.length / columns.value),
      getScrollElement: () => viewport.value ?? null,
      getItemKey: (row: number) => props.entries[row * columns.value]!.key,
      estimateSize: () =>
        paginationInteger(
          settings.value.estimateSize ?? NaN,
          props.layout === 'grid' ? 280 : 112,
          1,
        ),
      overscan: paginationInteger(settings.value.overscan ?? NaN, 3, 0),
      gap: gap.value,
      scrollMargin: margin.value,
      initialRect: {
        width: 320,
        height: typeof props.options.height === 'number' ? props.options.height : 320,
      },
      rangeExtractor: rangeExtractor.value,
    })),
  )
  const flow = computed(() =>
    virtualFlow(
      virtualizer.value.getVirtualItems(),
      virtualizer.value.getTotalSize(),
      margin.value,
    ),
  )
  const before = computed(() => (enabled.value ? Math.max(0, flow.value.before - gap.value) : 0))
  const after = computed(() => (enabled.value ? Math.max(0, flow.value.after - gap.value) : 0))
  const rendered = computed(() =>
    enabled.value
      ? flow.value.entries.flatMap(row =>
          props.entries
            .slice(row.index * columns.value, (row.index + 1) * columns.value)
            .map(entry => ({
              ...entry,
              row: row.index,
              gapBefore: Math.max(0, row.gapBefore - gap.value),
            })),
        )
      : props.entries.map(entry => ({ ...entry, row: 0, gapBefore: 0 })),
  )
  const style = computed<CSSProperties>(() => ({
    '--hn-data-list-min': props.options.gridMin ?? '14rem',
    ...(enabled.value
      ? {
          overflowAnchor: 'none',
        }
      : {}),
  }))
  let observer: ResizeObserver | undefined
  let elements = new Set<HTMLElement>()
  let pending: (() => void) | undefined
  let geometryVersion = 0
  function measureRows() {
    if (!enabled.value) return
    const sizes = new Map<number, number>()
    for (const element of elements) {
      const row = Number(element.dataset.virtualRow)
      sizes.set(row, Math.max(sizes.get(row) ?? 0, element.getBoundingClientRect().height))
    }
    for (const [row, size] of sizes) {
      const key = props.entries[row * columns.value]?.key
      if (size > 0 && key !== undefined && virtualizer.value.itemSizeCache.get(key) !== size)
        virtualizer.value.resizeItem(row, size)
    }
  }
  function observeItems() {
    const next = new Set(
      enabled.value ? content.value?.querySelectorAll<HTMLElement>('[data-hn-data-list-item]') : [],
    )
    for (const element of elements) if (!next.has(element)) observer?.unobserve(element)
    for (const element of next) {
      if (!elements.has(element)) observer?.observe(element)
    }
    elements = next
    measureRows()
  }
  async function geometry() {
    const element = content.value
    if (!enabled.value || !element) return
    const computedStyle = element.ownerDocument.defaultView!.getComputedStyle(element)
    const nextColumns =
      props.layout === 'grid'
        ? Math.max(1, computedStyle.gridTemplateColumns.split(' ').filter(Boolean).length)
        : 1
    const nextGap = parseFloat(computedStyle.rowGap) || 0
    const nextMargin = parseFloat(computedStyle.paddingBlockStart) || 0
    if (nextColumns !== columns.value || nextGap !== gap.value || nextMargin !== margin.value) {
      const version = ++geometryVersion
      const index = (virtualizer.value.range?.startIndex ?? 0) * columns.value
      const atStart = !viewport.value?.scrollTop
      columns.value = nextColumns
      gap.value = nextGap
      margin.value = nextMargin
      virtualizer.value.measure()
      await nextTick()
      if (version !== geometryVersion) return
      observeItems()
      if (!atStart) scrollToIndex(props.entries[index]?.index ?? 0, { align: 'start' })
    }
  }
  function scrollToIndex(index: number, options: VirtualListScrollOptions = {}) {
    if (!Number.isFinite(index) || !props.entries.length) return
    const position = Math.max(
      0,
      Math.min(props.entries.length - 1, Math.trunc(index) - props.entries[0]!.index),
    )
    const action = () => {
      if (enabled.value)
        virtualizer.value.scrollToIndex(Math.floor(position / columns.value), {
          ...options,
          behavior: prefersReducedMotion() ? 'auto' : options.behavior,
        })
      else {
        const element = content.value?.querySelectorAll<HTMLElement>('[data-hn-data-list-item]')[
          position
        ]
        if (element)
          scrollDataListItem(element, viewport.value, {
            ...options,
            behavior: prefersReducedMotion() ? 'auto' : options.behavior,
          })
      }
    }
    if (
      ((props.options.virtualize || props.options.height !== undefined) && !viewport.value) ||
      (enabled.value && virtualizer.value.scrollElement !== viewport.value)
    )
      pending = action
    else action()
  }
  function updateFocus() {
    const active = content.value?.ownerDocument.activeElement
    const row =
      active instanceof Element ? active.closest<HTMLElement>('[data-hn-data-list-item]') : null
    focused.value =
      row && content.value?.contains(row)
        ? props.entries.find(entry => entry.index === Number(row.dataset.index))?.key
        : undefined
  }
  function focusOut() {
    void nextTick(updateFocus)
  }
  onMounted(() => {
    observer = new ResizeObserver(measureRows)
    observeItems()
    void geometry()
  })
  onScopeDispose(() => {
    observer?.disconnect()
    geometryVersion++
    pending = undefined
  })
  useResizeObserver(content, () => {
    void geometry()
  })
  watch(
    [rendered, viewport],
    () => {
      observeItems()
      if (
        viewport.value &&
        (!enabled.value || virtualizer.value.scrollElement === viewport.value)
      ) {
        pending?.()
        pending = undefined
      }
    },
    { flush: 'post' },
  )
  watch(
    () => [props.layout, props.options.gridMin, props.options.gridGap, props.options.virtualize],
    () => {
      void geometry()
    },
    { flush: 'post' },
  )
  watch(
    () => [props.entries[0]?.index, props.options.pagination],
    ([index], previous) => {
      if (
        props.options.pagination &&
        index !== undefined &&
        previous?.[0] !== undefined &&
        index !== previous[0]
      )
        viewport.value?.scrollTo({ top: 0, behavior: 'instant' })
    },
    { flush: 'post' },
  )
  watch(
    () => {
      if (!enabled.value) return [-1, -1]
      const range = virtualizer.value.calculateRange()
      return [
        props.entries[(range?.startIndex ?? 0) * columns.value]?.index ?? -1,
        props.entries[
          Math.min(props.entries.length - 1, ((range?.endIndex ?? 0) + 1) * columns.value - 1)
        ]?.index ?? -1,
      ]
    },
    ([startIndex, endIndex], previous) => {
      if (startIndex !== previous?.[0] || endIndex !== previous?.[1])
        onRange({ startIndex: startIndex!, endIndex: endIndex! })
    },
    { immediate: true, flush: 'post' },
  )
  return { rendered, style, before, after, scrollToIndex, updateFocus, focusOut }
}
