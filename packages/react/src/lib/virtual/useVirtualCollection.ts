'use client'

import { useCallback, useEffect, useRef, type RefObject } from 'react'
import { defaultRangeExtractor, observeElementRect } from '@tanstack/react-virtual'
import { useVirtualWindow, virtualFlow } from './useVirtualWindow'
import { useRenderTick } from './useRenderTick'
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

export interface VirtualCollectionOptions<T> {
  items: readonly T[]
  key: (item: T) => string | number
  viewport: HTMLElement | undefined
  body: RefObject<HTMLElement | null>
  config: VirtualizeOptions | undefined
  initialIndex?: number
  retain?: number[]
  include?: (indexes: number[]) => number[]
  estimate?: (item: T) => number
}

export function useVirtualCollection<T>(options: VirtualCollectionOptions<T>) {
  const tick = useRenderTick()
  const margin = useRef(0)
  const viewportRef = useRef(options.viewport)
  viewportRef.current = options.viewport
  const config = virtualConfig(options.config)
  const { items, key, body } = options
  const retained = options.retain ?? []
  const initialIndex = options.initialIndex ?? -1
  const estimateSize = collectionEstimator(items, config, options.estimate)
  const virtualizer = useVirtualWindow({
    count: items.length,
    getScrollElement: () => viewportRef.current ?? null,
    getItemKey: index => key(items[index]!),
    estimateSize,
    overscan: collectionOverscan(config),
    initialRect: VIRTUAL_RECT,
    initialOffset: () => centeredOffset(initialIndex, items.length, estimateSize),
    scrollMargin: margin.current,
    observeElementRect: (instance, callback) =>
      observeElementRect(instance, rect => callback(fallbackRect(rect))),
    rangeExtractor: range =>
      mergeRange(defaultRangeExtractor(range), retained, items.length, options.include),
  })
  const flow = virtualFlow(
    virtualizer.getVirtualItems(),
    virtualizer.getTotalSize(),
    margin.current,
  )
  const bodyStyle = {
    paddingBlockStart: `${flow.before}px`,
    paddingBlockEnd: `${flow.after}px`,
  }
  const entries = flow.entries.map(entry => ({ ...entry, key: key(items[entry.index]!) }))

  const measure = useCallback(
    (element: unknown) => {
      if (element === null) virtualizer.measureElement(null)
      else if (viewportRef.current && element instanceof HTMLElement && element.isConnected)
        virtualizer.measureElement(element)
    },
    [virtualizer],
  )

  const refresh = useCallback(async () => {
    const viewport = viewportRef.current
    const element = body.current
    if (viewport && element?.isConnected) margin.current = scrollMargin(element, viewport)
    virtualizer.measure()
    await tick()
    for (const child of body.current?.children ?? []) measure(child)
  }, [body, measure, tick, virtualizer])

  const previousViewport = useRef(options.viewport)
  useEffect(() => {
    if (previousViewport.current === options.viewport) return
    previousViewport.current = options.viewport
    void refresh()
  }, [options.viewport, refresh])

  const estimate = config.estimateSize
  const previousEstimate = useRef(estimate)
  useEffect(() => {
    if (previousEstimate.current === estimate) return
    previousEstimate.current = estimate
    void refresh()
  }, [estimate, refresh])

  const previousShape = useRef({ estimate, length: items.length })
  useEffect(() => {
    const previous = previousShape.current
    if (previous.estimate === estimate && previous.length === items.length) return
    previousShape.current = { estimate, length: items.length }
    void tick().then(() => {
      const viewport = viewportRef.current
      if (!viewport) return
      const offset = overscrolledOffset(
        viewport.scrollTop,
        virtualizer.getTotalSize(),
        viewport.clientHeight,
      )
      if (offset !== undefined) virtualizer.scrollToOffset(offset)
    })
  }, [estimate, items.length, tick, virtualizer])

  useEffect(() => {
    const viewport = options.viewport
    if (!viewport) return
    let frame: number | undefined
    let width: number | undefined
    const observer = new ResizeObserver(observed => {
      const next = observed[0]?.contentRect.width
      if (width !== undefined && width !== next) {
        if (frame !== undefined) cancelAnimationFrame(frame)
        frame = requestAnimationFrame(() => {
          frame = undefined
          void refresh()
        })
      }
      width = next
    })
    observer.observe(viewport)
    return () => {
      observer.disconnect()
      if (frame !== undefined) cancelAnimationFrame(frame)
    }
  }, [options.viewport, refresh])

  return { virtualizer, entries, bodyStyle, measure, refresh }
}
