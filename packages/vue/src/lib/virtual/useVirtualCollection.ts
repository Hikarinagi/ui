import { computed, nextTick, onScopeDispose, shallowRef, watch, type Ref } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import { defaultRangeExtractor, observeElementRect } from '@tanstack/vue-virtual'
import { useVirtualWindow, virtualFlow } from './useVirtualWindow'
import {
  VIRTUAL_RECT,
  centeredOffset,
  collectionEstimator,
  collectionOverscan,
  fallbackRect,
  mergeRange,
  overscrolledOffset,
  scrollMargin,
  virtualConfig,
} from '../../../../shared/src/lib/virtual/collection'
import type { VirtualizeOptions } from './types'

export function useVirtualCollection<T>(options: {
  items: () => readonly T[]
  key: (item: T) => string | number
  viewport: Ref<HTMLElement | undefined>
  body: Ref<HTMLElement | undefined>
  config: () => VirtualizeOptions | undefined
  initialIndex?: () => number
  retain?: () => number[]
  include?: (indexes: number[]) => number[]
  estimate?: (item: T) => number
}) {
  const margin = shallowRef(0)
  const config = computed(() => virtualConfig(options.config()))
  const virtualizer = useVirtualWindow(
    computed(() => {
      const items = options.items()
      const retained = options.retain?.() ?? []
      const initialIndex = options.initialIndex?.() ?? -1
      const estimateSize = collectionEstimator(items, config.value, options.estimate)
      return {
        count: items.length,
        getScrollElement: () => options.viewport.value ?? null,
        getItemKey: (index: number) => options.key(items[index]!),
        estimateSize,
        overscan: collectionOverscan(config.value),
        initialRect: VIRTUAL_RECT,
        initialOffset: () => centeredOffset(initialIndex, items.length, estimateSize),
        scrollMargin: margin.value,
        observeElementRect: (instance, callback) =>
          observeElementRect(instance, rect => callback(fallbackRect(rect))),
        rangeExtractor: range =>
          mergeRange(defaultRangeExtractor(range), retained, items.length, options.include),
      }
    }),
  )
  const flow = computed(() =>
    virtualFlow(
      virtualizer.value.getVirtualItems(),
      virtualizer.value.getTotalSize(),
      margin.value,
    ),
  )
  const bodyStyle = computed(() => ({
    paddingBlockStart: `${flow.value.before}px`,
    paddingBlockEnd: `${flow.value.after}px`,
  }))
  function measure(element: unknown) {
    if (element === null) virtualizer.value.measureElement(null)
    else if (options.viewport.value && element instanceof HTMLElement && element.isConnected)
      virtualizer.value.measureElement(element)
  }
  async function refresh() {
    const viewport = options.viewport.value
    const body = options.body.value
    if (viewport && body?.isConnected) margin.value = scrollMargin(body, viewport)
    virtualizer.value.measure()
    await nextTick()
    for (const child of options.body.value?.children ?? []) measure(child)
  }
  let frame: number | undefined
  let width: number | undefined
  useResizeObserver(options.viewport, entries => {
    const next = entries[0]?.contentRect.width
    if (width !== undefined && width !== next) {
      if (frame !== undefined) cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        frame = undefined
        void refresh()
      })
    }
    width = next
  })
  watch(options.viewport, refresh, { flush: 'post' })
  watch(() => config.value.estimateSize, refresh, { flush: 'post' })
  watch(
    () => [config.value.estimateSize, options.items().length],
    async () => {
      await nextTick()
      const viewport = options.viewport.value
      if (!viewport) return
      const offset = overscrolledOffset(
        viewport.scrollTop,
        virtualizer.value.getTotalSize(),
        viewport.clientHeight,
      )
      if (offset !== undefined) virtualizer.value.scrollToOffset(offset)
    },
  )
  onScopeDispose(() => {
    if (frame !== undefined) cancelAnimationFrame(frame)
  })
  return {
    virtualizer,
    entries: computed(() =>
      flow.value.entries.map(entry => ({
        ...entry,
        key: options.key(options.items()[entry.index]!),
      })),
    ),
    bodyStyle,
    measure,
    refresh,
  }
}
