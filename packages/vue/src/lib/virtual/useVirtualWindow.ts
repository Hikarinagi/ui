import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import {
  measureElement,
  useVirtualizer,
  type VirtualizerOptions,
  type VirtualItem,
} from '@tanstack/vue-virtual'

type Options = Omit<
  VirtualizerOptions<HTMLElement, HTMLElement>,
  'observeElementRect' | 'observeElementOffset' | 'scrollToFn'
> &
  Partial<
    Pick<
      VirtualizerOptions<HTMLElement, HTMLElement>,
      'observeElementRect' | 'observeElementOffset' | 'scrollToFn'
    >
  >

export function useVirtualWindow(options: MaybeRefOrGetter<Options>) {
  return useVirtualizer<HTMLElement, HTMLElement>(
    computed(() => ({
      useAnimationFrameWithResizeObserver: true,
      measureElement: (element, entry, instance) => {
        const size = measureElement(element, entry, instance)
        const index = instance.indexFromElement(element)
        return size > 0
          ? size
          : (instance.itemSizeCache.get(instance.options.getItemKey(index)) ??
              instance.options.estimateSize(index))
      },
      scrollToFn: (offset, { adjustments = 0, behavior }, instance) => {
        instance.scrollElement?.scrollTo({
          [instance.options.horizontal ? 'left' : 'top']:
            (offset + adjustments) *
            (instance.options.horizontal && instance.options.isRtl ? -1 : 1),
          behavior,
        })
      },
      ...toValue(options),
    })),
  )
}

export function virtualFlow(items: VirtualItem[], total: number, margin = 0) {
  return {
    entries: items.map((item, index) => ({
      ...item,
      gapBefore: index ? Math.max(0, item.start - items[index - 1]!.end) : 0,
    })),
    before: Math.max(0, (items[0]?.start ?? margin) - margin),
    after: Math.max(0, total - ((items.at(-1)?.end ?? margin) - margin)),
  }
}
