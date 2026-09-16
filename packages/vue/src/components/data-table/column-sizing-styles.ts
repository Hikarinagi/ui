import type { CSSProperties } from 'vue'
import { allocateWidths, columnBounds } from './column-sizing'
import type { DataTableColumn } from './types'

export function columnSizingStyles<T extends object>(
  columns: DataTableColumn<T>[],
  overrides: Record<string, number>,
  controls: number,
): CSSProperties {
  const initial = allocateWidths(columns, overrides, 0)
  const total = Object.values(initial).reduce((sum, width) => sum + width, controls)
  const flexible = columns.filter(
    column =>
      !column.pin &&
      overrides[column.key] === undefined &&
      initial[column.key]! < columnBounds(column).max,
  )
  const capacities = flexible
    .map(column => columnBounds(column).max - initial[column.key]!)
    .sort((a, b) => a - b)
  let consumed = 0
  const shares = capacities.map((capacity, index) => {
    const share = `calc((100cqi - ${total + consumed}px) / ${capacities.length - index})`
    consumed += capacity
    return share
  })
  const keys = new Set(flexible.map(column => column.key))
  return {
    width: shares.length ? `clamp(${total}px, 100%, ${total + consumed}px)` : `${total}px`,
    '--hn-table-column-grow': shares.length ? `max(0px, ${shares.join(', ')})` : '0px',
    ...Object.fromEntries(
      columns.map((column, index) => [
        `--hn-table-column-${index}`,
        keys.has(column.key)
          ? `min(${columnBounds(column).max}px, calc(${initial[column.key]}px + var(--hn-table-column-grow)))`
          : `${initial[column.key]}px`,
      ]),
    ),
  }
}
