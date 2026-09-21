import { computed, nextTick, onScopeDispose, shallowRef, watch, type Ref } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import { defaultRangeExtractor, observeElementRect } from '@tanstack/vue-virtual'
import { useVirtualWindow, virtualFlow } from './useVirtualWindow'
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
  const finite = (value: number | undefined, fallback: number) =>
    value !== undefined && Number.isFinite(value) ? value : fallback
  const config = computed(() =>
    typeof options.config() === 'object'
      ? (options.config() as Exclude<VirtualizeOptions, boolean>)
      : {},
  )
  const virtualizer = useVirtualWindow(
    computed(() => {
      const items = options.items()
      const retained = options.retain?.() ?? []
      const initialIndex = options.initialIndex?.() ?? -1
      const estimateSize = (index: number) =>
        Math.max(1, finite(config.value.estimateSize, options.estimate?.(items[index]!) ?? 36))
      return {
        count: items.length,
        getScrollElement: () => options.viewport.value ?? null,
        getItemKey: index => options.key(items[index]!),
        estimateSize,
        overscan: Math.max(0, Math.floor(finite(config.value.overscan, 6))),
        initialRect: { width: 320, height: 320 },
        initialOffset: () => {
          if (initialIndex < 0 || initialIndex >= items.length) return 0
          let offset = (estimateSize(initialIndex) - 320) / 2
          for (let index = 0; index < initialIndex; index++) offset += estimateSize(index)
          return Math.max(0, offset)
        },
        scrollMargin: margin.value,
        observeElementRect: (instance, callback) =>
          observeElementRect(instance, rect =>
            callback({ width: rect.width || 320, height: rect.height || 320 }),
          ),
        rangeExtractor: range => {
          const indexes = [...defaultRangeExtractor(range), ...retained]
          return [...new Set([...indexes, ...(options.include?.(indexes) ?? [])])]
            .filter(index => index >= 0 && index < items.length)
            .sort((a, b) => a - b)
        },
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
  function layoutTop(element: HTMLElement) {
    let top = 0
    for (
      let node: HTMLElement | null = element;
      node;
      node = node.offsetParent as HTMLElement | null
    )
      top += node.offsetTop
    return top
  }
  async function refresh() {
    const viewport = options.viewport.value
    const body = options.body.value
    if (viewport && body?.isConnected)
      margin.value = Math.max(0, layoutTop(body) - layoutTop(viewport))
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
      if (
        viewport &&
        viewport.scrollTop > Math.max(0, virtualizer.value.getTotalSize() - viewport.clientHeight)
      ) {
        virtualizer.value.scrollToOffset(
          Math.max(0, virtualizer.value.getTotalSize() - viewport.clientHeight),
        )
      }
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
