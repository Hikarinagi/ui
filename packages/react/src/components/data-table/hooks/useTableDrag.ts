'use client'

import { useEffect, useRef, useState, type CSSProperties, type RefObject } from 'react'
import { rowId } from '../../../../../shared/src/lib/data-table/utils'
import {
  dropColumnOrder,
  reorderPosition,
  reorderedRows,
} from '../../../../../shared/src/lib/data-table/layout'
import { useRenderTick } from '../../../lib/virtual/useRenderTick'
import type { DataTableKey, DataTableProps, DataTableReorder } from '../types'
import type { DataTableController, DataTableModels } from './useDataTable'
import { useLive, useStableCallback } from './useLive'

export interface DataTableDragging {
  kind: 'row' | 'column'
  key: string
  target?: string
  before?: boolean
  width: number
  offsetX: number
  offsetY: number
  samples: string[]
  appearance: CSSProperties
  marker?: { x: number; y: number; width: number; height: number }
  label: string
  x: number
  y: number
}

export function canMoveRow<T>(
  movable: boolean,
  reorderable: boolean | ((row: T) => boolean) | undefined,
  row: T,
) {
  return movable && (typeof reorderable === 'function' ? reorderable(row) : !!reorderable)
}

export function useTableDrag<T extends object>(
  props: DataTableProps<T>,
  models: DataTableModels,
  ctl: DataTableController<T>,
  element: RefObject<HTMLTableElement | null>,
  viewport: HTMLElement | undefined,
  onReorder: (change: DataTableReorder<T>) => void,
) {
  const [dragging, setDragging] = useState<DataTableDragging>()
  const tick = useRenderTick()
  const ordered =
    !models.sorting.value.length &&
    !models.grouping.value.length &&
    !models.filter.value &&
    !models.columnFilters.value.length
  const live = useLive({ props, ctl, viewport, ordered })
  const movable = !ctl.blocked && ordered
  const canMove = (row: T) =>
    canMoveRow(
      !live.current.ctl.blocked && live.current.ordered,
      live.current.props.reorderable,
      row,
    )
  const cleanup = useRef<() => void>(undefined)
  const releaseClick = useRef<() => void>(undefined)
  const disposed = useRef(false)
  const moveRow = useStableCallback(
    (key: DataTableKey, targetKey: DataTableKey, before?: boolean) => {
      const { ctl, props } = live.current
      const all = ctl.table.getCoreRowModel().rowsById
      const row = all[rowId(key)],
        target = all[rowId(targetKey)]
      if (
        !row ||
        !target ||
        key === targetKey ||
        row.parentId !== target.parentId ||
        !canMove(row.original) ||
        !canMove(target.original)
      )
        return
      const parent = row.parentId ? all[row.parentId]?.original : undefined
      const source = parent ? props.getChildren?.(parent) : props.rows
      if (!source) return
      const from = source.findIndex(item => ctl.keyOf(item) === key),
        to = source.findIndex(item => ctl.keyOf(item) === targetKey)
      const position = reorderPosition(from, to, before)
      if (position === from) return
      onReorder({
        row: row.original,
        target: target.original,
        parent,
        from,
        to: position,
        rows: reorderedRows(source, from, position, row.original),
      })
    },
  )
  const start = useStableCallback(
    (
      kind: 'row' | 'column',
      key: string,
      label: string,
      event: PointerEvent,
      handle: HTMLElement,
    ) => {
      const { ctl, props } = live.current
      if (event.button !== 0 || ctl.blocked || (kind === 'row' && !live.current.ordered)) return
      const interactive = (event.target as HTMLElement).closest(
        'button, a, input, select, textarea, [contenteditable], [role="separator"]',
      )
      if (kind === 'column' && interactive && !interactive.hasAttribute('data-hn-table-heading'))
        return
      const column = ctl.visibleColumns.find(column => column.key === key)
      if (kind === 'column' && (!props.reorderColumns || column?.reorderable === false)) return
      cleanup.current?.()
      const document = handle.ownerDocument
      const window = document.defaultView!
      const originX = event.clientX,
        originY = event.clientY
      const rect = handle.getBoundingClientRect()
      const style = window.getComputedStyle(handle)
      const appearance = {
        fontSize: style.fontSize,
        lineHeight: style.lineHeight,
        direction: style.direction as 'ltr' | 'rtl',
        '--hn-row-h': `${rect.height}px`,
        ...Object.fromEntries(
          ['--hn-surface', '--hn-table-head-bg', '--hn-border', '--hn-fg-default'].map(token => [
            token,
            style.getPropertyValue(token),
          ]),
        ),
      } as CSSProperties
      const table = element.current
      const rtl = table && window.getComputedStyle(table).direction === 'rtl'
      let x = originX,
        y = originY
      let moved = false
      let pointerReleased = false
      let frame = 0
      const samples =
        kind === 'column'
          ? [...(table?.querySelectorAll<HTMLElement>('tbody [data-hn-cell]') ?? [])]
              .filter(cell => cell.dataset.hnCell === key)
              .slice(0, 3)
              .map(cell => cell.textContent?.trim() ?? '')
          : []
      const targetAtPoint = () => {
        const { ctl, viewport } = live.current
        const table = element.current
        const target = document
          .elementFromPoint(x, y)
          ?.closest<HTMLElement>(kind === 'row' ? '[data-hn-row]' : '[data-hn-column]')
        if (!target || !table?.contains(target)) return
        const targetId = (kind === 'row' ? target.dataset.hnRow : target.dataset.hnColumn)!
        if (targetId === key) return
        if (kind === 'column') {
          const destination = ctl.visibleColumns.find(column => column.key === targetId)
          if (!destination || destination.pin !== column?.pin || destination.reorderable === false)
            return
        } else {
          const all = ctl.table.getCoreRowModel().rowsById
          const row = all[key],
            destination = all[targetId]
          if (
            !row ||
            !destination ||
            row.parentId !== destination.parentId ||
            !canMove(destination.original)
          )
            return
        }
        const box = target.getBoundingClientRect()
        const area = viewport?.getBoundingClientRect() ?? table.getBoundingClientRect()
        const bounds = table.getBoundingClientRect()
        const before =
          kind === 'row'
            ? y < box.top + box.height / 2
            : rtl
              ? x > box.left + box.width / 2
              : x < box.left + box.width / 2
        const ids =
          kind === 'column'
            ? ctl.visibleColumns.map(column => column.key)
            : [...table.querySelectorAll<HTMLElement>('[data-hn-row]')].map(
                row => row.dataset.hnRow!,
              )
        const from = ids.indexOf(key),
          to = ids.indexOf(targetId)
        if (from >= 0 && to + (before ? 0 : 1) - (from < to ? 1 : 0) === from) return
        const left = Math.max(area.left, bounds.left),
          top = Math.max(area.top, bounds.top)
        return {
          target: targetId,
          before,
          marker:
            kind === 'column'
              ? {
                  x: before !== !!rtl ? box.left : box.right,
                  y: top,
                  width: 2,
                  height: Math.max(0, Math.min(area.bottom, bounds.bottom) - top),
                }
              : {
                  x: left,
                  y: before ? box.top : box.bottom,
                  width: Math.max(0, Math.min(area.right, bounds.right) - left),
                  height: 2,
                },
        }
      }
      const update = () => {
        if (!moved) return
        const area = live.current.viewport
        const box = area?.getBoundingClientRect()
        if (box && area) {
          if (kind === 'row')
            area.scrollTop += y < box.top + 28 ? -12 : y > box.bottom - 28 ? 12 : 0
          else area.scrollLeft += x < box.left + 28 ? -12 : x > box.right - 28 ? 12 : 0
        }
        const destination = targetAtPoint()
        setDragging({
          kind,
          key,
          label,
          x,
          y,
          width: rect.width,
          offsetX: originX - rect.left,
          offsetY: originY - rect.top,
          samples,
          appearance,
          ...destination,
        })
        frame = requestAnimationFrame(update)
      }
      const move = (next: PointerEvent) => {
        if (next.pointerId !== event.pointerId) return
        x = next.clientX
        y = next.clientY
        if (!moved && Math.hypot(x - originX, y - originY) >= 6) {
          moved = true
          handle.setPointerCapture?.(event.pointerId)
          document.documentElement.dataset.hnTableGesture = 'drag'
          update()
        }
        if (moved) next.preventDefault()
      }
      const stop = (apply: boolean) => {
        const destination = moved && targetAtPoint()
        cleanup.current?.()
        if (!apply || !destination) return
        if (kind === 'column') {
          models.columnOrder.set(
            dropColumnOrder(
              models.columnOrder.value,
              live.current.ctl.leaves,
              key,
              destination.target,
              destination.before,
            ),
          )
        } else {
          const { ctl } = live.current
          const all = ctl.table.getCoreRowModel().rowsById
          const row = all[key],
            target = all[destination.target]
          if (row && target)
            moveRow(ctl.keyOf(row.original), ctl.keyOf(target.original), destination.before)
        }
      }
      const up = (next: PointerEvent) => {
        if (next.pointerId !== event.pointerId) return
        x = next.clientX
        y = next.clientY
        pointerReleased = true
        stop(true)
      }
      const cancel = () => stop(false)
      const keydown = (next: KeyboardEvent) => {
        if (next.key === 'Escape') {
          next.preventDefault()
          next.stopPropagation()
          cancel()
        }
      }
      cleanup.current = () => {
        cancelAnimationFrame(frame)
        window.removeEventListener('pointermove', move)
        window.removeEventListener('pointerup', up)
        window.removeEventListener('pointercancel', cancel)
        window.removeEventListener('keydown', keydown)
        window.removeEventListener('blur', cancel)
        if (handle.hasPointerCapture?.(event.pointerId))
          handle.releasePointerCapture(event.pointerId)
        if (moved && !disposed.current) {
          releaseClick.current?.()
          let timer: ReturnType<typeof setTimeout> | undefined
          const clear = () => {
            clearTimeout(timer)
            document.removeEventListener('click', preventClick, true)
            document.removeEventListener('pointerdown', clear, true)
            document.removeEventListener('keydown', clear, true)
            document.removeEventListener('pointerup', afterUp, true)
            releaseClick.current = undefined
          }
          const preventClick = (click: MouseEvent) => {
            click.preventDefault()
            click.stopImmediatePropagation()
            clear()
          }
          const afterUp = () => {
            timer = setTimeout(clear, 0)
          }
          document.addEventListener('click', preventClick, true)
          document.addEventListener('pointerdown', clear, true)
          document.addEventListener('keydown', clear, true)
          document.addEventListener('pointerup', afterUp, true)
          if (pointerReleased) afterUp()
          releaseClick.current = clear
        }
        delete document.documentElement.dataset.hnTableGesture
        if (!disposed.current) setDragging(undefined)
        cleanup.current = undefined
      }
      window.addEventListener('pointermove', move)
      window.addEventListener('pointerup', up)
      window.addEventListener('pointercancel', cancel)
      window.addEventListener('keydown', keydown)
      window.addEventListener('blur', cancel)
    },
  )
  const rowKeydown = useStableCallback(
    (key: DataTableKey, event: KeyboardEvent, handle: HTMLElement) => {
      if (!['ArrowUp', 'ArrowDown'].includes(event.key)) return
      event.preventDefault()
      event.stopPropagation()
      const { ctl, props } = live.current
      const row = ctl.table.getCoreRowModel().rowsById[rowId(key)]
      if (!row) return
      const parent = row.parentId
        ? ctl.table.getCoreRowModel().rowsById[row.parentId]?.original
        : undefined
      const source = parent ? (props.getChildren?.(parent) ?? []) : props.rows
      const eligible = source.filter(canMove),
        index = eligible.findIndex(item => ctl.keyOf(item) === key)
      const target = eligible[index + (event.key === 'ArrowDown' ? 1 : -1)]
      if (target) {
        moveRow(key, ctl.keyOf(target))
        void tick().then(() => {
          if (handle.isConnected) handle.focus({ preventScroll: true })
        })
      }
    },
  )
  const columnKeydown = useStableCallback(
    (key: string, event: KeyboardEvent, handle: HTMLElement) => {
      if (!event.altKey || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return
      event.preventDefault()
      event.stopPropagation()
      const { ctl } = live.current
      const column = ctl.visibleColumns.find(column => column.key === key)
      const columns = ctl.visibleColumns.filter(
        item => item.pin === column?.pin && item.reorderable !== false,
      )
      const table = element.current
      const direction = table && getComputedStyle(table).direction === 'rtl' ? -1 : 1
      const target =
        columns[
          columns.findIndex(item => item.key === key) +
            (event.key === 'ArrowRight' ? 1 : -1) * direction
        ]
      if (target) {
        ctl.api.moveColumn(key, target.key)
        void tick().then(() => {
          if (handle.isConnected) handle.focus({ preventScroll: true })
        })
      }
    },
  )
  Object.assign(ctl.api, { moveRow })
  useEffect(() => {
    disposed.current = false
    return () => {
      disposed.current = true
      cleanup.current?.()
      releaseClick.current?.()
    }
  }, [])
  return {
    dragging,
    kind: dragging?.kind,
    target: dragging?.target,
    key: dragging?.key,
    movable,
    canMove,
    start,
    rowKeydown,
    columnKeydown,
  }
}

export type DataTableDrag<T extends object> = ReturnType<typeof useTableDrag<T>>
