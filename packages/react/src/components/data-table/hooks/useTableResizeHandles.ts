'use client'

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from 'react'
import {
  resizeHandlePositions,
  type DataTableHandlePosition,
} from '../../../../../shared/src/lib/data-table/resize'
import type { DataTableColumn } from '../types'
import { useLive, useStableCallback } from './useLive'

export function useTableResizeHandles<T extends object>(
  element: RefObject<HTMLTableElement | null>,
  viewport: HTMLElement | undefined,
  columns: DataTableColumn<T>[],
  enabled: boolean,
) {
  const [positions, setPositions] = useState<Record<string, DataTableHandlePosition>>({})
  const frame = useRef(0)
  const live = useLive({ columns, enabled, viewport })
  const update = useStableCallback(() => {
    cancelAnimationFrame(frame.current)
    frame.current = 0
    if (!live.current.enabled) return
    const table = element.current
    const area = live.current.viewport
    if (!table || !area) return
    const box = area.getBoundingClientRect()
    const scale = box.width / area.clientWidth || 1
    const rtl = getComputedStyle(table).direction === 'rtl'
    const cells = new Map(
      [...table.querySelectorAll<HTMLElement>('thead [data-hn-column]')].map(cell => [
        cell.dataset.hnColumn!,
        cell.getBoundingClientRect(),
      ]),
    )
    const next = resizeHandlePositions(live.current.columns, cells, box, scale, rtl)
    setPositions(previous => (JSON.stringify(next) !== JSON.stringify(previous) ? next : previous))
  })
  const schedule = useStableCallback(() => {
    if (!live.current.enabled) return
    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(update)
  })
  useEffect(() => {
    if (!viewport) return
    viewport.addEventListener('scroll', schedule, { passive: true })
    return () => viewport.removeEventListener('scroll', schedule)
  }, [viewport, schedule])
  useLayoutEffect(() => {
    let cancelled = false
    let observer: ResizeObserver | undefined
    queueMicrotask(() => {
      if (cancelled) return
      cancelAnimationFrame(frame.current)
      frame.current = 0
      const table = element.current
      if (!enabled || !table || !viewport || typeof ResizeObserver === 'undefined') return
      observer = new ResizeObserver(update)
      observer.observe(viewport)
      table
        .querySelectorAll('thead [data-hn-column]')
        .forEach(cell => observer!.observe(cell, { box: 'border-box' }))
    })
    return () => {
      cancelled = true
      observer?.disconnect()
    }
  }, [element, viewport, columns, enabled, update])
  useEffect(() => () => cancelAnimationFrame(frame.current), [])
  const styles = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(positions).map(([key, position]) => [
          key,
          {
            '--hn-table-resize-inset': `${position.inset}px`,
            visibility: position.visible ? 'visible' : 'hidden',
          } as CSSProperties,
        ]),
      ),
    [positions],
  )
  return {
    update,
    handleStyle: (column: DataTableColumn<T>): CSSProperties =>
      styles[column.key] ?? { visibility: 'hidden' },
    handleVisible: (column: DataTableColumn<T>) => positions[column.key]?.visible ?? false,
  }
}
