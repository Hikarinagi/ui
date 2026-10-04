'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { defaultRangeExtractor } from '@tanstack/react-virtual'
import { useDirection } from '../../../lib/useDirection'
import { useVirtualWindow, virtualFlow } from '../../../lib/virtual/useVirtualWindow'
import { useRenderTick } from '../../../lib/virtual/useRenderTick'
import { useScrollAreaViewport } from '../../../lib/virtual/useScrollAreaViewport'
import { prefersReducedMotion } from '../../../motion'
import {
  listContentStyle,
  listEstimator,
  listInitialRect,
  listItemStyle,
  listRootStyle,
  nonnegative,
  retainIndex,
} from '../../../../../shared/src/lib/virtual/list'
import type { ScrollAreaHandle } from '../../scroll-area/ScrollArea'
import type {
  VirtualListKey,
  VirtualListProps,
  VirtualListRange,
  VirtualListScrollOptions,
} from '../types'

export function useVirtualList<T>(
  props: VirtualListProps<T>,
  onRangeChange: (range: VirtualListRange) => void,
) {
  const { root, direction, rootDirection } = useDirection<HTMLDivElement>(props.dir)
  const area = useRef<ScrollAreaHandle>(null)
  const list = useRef<HTMLUListElement>(null)
  const viewport = useScrollAreaViewport(area)
  const viewportRef = useRef(viewport)
  viewportRef.current = viewport
  const tick = useRenderTick()
  const [focusedKey, setFocusedKey] = useState<VirtualListKey>()
  const horizontal = props.orientation === 'horizontal'
  const keys = useMemo(() => props.items.map(props.getKey), [props.items, props.getKey])
  const focusedIndex = focusedKey === undefined ? -1 : keys.indexOf(focusedKey)
  useEffect(() => {
    if (focusedIndex < 0) setFocusedKey(undefined)
  }, [focusedIndex])

  const items = props.items
  const retained = focusedIndex
  const virtualizer = useVirtualWindow({
    count: items.length,
    getScrollElement: () => viewportRef.current ?? null,
    getItemKey: index => keys[index]!,
    estimateSize: listEstimator(items, props.estimateSize),
    horizontal,
    isRtl: direction === 'rtl',
    overscan: Math.floor(nonnegative(props.overscan ?? 5)),
    gap: nonnegative(props.gap ?? 0),
    paddingStart: nonnegative(props.paddingStart ?? 0),
    paddingEnd: nonnegative(props.paddingEnd ?? 0),
    initialOffset: nonnegative(props.initialOffset ?? 0),
    initialRect: listInitialRect(props.initialRect, props.height),
    rangeExtractor: range => retainIndex(defaultRangeExtractor(range), retained),
  })
  const flow = virtualFlow(virtualizer.getVirtualItems(), virtualizer.getTotalSize())
  const entries = flow.entries.map(entry => ({ ...entry, key: keys[entry.index]! }))
  const contentStyle = listContentStyle(flow, horizontal)
  const rootStyle = listRootStyle(props.height)
  const latest = useRef(props)
  latest.current = props

  const itemStyle = (entry: { gapBefore: number; size: number }) =>
    listItemStyle(entry, horizontal, props.dynamic)

  const measureElement = useCallback(
    (element: unknown) => {
      if (element === null) {
        virtualizer.measureElement(null)
        return
      }
      if (
        latest.current.dynamic !== false &&
        viewportRef.current &&
        element instanceof HTMLElement &&
        element.isConnected
      )
        virtualizer.measureElement(element)
    },
    [virtualizer],
  )

  const measure = useCallback(async () => {
    virtualizer.measure()
    await tick()
    for (const child of list.current?.children ?? []) measureElement(child)
  }, [measureElement, tick, virtualizer])

  const keysRef = useRef(keys)
  keysRef.current = keys
  const updateFocus = useCallback(() => {
    const element = list.current
    const active = element?.ownerDocument.activeElement
    const row = active && [...(element?.children ?? [])].find(child => child.contains(active))
    setFocusedKey(row ? keysRef.current[Number(row.getAttribute('data-index'))] : undefined)
  }, [])

  const onFocusOut = useCallback(() => {
    void Promise.resolve().then(updateFocus)
  }, [updateFocus])

  const pendingScroll = useRef<(() => void) | undefined>(undefined)
  const scroll = useCallback(
    (action: () => void) => {
      if (viewportRef.current && virtualizer.scrollElement === viewportRef.current) action()
      else pendingScroll.current = action
    },
    [virtualizer],
  )

  const behavior = (value: VirtualListScrollOptions['behavior']) =>
    prefersReducedMotion() ? 'auto' : value

  const scrollToIndex = useCallback(
    (index: number, options: VirtualListScrollOptions = {}) => {
      if (!Number.isFinite(index)) return
      scroll(() => {
        if (latest.current.items.length)
          virtualizer.scrollToIndex(Math.trunc(index), {
            ...options,
            behavior: behavior(options.behavior),
          })
      })
    },
    [scroll, virtualizer],
  )

  const scrollToOffset = useCallback(
    (offset: number, options: Pick<VirtualListScrollOptions, 'behavior'> = {}) => {
      if (!Number.isFinite(offset)) return
      scroll(() =>
        virtualizer.scrollToOffset(nonnegative(offset), {
          behavior: behavior(options.behavior),
        }),
      )
    },
    [scroll, virtualizer],
  )

  useEffect(() => {
    if (!viewport) return
    void measure()
    pendingScroll.current?.()
    pendingScroll.current = undefined
  }, [viewport, measure])

  const range = virtualizer.calculateRange()
  const startIndex = range?.startIndex ?? -1
  const endIndex = range?.endIndex ?? -1
  const reported = useRef<[number, number] | undefined>(undefined)
  const rangeChange = useRef(onRangeChange)
  rangeChange.current = onRangeChange
  useEffect(() => {
    const previous = reported.current
    reported.current = [startIndex, endIndex]
    if (startIndex !== previous?.[0] || endIndex !== previous?.[1])
      rangeChange.current({ startIndex, endIndex })
  }, [startIndex, endIndex])

  const measured = useRef([props.dynamic, props.estimateSize, props.orientation])
  useEffect(() => {
    const next = [props.dynamic, props.estimateSize, props.orientation]
    if (next.every((value, index) => Object.is(value, measured.current[index]))) return
    measured.current = next
    void measure()
  }, [props.dynamic, props.estimateSize, props.orientation, measure])

  useEffect(() => {
    if (!viewport) return
    let crossSize: number | undefined
    let frame: number | undefined
    const observer = new ResizeObserver(observed => {
      const rect = observed[0]?.contentRect
      if (!rect) return
      const next = latest.current.orientation === 'horizontal' ? rect.height : rect.width
      if (crossSize !== undefined && crossSize !== next && latest.current.dynamic !== false) {
        if (frame !== undefined) cancelAnimationFrame(frame)
        frame = requestAnimationFrame(() => {
          frame = undefined
          void measure()
        })
      }
      crossSize = next
    })
    observer.observe(viewport)
    return () => {
      observer.disconnect()
      if (frame !== undefined) cancelAnimationFrame(frame)
    }
  }, [viewport, measure])

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
