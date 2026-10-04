import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { measureElement, useVirtualizer, type VirtualizerOptions } from '@tanstack/vue-virtual'
import { measuredSize, scrollPosition } from '../../../../shared/src/lib/virtual/flow'

export { virtualFlow } from '../../../../shared/src/lib/virtual/flow'

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
        const index = instance.indexFromElement(element)
        return measuredSize(
          measureElement(element, entry, instance),
          instance.itemSizeCache.get(instance.options.getItemKey(index)),
          () => instance.options.estimateSize(index),
        )
      },
      scrollToFn: (offset, { adjustments = 0, behavior }, instance) => {
        instance.scrollElement?.scrollTo({
          ...scrollPosition(
            offset,
            adjustments,
            instance.options.horizontal,
            instance.options.isRtl,
          ),
          behavior,
        })
      },
      ...toValue(options),
    })),
  )
}
