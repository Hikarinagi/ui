import { computed, nextTick, onScopeDispose, shallowRef, watch, type CSSProperties } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import { defaultRangeExtractor, type VirtualItem } from '@tanstack/vue-virtual'
import { useDirection } from '../../../lib/useDirection'
import { useVirtualWindow, virtualFlow } from '../../../lib/virtual/useVirtualWindow'
import { prefersReducedMotion } from '../../../motion'
import type ScrollArea from '../../scroll-area/ScrollArea.vue'
import type {
  VirtualListKey,
  VirtualListProps,
  VirtualListRange,
  VirtualListScrollOptions,
} from '../types'

function nonnegative(value: number) {
  return Number.isFinite(value) ? Math.max(0, value) : 0
}

export function useVirtualList<T>(
  props: VirtualListProps<T>,
  onRangeChange: (range: VirtualListRange) => void,
) {
  const { root, direction, rootDirection } = useDirection(() => props.dir)
  const area = shallowRef<InstanceType<typeof ScrollArea>>()
  const list = shallowRef<HTMLElement>()
  const viewport = computed(() => area.value?.viewport)
  const focusedKey = shallowRef<VirtualListKey>()
  const horizontal = computed(() => props.orientation === 'horizontal')
  const keys = computed(() => props.items.map(props.getKey))
  const focusedIndex = computed(() =>
    focusedKey.value === undefined ? -1 : keys.value.indexOf(focusedKey.value),
  )
  watch(focusedIndex, index => {
    if (index < 0) focusedKey.value = undefined
  })
  const virtualizer = useVirtualWindow(
    computed(() => {
      const items = props.items
      const itemKeys = keys.value
      const retained = focusedIndex.value
      const estimate = props.estimateSize ?? 48
      return {
        count: items.length,
        getScrollElement: () => viewport.value ?? null,
        getItemKey: (index: number) => itemKeys[index]!,
        estimateSize: (index: number) =>
          Math.max(
            1,
            nonnegative(typeof estimate === 'function' ? estimate(items[index]!, index) : estimate),
          ),
        horizontal: horizontal.value,
        isRtl: direction.value === 'rtl',
        overscan: Math.floor(nonnegative(props.overscan ?? 5)),
        gap: nonnegative(props.gap ?? 0),
        paddingStart: nonnegative(props.paddingStart ?? 0),
        paddingEnd: nonnegative(props.paddingEnd ?? 0),
        initialOffset: nonnegative(props.initialOffset ?? 0),
        initialRect: props.initialRect ?? {
          width: 320,
          height: typeof props.height === 'number' ? props.height : 320,
        },
        rangeExtractor: (range: Parameters<typeof defaultRangeExtractor>[0]) => {
          const indexes = defaultRangeExtractor(range)
          if (retained >= 0 && !indexes.includes(retained)) indexes.push(retained)
          return indexes.sort((a, b) => a - b)
        },
      }
    }),
  )
  const flow = computed(() =>
    virtualFlow(virtualizer.value.getVirtualItems(), virtualizer.value.getTotalSize()),
  )
  const entries = computed(() =>
    flow.value.entries.map(entry => ({
      ...entry,
      key: keys.value[entry.index]!,
    })),
  )
  const contentStyle = computed<CSSProperties>(() => {
    const { before: start, after: end } = flow.value
    return horizontal.value
      ? {
          width: 'max-content',
          height: '100%',
          paddingInlineStart: `${start}px`,
          paddingInlineEnd: `${end}px`,
        }
      : { width: '100%', paddingBlockStart: `${start}px`, paddingBlockEnd: `${end}px` }
  })
  const rootStyle = computed<CSSProperties>(() => ({
    height: typeof props.height === 'string' ? props.height : `${props.height ?? 320}px`,
  }))

  function itemStyle(entry: VirtualItem & { gapBefore: number }): CSSProperties {
    return horizontal.value
      ? {
          marginInlineStart: `${entry.gapBefore}px`,
          width: props.dynamic === false ? `${entry.size}px` : undefined,
        }
      : {
          marginBlockStart: `${entry.gapBefore}px`,
          height: props.dynamic === false ? `${entry.size}px` : undefined,
        }
  }

  function measureElement(element: unknown) {
    if (element === null) {
      virtualizer.value.measureElement(null)
      return
    }
    if (
      props.dynamic !== false &&
      viewport.value &&
      element instanceof HTMLElement &&
      element.isConnected
    ) {
      virtualizer.value.measureElement(element)
    }
  }

  async function measure() {
    virtualizer.value.measure()
    await nextTick()
    for (const child of list.value?.children ?? []) measureElement(child)
  }

  function updateFocus() {
    const element = list.value
    const active = element?.ownerDocument.activeElement
    const row = active && [...(element?.children ?? [])].find(child => child.contains(active))
    focusedKey.value = row ? keys.value[Number(row.getAttribute('data-index'))] : undefined
  }

  function onFocusOut() {
    void nextTick(updateFocus)
  }

  let pendingScroll: (() => void) | undefined
  function scroll(action: () => void) {
    if (viewport.value) action()
    else pendingScroll = action
  }

  function behavior(value: VirtualListScrollOptions['behavior']) {
    return prefersReducedMotion() ? 'auto' : value
  }

  function scrollToIndex(index: number, options: VirtualListScrollOptions = {}) {
    if (!Number.isFinite(index)) return
    scroll(() => {
      if (props.items.length)
        virtualizer.value.scrollToIndex(Math.trunc(index), {
          ...options,
          behavior: behavior(options.behavior),
        })
    })
  }

  function scrollToOffset(
    offset: number,
    options: Pick<VirtualListScrollOptions, 'behavior'> = {},
  ) {
    if (!Number.isFinite(offset)) return
    scroll(() =>
      virtualizer.value.scrollToOffset(nonnegative(offset), {
        behavior: behavior(options.behavior),
      }),
    )
  }

  watch(
    viewport,
    element => {
      if (!element) return
      void measure()
      pendingScroll?.()
      pendingScroll = undefined
    },
    { flush: 'post' },
  )

  watch(
    () => {
      const range = virtualizer.value.calculateRange()
      return [range?.startIndex ?? -1, range?.endIndex ?? -1] as const
    },
    ([startIndex, endIndex], previous) => {
      if (startIndex !== previous?.[0] || endIndex !== previous?.[1])
        onRangeChange({ startIndex, endIndex })
    },
    { immediate: true, flush: 'post' },
  )

  watch(() => [props.dynamic, props.estimateSize, props.orientation], measure)
  let crossSize: number | undefined
  let frame: number | undefined
  useResizeObserver(viewport, entries => {
    const rect = entries[0]?.contentRect
    if (!rect) return
    const next = horizontal.value ? rect.height : rect.width
    if (crossSize !== undefined && crossSize !== next && props.dynamic !== false) {
      if (frame !== undefined) cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        frame = undefined
        void measure()
      })
    }
    crossSize = next
  })
  onScopeDispose(() => {
    if (frame !== undefined) cancelAnimationFrame(frame)
  })

  return {
    root,
    rootDirection,
    area,
    list,
    viewport,
    entries,
    contentStyle,
    rootStyle,
    itemStyle,
    measureElement,
    measure,
    updateFocus,
    onFocusOut,
    scrollToIndex,
    scrollToOffset,
  }
}
