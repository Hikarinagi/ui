import type { DataTableColumn } from '../../types/data-table'
import { resizeBoundary } from './column-sizing'

export interface DataTableHandlePosition {
  inset: number
  visible: boolean
}

export function resizeHandlePositions<T extends object>(
  columns: DataTableColumn<T>[],
  cells: Map<string, { left: number; right: number }>,
  box: { left: number; right: number },
  scale: number,
  rtl: boolean,
) {
  let left = box.left
  let right = box.right
  for (const column of columns) {
    const rect = cells.get(column.key)
    if (!rect || !column.pin) continue
    if ((column.pin === 'start') !== rtl) left = Math.max(left, rect.right)
    else right = Math.min(right, rect.left)
  }
  const next: Record<string, DataTableHandlePosition> = {}
  for (const column of columns) {
    const rect = cells.get(column.key)
    if (!rect) continue
    const start = Math.max(rect.left, column.pin ? box.left : left)
    const end = Math.min(rect.right, column.pin ? box.right : right)
    const fromLeft = (column.pin === 'end') !== rtl
    next[column.key] = {
      inset: Math.max(0, (fromLeft ? start - rect.left : rect.right - end) / scale),
      visible: end - start >= 9 * scale - 0.01,
    }
  }
  return next
}

export function resizeAffectedColumns<T extends object>(
  columns: DataTableColumn<T>[],
  column: DataTableColumn<T>,
  mode: 'fit' | 'expand',
) {
  const edge = resizeBoundary(columns, column, mode)
  return edge?.neighbor
    ? edge.side === 'start'
      ? [edge.neighbor, column]
      : [column, edge.neighbor]
    : [column]
}

export function pinnedMaximumWidth<T extends object>(
  columns: DataTableColumn<T>[],
  column: DataTableColumn<T>,
  mode: 'fit' | 'expand',
  source: Record<string, number>,
  available: number,
) {
  if (!column.pin || resizeBoundary(columns, column, mode)?.neighbor?.pin) return Infinity
  const otherPinned = columns.reduce(
    (sum, item) => sum + (item.pin && item.key !== column.key ? source[item.key]! : 0),
    0,
  )
  const center = columns.some(item => !item.pin) ? 48 : 0
  return Math.max(source[column.key]!, available - otherPinned - center)
}
