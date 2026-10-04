import type { DataTableCellStyle, DataTableColumn } from '../../types/data-table'
import { cssSize } from './utils'

export interface DataTablePinLayout<T> {
  columns: DataTableColumn<T>[]
  constrained: boolean
  leading: number
  trailing: number
  fixedWidths: Record<string, number>
  width: (column: DataTableColumn<T>) => number
}

export function pinStyle<T>(
  layout: DataTablePinLayout<T>,
  column: DataTableColumn<T>,
  head = false,
): DataTableCellStyle {
  if (!column.pin) return {}
  const siblings = layout.columns.filter(item => item.pin === column.pin)
  const index = siblings.findIndex(item => item.key === column.key)
  const preceding = column.pin === 'start' ? siblings.slice(0, index) : siblings.slice(index + 1)
  const controls = column.pin === 'start' ? layout.leading * 48 : layout.trailing * 72
  const offset = `${preceding.reduce(
    (sum, column) =>
      sum + (layout.constrained ? layout.fixedWidths[column.key]! : layout.width(column)),
    controls,
  )}px`
  return {
    position: 'sticky',
    [column.pin === 'start' ? 'insetInlineStart' : 'insetInlineEnd']: offset,
    zIndex: head ? 5 : 1,
    backgroundColor: head ? 'var(--hn-table-head-bg)' : 'var(--hn-table-bg)',
    boxShadow: `${column.pin === 'start' ? '1px' : '-1px'} 0 0 var(--hn-border)`,
  }
}

export function cellStyle<T>(
  layout: DataTablePinLayout<T>,
  column: DataTableColumn<T>,
  head = false,
): DataTableCellStyle {
  return {
    ...(layout.constrained
      ? {}
      : {
          width: cssSize(column.width),
          minWidth: cssSize(column.minWidth ?? column.width),
          maxWidth: cssSize(column.maxWidth),
        }),
    ...pinStyle(layout, column, head),
  }
}

export function controlStyle<T>(
  columns: DataTableColumn<T>[],
  side: 'start' | 'end',
  index: number,
  head = false,
): DataTableCellStyle {
  return {
    width: side === 'end' ? '72px' : '48px',
    minWidth: side === 'end' ? '72px' : '48px',
    paddingInline: '8px',
    textAlign: 'center',
    ...(columns.some(column => column.pin === side)
      ? {
          position: 'sticky',
          [side === 'start' ? 'insetInlineStart' : 'insetInlineEnd']: `${index * 48}px`,
          zIndex: head ? 5 : 1,
          backgroundColor: head ? 'var(--hn-table-head-bg)' : 'var(--hn-table-bg)',
        }
      : {}),
  }
}

export interface DataTableHeaderPlacement<S> {
  id: string
  leaf: boolean
  colspan: number
  rowspan: number
  top: number
  style: S
}

export function headerRows<T, C extends object, S extends object>(
  columns: DataTableColumn<T>[],
  visible: DataTableColumn<T>[],
  heights: number[],
  sticky: boolean | undefined,
  context: (column: DataTableColumn<T>) => C,
  styleOf: (column: DataTableColumn<T>, leaf: boolean) => S,
) {
  const paths = new Map<string, DataTableColumn<T>[]>()
  function visit(columns: DataTableColumn<T>[], parent: DataTableColumn<T>[] = []) {
    for (const column of columns) {
      const path = [...parent, column]
      if (column.children?.length) visit(column.children, path)
      else paths.set(column.key, path)
    }
  }
  visit(columns)
  const depth = Math.max(1, ...visible.map(column => paths.get(column.key)!.length))
  return Array.from({ length: depth }, (_, level) => {
    const result: (C & DataTableHeaderPlacement<S>)[] = []
    for (let index = 0; index < visible.length;) {
      const first = visible[index]!
      const path = paths.get(first.key)!
      const column = path[level]
      if (!column) {
        index++
        continue
      }
      const leaf = level === path.length - 1
      let end = index + 1
      if (!leaf)
        while (
          end < visible.length &&
          paths.get(visible[end]!.key)?.[level]?.key === column.key &&
          visible[end]!.pin === first.pin
        )
          end++
      const top = Array.from({ length: level }, (_, i) => heights[i] ?? 44).reduce(
        (a, b) => a + b,
        0,
      )
      result.push({
        ...context(column),
        id: leaf ? `leaf:${column.key}` : `${level}:${column.key}:${first.key}`,
        leaf,
        colspan: end - index,
        rowspan: leaf ? depth - level : 1,
        top,
        style: {
          ...(leaf
            ? styleOf(column, true)
            : styleOf(first.pin === 'end' ? visible[end - 1]! : first, false)),
          ...(sticky ? { top: `${top}px` } : {}),
        } as S,
      })
      index = end
    }
    return result
  })
}

export function canMoveColumn<T>(columns: DataTableColumn<T>[], key: string, target: string) {
  if (key === target) return false
  const source = columns.find(column => column.key === key),
    destination = columns.find(column => column.key === target)
  return !(
    !source ||
    !destination ||
    source.pin !== destination.pin ||
    source.reorderable === false ||
    destination.reorderable === false
  )
}

export function columnOrder<T>(order: string[], leaves: DataTableColumn<T>[]) {
  return [...new Set([...order, ...leaves.map(column => column.key)])]
}

export function moveColumnOrder<T>(
  order: string[],
  leaves: DataTableColumn<T>[],
  key: string,
  target: string,
) {
  const next = columnOrder(order, leaves)
  const from = next.indexOf(key),
    to = next.indexOf(target)
  next.splice(from, 1)
  next.splice(to, 0, key)
  return next
}

export function dropColumnOrder<T>(
  order: string[],
  leaves: DataTableColumn<T>[],
  key: string,
  target: string,
  before: boolean | undefined,
) {
  const next = columnOrder(order, leaves)
  next.splice(next.indexOf(key), 1)
  next.splice(next.indexOf(target) + (before ? 0 : 1), 0, key)
  return next
}

export function reorderPosition(from: number, to: number, before?: boolean) {
  return before === undefined ? to : to + (before ? 0 : 1) - (from < to ? 1 : 0)
}

export function reorderedRows<T>(source: T[], from: number, position: number, row: T) {
  const rows = [...source]
  rows.splice(from, 1)
  rows.splice(position, 0, row)
  return rows
}
