'use client'

import { useLayoutEffect, useState } from 'react'
import {
  Virtualizer,
  measureElement,
  observeElementOffset,
  observeElementRect,
  type VirtualizerOptions,
} from '@tanstack/react-virtual'
import { measuredSize, scrollPosition } from '../../../../shared/src/lib/virtual/flow'
import { useRenderTick } from './useRenderTick'

export { virtualFlow } from '../../../../shared/src/lib/virtual/flow'

export type VirtualWindowOptions = Omit<
  VirtualizerOptions<HTMLElement, HTMLElement>,
  'observeElementRect' | 'observeElementOffset' | 'scrollToFn'
> &
  Partial<
    Pick<
      VirtualizerOptions<HTMLElement, HTMLElement>,
      'observeElementRect' | 'observeElementOffset' | 'scrollToFn'
    >
  >

export function useVirtualWindow(options: VirtualWindowOptions) {
  const tick = useRenderTick()
  const resolved: VirtualizerOptions<HTMLElement, HTMLElement> = {
    observeElementRect,
    observeElementOffset,
    useAnimationFrameWithResizeObserver: true,
    measureElement: (element, entry, instance) => {
      const index = instance.indexFromElement(element)
      return measuredSize(
        measureElement(element, entry, instance),
        instance.itemSizeCache.get(instance.options.getItemKey(index)),
        () => instance.options.estimateSize(index),
      )
    },
    ...options,
    scrollToFn:
      options.scrollToFn ??
      ((offset, { adjustments = 0, behavior }, instance) => {
        instance.scrollElement?.scrollTo({
          ...scrollPosition(
            offset,
            adjustments,
            instance.options.horizontal,
            instance.options.isRtl,
          ),
          behavior,
        })
      }),
    onChange: (instance, sync) => {
      void tick()
      options.onChange?.(instance, sync)
    },
  }
  const [instance] = useState(() => new Virtualizer<HTMLElement, HTMLElement>(resolved))
  instance.setOptions(resolved)

  useLayoutEffect(() => instance._didMount(), [instance])
  useLayoutEffect(() => {
    instance._willUpdate()
  })

  return instance
}
