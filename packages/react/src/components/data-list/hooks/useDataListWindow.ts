'use client'

import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { defaultRangeExtractor } from '@tanstack/react-virtual'
import { useVirtualWindow, virtualFlow } from '../../../lib/virtual/useVirtualWindow'
import { useRenderTick } from '../../../lib/virtual/useRenderTick'
import { prefersReducedMotion } from '../../../motion'
import { paginationInteger } from '../../../../../shared/src/lib/pagination'
import { scrollDataListItem } from '../../../../../shared/src/lib/data-list'
import type { VirtualListScrollOptions } from '../../virtual-list/types'
import type {
  DataListItemSlot,
  DataListKey,
  DataListLayout,
  DataListOptions,
  DataListRange,
} from '../types'

export function useDataListWindow<T>(
  props: {
    options: DataListOptions<T>
    entries: readonly DataListItemSlot<T>[]
    layout: DataListLayout
  },
  content: { current: HTMLElement | null },
  viewport: HTMLElement | undefined,
  onRange: (range: DataListRange) => void,
) {
  const { options, entries, layout } = props
  const settings = typeof options.virtualize === 'object' ? options.virtualize : {}
  const tick = useRenderTick()
  const [columns, setColumns] = useState(() =>
    layout === 'grid' ? paginationInteger(settings.initialColumns ?? NaN, 1, 1) : 1,
  )
  const [gap, setGap] = useState(0)
  const [margin, setMargin] = useState(0)
  const [focused, setFocused] = useState<DataListKey>()
  const focusedIndex =
    focused === undefined ? -1 : entries.findIndex(entry => entry.key === focused)
  const retained = Math.floor(focusedIndex / columns)
  const enabled = !!options.virtualize && entries.length > 0
  const viewportRef = useRef(viewport)
  viewportRef.current = viewport
  const virtualizer = useVirtualWindow({
    enabled,
    count: Math.ceil(entries.length / columns),
    getScrollElement: () => viewportRef.current ?? null,
    getItemKey: (row: number) => entries[row * columns]!.key,
    estimateSize: () =>
      paginationInteger(settings.estimateSize ?? NaN, layout === 'grid' ? 280 : 112, 1),
    overscan: paginationInteger(settings.overscan ?? NaN, 3, 0),
    gap,
    scrollMargin: margin,
    initialRect: {
      width: 320,
      height: typeof options.height === 'number' ? options.height : 320,
    },
    rangeExtractor: range => {
      const indexes = defaultRangeExtractor(range)
      if (retained >= 0 && !indexes.includes(retained)) indexes.push(retained)
      return indexes.sort((a, b) => a - b)
    },
  })
  const flow = virtualFlow(virtualizer.getVirtualItems(), virtualizer.getTotalSize(), margin)
  const before = enabled ? Math.max(0, flow.before - gap) : 0
  const after = enabled ? Math.max(0, flow.after - gap) : 0
  const rendered = enabled
    ? flow.entries.flatMap(row =>
        entries.slice(row.index * columns, (row.index + 1) * columns).map(entry => ({
          ...entry,
          row: row.index,
          gapBefore: Math.max(0, row.gapBefore - gap),
        })),
      )
    : entries.map(entry => ({ ...entry, row: 0, gapBefore: 0 }))
  const style = {
    '--hn-data-list-min': options.gridMin ?? '14rem',
    ...(enabled ? { overflowAnchor: 'none' } : {}),
  } as CSSProperties

  const latest = useRef({ options, entries, layout, enabled, columns, gap, margin, viewport })
  latest.current = { options, entries, layout, enabled, columns, gap, margin, viewport }
  const observer = useRef<ResizeObserver | undefined>(undefined)
  const elements = useRef(new Set<HTMLElement>())
  const pending = useRef<(() => void) | undefined>(undefined)
  const geometryVersion = useRef(0)

  const measureRows = useCallback(() => {
    const { enabled, entries, columns } = latest.current
    if (!enabled) return
    const sizes = new Map<number, number>()
    for (const element of elements.current) {
      const row = Number(element.dataset.virtualRow)
      sizes.set(row, Math.max(sizes.get(row) ?? 0, element.getBoundingClientRect().height))
    }
    for (const [row, size] of sizes) {
      const key = entries[row * columns]?.key
      if (size > 0 && key !== undefined && virtualizer.itemSizeCache.get(key) !== size)
        virtualizer.resizeItem(row, size)
    }
  }, [virtualizer])

  const observeItems = useCallback(() => {
    const next = new Set(
      latest.current.enabled
        ? content.current?.querySelectorAll<HTMLElement>('[data-hn-data-list-item]')
        : [],
    )
    for (const element of elements.current)
      if (!next.has(element)) observer.current?.unobserve(element)
    for (const element of next) {
      if (!elements.current.has(element)) observer.current?.observe(element)
    }
    elements.current = next
    measureRows()
  }, [content, measureRows])

  const scrollToIndex = useCallback(
    (index: number, scrollOptions: VirtualListScrollOptions = {}) => {
      const { entries, enabled, options, viewport } = latest.current
      if (!Number.isFinite(index) || !entries.length) return
      const position = Math.max(
        0,
        Math.min(entries.length - 1, Math.trunc(index) - entries[0]!.index),
      )
      const action = () => {
        const current = latest.current
        if (current.enabled)
          virtualizer.scrollToIndex(Math.floor(position / current.columns), {
            ...scrollOptions,
            behavior: prefersReducedMotion() ? 'auto' : scrollOptions.behavior,
          })
        else {
          const element = content.current?.querySelectorAll<HTMLElement>(
            '[data-hn-data-list-item]',
          )[position]
          if (element)
            scrollDataListItem(element, current.viewport, {
              ...scrollOptions,
              behavior: prefersReducedMotion() ? 'auto' : scrollOptions.behavior,
            })
        }
      }
      if (
        ((options.virtualize || options.height !== undefined) && !viewport) ||
        (enabled && virtualizer.scrollElement !== viewport)
      )
        pending.current = action
      else action()
    },
    [content, virtualizer],
  )

  const geometry = useCallback(async () => {
    const element = content.current
    const current = latest.current
    if (!current.enabled || !element) return
    const computedStyle = element.ownerDocument.defaultView!.getComputedStyle(element)
    const nextColumns =
      current.layout === 'grid'
        ? Math.max(1, computedStyle.gridTemplateColumns.split(' ').filter(Boolean).length)
        : 1
    const nextGap = parseFloat(computedStyle.rowGap) || 0
    const nextMargin = parseFloat(computedStyle.paddingBlockStart) || 0
    if (
      nextColumns !== current.columns ||
      nextGap !== current.gap ||
      nextMargin !== current.margin
    ) {
      const version = ++geometryVersion.current
      const index = (virtualizer.range?.startIndex ?? 0) * current.columns
      const atStart = !current.viewport?.scrollTop
      latest.current = { ...current, columns: nextColumns, gap: nextGap, margin: nextMargin }
      setColumns(nextColumns)
      setGap(nextGap)
      setMargin(nextMargin)
      virtualizer.measure()
      await tick()
      if (version !== geometryVersion.current) return
      observeItems()
      if (!atStart) scrollToIndex(latest.current.entries[index]?.index ?? 0, { align: 'start' })
    }
  }, [content, observeItems, scrollToIndex, tick, virtualizer])

  const updateFocus = useCallback(() => {
    const element = content.current
    const active = element?.ownerDocument.activeElement
    const row =
      active instanceof Element ? active.closest<HTMLElement>('[data-hn-data-list-item]') : null
    setFocused(
      row && element?.contains(row)
        ? latest.current.entries.find(entry => entry.index === Number(row.dataset.index))?.key
        : undefined,
    )
  }, [content])

  const focusOut = useCallback(() => {
    void tick().then(updateFocus)
  }, [tick, updateFocus])

  useEffect(() => {
    observer.current = new ResizeObserver(measureRows)
    observeItems()
    void geometry()
    return () => {
      observer.current?.disconnect()
      observer.current = undefined
      elements.current = new Set()
      geometryVersion.current++
      pending.current = undefined
    }
  }, [])

  useEffect(() => {
    const element = content.current
    if (!element) return
    const resize = new ResizeObserver(() => {
      void geometry()
    })
    resize.observe(element)
    return () => resize.disconnect()
  }, [content, geometry])

  const signature = rendered.map(entry => `${entry.key}:${entry.row}`).join('|')
  useEffect(() => {
    observeItems()
    if (viewport && (!enabled || virtualizer.scrollElement === viewport)) {
      pending.current?.()
      pending.current = undefined
    }
  }, [signature, viewport, enabled])

  const geometryInputs = useRef([layout, options.gridMin, options.gridGap, options.virtualize])
  useEffect(() => {
    const next = [layout, options.gridMin, options.gridGap, options.virtualize]
    const previous = geometryInputs.current
    if (next.every((value, index) => Object.is(value, previous[index]))) return
    geometryInputs.current = next
    void geometry()
  }, [layout, options.gridMin, options.gridGap, options.virtualize])

  const firstIndex = entries[0]?.index
  const previousFirst = useRef([firstIndex, options.pagination] as const)
  useEffect(() => {
    const previous = previousFirst.current
    previousFirst.current = [firstIndex, options.pagination]
    if (previous[0] === firstIndex && previous[1] === options.pagination) return
    if (
      options.pagination &&
      firstIndex !== undefined &&
      previous[0] !== undefined &&
      firstIndex !== previous[0]
    )
      latest.current.viewport?.scrollTo({ top: 0, behavior: 'instant' })
  }, [firstIndex, options.pagination])

  let startIndex = -1
  let endIndex = -1
  if (enabled) {
    const range = virtualizer.calculateRange()
    startIndex = entries[(range?.startIndex ?? 0) * columns]?.index ?? -1
    endIndex =
      entries[Math.min(entries.length - 1, ((range?.endIndex ?? 0) + 1) * columns - 1)]?.index ?? -1
  }
  const reported = useRef<[number, number] | undefined>(undefined)
  const rangeChange = useRef(onRange)
  rangeChange.current = onRange
  useEffect(() => {
    const previous = reported.current
    reported.current = [startIndex, endIndex]
    if (startIndex !== previous?.[0] || endIndex !== previous?.[1])
      rangeChange.current({ startIndex, endIndex })
  }, [startIndex, endIndex])

  return { rendered, style, before, after, scrollToIndex, updateFocus, focusOut }
}
