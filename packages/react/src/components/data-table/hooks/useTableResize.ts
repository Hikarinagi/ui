'use client'

import { useEffect, useRef, useState, type RefObject } from 'react'
import {
  clampWidth,
  resizeBoundary,
  resizeBounds,
  resizeWidths,
} from '../../../../../shared/src/lib/data-table/column-sizing'
import {
  pinnedMaximumWidth,
  resizeAffectedColumns,
} from '../../../../../shared/src/lib/data-table/resize'
import { useRenderTick } from '../../../lib/virtual/useRenderTick'
import type { DataTableColumn, DataTableProps } from '../types'
import type { DataTableController, DataTableModels } from './useDataTable'
import { useLive, useStableCallback } from './useLive'

export interface DataTableResizeGuide {
  x: number
  y: number
  height: number
  columns: { key: string; label: string; width: number }[]
  labelX: number
}

export function useTableResize<T extends object>(
  props: DataTableProps<T>,
  models: DataTableModels,
  ctl: DataTableController<T>,
  element: RefObject<HTMLTableElement | null>,
  viewport: HTMLElement | undefined,
  widths: Record<string, number>,
  setActive: (widths: Record<string, number> | undefined) => void,
  available: number,
  updateHandles: () => void,
) {
  const [resizing, setResizing] = useState<string>()
  const [guide, setGuide] = useState<DataTableResizeGuide>()
  const tick = useRenderTick()
  const release = useRef<() => void>(undefined)
  const live = useLive({ props, ctl, widths, available, viewport })
  const mode = () => live.current.props.resizeMode ?? 'fit'
  const boundary = (column: DataTableColumn<T>) =>
    resizeBoundary(live.current.ctl.visibleColumns, column, mode())
  const affectedColumns = (column: DataTableColumn<T>) =>
    resizeAffectedColumns(live.current.ctl.visibleColumns, column, mode())
  const resizeLabel = (column: DataTableColumn<T>) =>
    affectedColumns(column)
      .map(item => item.label)
      .join(' / ')
  const resizeValueText = (column: DataTableColumn<T>) =>
    affectedColumns(column)
      .map(item => `${item.label}: ${Math.round(live.current.widths[item.key]!)}px`)
      .join(' / ')
  const minimumTotalWidth = () =>
    live.current.props.resizeMode === 'expand' ? Math.max(0, live.current.available) : 0
  const maximumWidth = (column: DataTableColumn<T>, source: Record<string, number>) =>
    pinnedMaximumWidth(
      live.current.ctl.visibleColumns,
      column,
      mode(),
      source,
      live.current.available,
    )
  const bounds = (column: DataTableColumn<T>) =>
    resizeBounds(
      column,
      boundary(column)?.neighbor,
      live.current.widths,
      minimumTotalWidth(),
      maximumWidth(column, live.current.widths),
    )
  const canResize = (column: DataTableColumn<T>) => {
    if (!live.current.props.resizable || !boundary(column)) return false
    const range = bounds(column)
    return range.max - range.min > 0.01
  }
  const setWidth = useStableCallback((key: string, value: number) => {
    if (live.current.ctl.blocked || !Number.isFinite(value)) return
    const column = live.current.ctl.leaves.find(column => column.key === key)
    if (column)
      models.columnWidths.set({ ...models.columnWidths.value, [key]: clampWidth(column, value) })
  })
  const resize = useStableCallback(
    (column: DataTableColumn<T>, event: PointerEvent, handle: HTMLElement) => {
      const edge = boundary(column)
      if (event.button !== 0 || live.current.ctl.blocked || !edge || !canResize(column)) return
      event.preventDefault()
      event.stopPropagation()
      release.current?.()
      const document = handle.ownerDocument
      const window = document.defaultView!
      const table = element.current!
      const cell = handle.closest('th')!
      const ratio =
        table.getBoundingClientRect().width / parseFloat(window.getComputedStyle(table).width) || 1
      const initial = { ...live.current.widths }
      table.querySelectorAll<HTMLElement>('thead [data-hn-column]').forEach(cell => {
        initial[cell.dataset.hnColumn!] = cell.getBoundingClientRect().width / ratio
      })
      live.current.widths = initial
      setActive(initial)
      const previous = models.columnWidths.value
      const direction = window.getComputedStyle(table).direction === 'rtl' ? -1 : 1
      const sign = direction * (edge.side === 'start' ? -1 : 1)
      const coordinate = (rect: DOMRect) => (sign === 1 ? rect.right : rect.left)
      const areaAnchor = () => {
        const box = live.current.viewport?.getBoundingClientRect()
        return box ? (direction === 1 ? box.left : box.right) : 0
      }
      const anchor = areaAnchor()
      let lastScroll = live.current.viewport?.scrollLeft ?? 0
      let scrollDelta = 0
      const trackScroll = () => {
        const area = live.current.viewport
        if (!area) return
        const range = Math.max(0, area.scrollWidth - area.clientWidth)
        const previous = Math.max(
          direction === 1 ? 0 : -range,
          Math.min(direction === 1 ? range : 0, lastScroll),
        )
        scrollDelta += area.scrollLeft - previous
        lastScroll = area.scrollLeft
      }
      const gesture = document.documentElement.dataset.hnTableGesture
      document.documentElement.dataset.hnTableGesture = 'resize'
      handle.setPointerCapture?.(event.pointerId)
      setResizing(column.key)
      let pointerX = event.clientX
      let changed = false
      let moved = false
      let frame = 0
      let stopped = false
      const updateGuide = async () => {
        if (stopped) return
        updateHandles()
        await tick()
        if (stopped) return
        const rect = cell.getBoundingClientRect()
        const area = live.current.viewport?.getBoundingClientRect()
        const box = table.getBoundingClientRect()
        if (!area) return
        const x = coordinate(handle.getBoundingClientRect())
        setGuide(
          x >= area.left - 1 && x <= area.right + 1
            ? {
                x,
                columns: affectedColumns(column).map(item => ({
                  key: item.key,
                  label: item.label,
                  width: Math.round(live.current.widths[item.key]!),
                })),
                labelX: Math.max(8, Math.min(x - 90, window.innerWidth - 188)),
                y: Math.max(rect.top, area.top),
                height: Math.max(
                  0,
                  Math.min(box.bottom, area.bottom) - Math.max(rect.top, area.top),
                ),
              }
            : undefined,
        )
      }
      const apply = () => {
        if (stopped) return
        if (moved) {
          trackScroll()
          const delta =
            pointerX - event.clientX + anchor - areaAnchor() + (column.pin ? 0 : scrollDelta)
          const desired = initial[column.key]! + (delta * sign) / ratio
          const changes = resizeWidths(
            column,
            edge.neighbor,
            initial,
            desired,
            minimumTotalWidth(),
            maximumWidth(column, initial),
          )
          if (
            Object.entries(changes).some(
              ([key, width]) => Math.abs(width - live.current.widths[key]!) > 0.01,
            )
          ) {
            changed = true
            const next = { ...initial, ...changes }
            live.current.widths = next
            setActive(next)
            models.columnWidths.set(
              live.current.props.resizeMode === 'expand'
                ? { ...previous, ...next }
                : { ...previous, ...changes },
            )
          }
        }
        void tick().then(updateGuide)
      }
      const schedule = () => {
        window.cancelAnimationFrame(frame)
        frame = window.requestAnimationFrame(apply)
      }
      const move = (next: PointerEvent) => {
        if (next.pointerId !== event.pointerId) return
        moved ||= Math.abs(next.clientX - event.clientX) > 0.5
        pointerX = next.clientX
        schedule()
      }
      const stop = (cancel = false) => {
        window.cancelAnimationFrame(frame)
        if (!cancel) apply()
        stopped = true
        if (cancel && changed) models.columnWidths.set(previous)
        setActive(undefined)
        window.removeEventListener('pointermove', move)
        window.removeEventListener('pointerup', up)
        window.removeEventListener('pointercancel', cancelPointer)
        window.removeEventListener('blur', cancelDrag)
        document.removeEventListener('keydown', keydown, true)
        document.removeEventListener('scroll', schedule, true)
        window.removeEventListener('resize', schedule)
        if (handle.hasPointerCapture?.(event.pointerId))
          handle.releasePointerCapture(event.pointerId)
        if (gesture === undefined) delete document.documentElement.dataset.hnTableGesture
        else document.documentElement.dataset.hnTableGesture = gesture
        setResizing(undefined)
        setGuide(undefined)
        release.current = undefined
      }
      const up = (next: PointerEvent) => {
        if (next.pointerId !== event.pointerId) return
        pointerX = next.clientX
        moved ||= Math.abs(next.clientX - event.clientX) > 0.5
        stop()
      }
      const cancelDrag = () => stop(true)
      const cancelPointer = (next: PointerEvent) => {
        if (next.pointerId === event.pointerId) cancelDrag()
      }
      const keydown = (next: KeyboardEvent) => {
        if (next.key === 'Escape') {
          next.preventDefault()
          next.stopPropagation()
          cancelDrag()
        }
      }
      release.current = cancelDrag
      window.addEventListener('pointermove', move)
      window.addEventListener('pointerup', up)
      window.addEventListener('pointercancel', cancelPointer)
      window.addEventListener('blur', cancelDrag)
      document.addEventListener('keydown', keydown, true)
      document.addEventListener('scroll', schedule, true)
      window.addEventListener('resize', schedule)
      void updateGuide()
    },
  )
  const resizeKey = useStableCallback((column: DataTableColumn<T>, event: KeyboardEvent) => {
    if (
      live.current.ctl.blocked ||
      !canResize(column) ||
      !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)
    )
      return
    event.preventDefault()
    event.stopPropagation()
    const edge = boundary(column)!
    const table = element.current
    const direction = table && getComputedStyle(table).direction === 'rtl' ? -1 : 1
    const sign = direction * (edge.side === 'start' ? -1 : 1)
    const range = bounds(column)
    const initial = live.current.widths
    const value =
      event.key === 'Home'
        ? range.min
        : event.key === 'End'
          ? range.max
          : initial[column.key]! +
            (event.key === 'ArrowRight' ? 1 : -1) * sign * (event.shiftKey ? 10 : 1)
    const changes = resizeWidths(
      column,
      edge.neighbor,
      initial,
      value,
      minimumTotalWidth(),
      maximumWidth(column, initial),
    )
    if (Object.entries(changes).every(([key, width]) => Math.abs(width - initial[key]!) < 0.01))
      return
    models.columnWidths.set({
      ...models.columnWidths.value,
      ...(live.current.props.resizeMode === 'expand' ? initial : {}),
      ...changes,
    })
  })
  const signature = [
    ctl.blocked,
    props.resizeMode,
    ctl.visibleColumns
      .map(column =>
        [column.key, column.pin, column.minWidth, column.maxWidth, column.resizable].join(':'),
      )
      .join('|'),
  ].join('\n')
  const settled = useRef(signature)
  useEffect(() => {
    if (settled.current === signature) return
    settled.current = signature
    release.current?.()
  }, [signature])
  useEffect(() => () => release.current?.(), [])
  return {
    resizing,
    guide,
    boundary,
    bounds,
    canResize,
    resizeLabel,
    resizeValueText,
    resize,
    resizeKey,
    setWidth,
  }
}
