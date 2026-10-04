'use client'

import { useCallback, useLayoutEffect, useMemo, useState, type RefObject } from 'react'
import { useVirtualWindow, virtualFlow } from '../../../lib/virtual/useVirtualWindow'
import type { DataTableKey, DataTableProps } from '../types'
import type { DataTableController, DataTableRowEntry } from './useDataTable'
import { useLive } from './useLive'

export interface DataTableEntry<T> {
  id: string
  entry: DataTableRowEntry<T>
  detail: boolean
  error: string | undefined
}

export interface DataTableRenderEntry<T> extends DataTableEntry<T> {
  index: number
}

export function useTableVirtual<T extends object>(
  props: DataTableProps<T>,
  ctl: DataTableController<T>,
  element: RefObject<HTMLTableElement | null>,
  viewport: HTMLElement | undefined,
  hasExpansion: boolean,
  rowError: (key: DataTableKey) => string | undefined,
  failure: unknown,
) {
  const [margin, setMargin] = useState(0)
  const entries = useMemo(
    () =>
      ctl.rows.flatMap(entry => {
        const rows: DataTableEntry<T>[] = [{ id: entry.id, entry, detail: false, error: undefined }]
        if (!entry.group) {
          const error = rowError(entry.key)
          if (error) rows.push({ id: `${entry.id}:error`, entry, detail: true, error })
          if (entry.expanded && hasExpansion)
            rows.push({ id: `${entry.id}:detail`, entry, detail: true, error: undefined })
        }
        return rows
      }),
    [ctl.rows, hasExpansion, rowError, failure],
  )
  const enabled = !!props.virtualize || !!props.stickyHeader
  useLayoutEffect(() => {
    let cancelled = false
    let observer: ResizeObserver | undefined
    queueMicrotask(() => {
      if (cancelled) return
      if (!enabled) {
        setMargin(0)
        return
      }
      const table = element.current
      const head = table?.tHead
      if (!head || typeof ResizeObserver === 'undefined') return
      const caption = table.caption
      const sizes = new Map<Element, number>([[head, head.offsetHeight]])
      if (caption) sizes.set(caption, caption.offsetHeight)
      const update = () => setMargin([...sizes.values()].reduce((sum, size) => sum + size, 0))
      observer = new ResizeObserver(observed => {
        for (const entry of observed)
          sizes.set(
            entry.target,
            entry.borderBoxSize[0]?.blockSize ?? (entry.target as HTMLElement).offsetHeight,
          )
        update()
      })
      observer.observe(head, { box: 'border-box' })
      if (caption) observer.observe(caption, { box: 'border-box' })
      update()
    })
    return () => {
      cancelled = true
      observer?.disconnect()
    }
  }, [element, enabled])
  const live = useLive({ entries, viewport, props, margin })
  const estimate = typeof props.virtualize === 'object' ? (props.virtualize.estimateSize ?? 44) : 44
  const virtualizer = useVirtualWindow({
    count: entries.length,
    enabled: !!props.virtualize,
    getScrollElement: () => live.current.viewport ?? null,
    estimateSize: (index: number) =>
      live.current.entries[index]?.detail && !live.current.entries[index]?.error ? 140 : estimate,
    overscan: typeof props.virtualize === 'object' ? (props.virtualize.overscan ?? 6) : 6,
    getItemKey: (index: number) => live.current.entries[index]!.id,
    scrollMargin: margin,
    scrollPaddingStart: props.stickyHeader ? margin : 0,
    initialRect: { width: 0, height: 400 },
  })
  const items = virtualizer.getVirtualItems()
  const visible = useMemo<DataTableRenderEntry<T>[]>(
    () =>
      props.virtualize
        ? items.map(item => ({ ...entries[item.index]!, index: item.index }))
        : entries.map((entry, index) => ({ ...entry, index })),
    [props.virtualize, items, entries],
  )
  const flow = virtualFlow(items, virtualizer.getTotalSize(), margin)
  const before = props.virtualize ? flow.before : 0
  const after = props.virtualize ? flow.after : 0
  const measure = useCallback(
    (element: unknown) => {
      if (element === null) {
        virtualizer.measureElement(null)
        return
      }
      if (live.current.props.virtualize && element instanceof HTMLElement)
        virtualizer.measureElement(element)
    },
    [virtualizer, live],
  )
  ctl.api.scrollToRow = key => {
    const current = live.current.entries
    const index = current.findIndex(
      item => !item.detail && item.entry.key === key && !item.entry.group,
    )
    if (index < 0) return
    if (live.current.props.virtualize) virtualizer.scrollToIndex(index, { align: 'start' })
    else {
      const area = live.current.viewport
      const row = element.current?.querySelector<HTMLElement>(
        `[data-hn-row="${CSS.escape(current[index]!.id)}"]`,
      )
      if (row && area)
        area.scrollTop +=
          row.getBoundingClientRect().top -
          area.getBoundingClientRect().top -
          (live.current.props.stickyHeader ? live.current.margin : 0)
    }
  }
  return { entries, visible, before, after, measure }
}
