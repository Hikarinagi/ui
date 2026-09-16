import type { DataTableColumn, DataTableFilterMode, DataTableKey } from './types'

export function rowId(key: DataTableKey) {
  return `${typeof key}:${key}`
}

export function rowKey(id: string): DataTableKey {
  return id.startsWith('number:') ? Number(id.slice(7)) : id.slice(7)
}

export function positiveInteger(value: number, fallback: number) {
  return Number.isFinite(value) ? Math.max(1, Math.floor(value)) : fallback
}

export function cssSize(value: number | string | undefined) {
  return typeof value === 'number' ? `${value}px` : value
}

export function isRowAction(event: MouseEvent | KeyboardEvent) {
  const target = event.target as HTMLElement | null
  if (!target || event.defaultPrevented) return false
  if (event.type === 'keydown') return target === event.currentTarget
  const control = target.closest(
    'a, button, input, select, textarea, label, [role="button"], [role="checkbox"], [role="switch"], [contenteditable]:not([contenteditable="false"]), [tabindex]',
  )
  return !control || control === event.currentTarget
}

export function flattenColumns<T>(columns: DataTableColumn<T>[]): DataTableColumn<T>[] {
  return columns.flatMap(column =>
    column.children?.length ? flattenColumns(column.children) : [column],
  )
}
export function filterValue(
  value: unknown,
  filter: unknown,
  mode: DataTableFilterMode = 'contains',
  locale = 'en',
) {
  if (mode === 'equals') return Object.is(value, filter)
  if (mode === 'in') return Array.isArray(filter) && filter.some(item => Object.is(item, value))
  if (mode === 'range') {
    if (!Array.isArray(filter)) return true
    const numeric = value instanceof Date ? value.getTime() : Number(value)
    const bound = (value: unknown) => (value instanceof Date ? value.getTime() : Number(value))
    return (
      value != null &&
      Number.isFinite(numeric) &&
      (filter[0] == null || numeric >= bound(filter[0])) &&
      (filter[1] == null || numeric <= bound(filter[1]))
    )
  }
  return String(value ?? '')
    .toLocaleLowerCase(locale)
    .includes(String(filter ?? '').toLocaleLowerCase(locale))
}
export function aggregate<T>(
  rows: T[],
  column: DataTableColumn<T>,
  valueOf: (row: T, column: DataTableColumn<T>) => unknown,
) {
  if (typeof column.aggregate === 'function') return column.aggregate(rows)
  if (!column.aggregate) return undefined
  if (column.aggregate === 'count') return rows.length
  const values = rows.map(row => valueOf(row, column))
  if (column.aggregate === 'uniqueCount') return new Set(values).size
  const numbers = values.filter(
    (value): value is number => typeof value === 'number' && Number.isFinite(value),
  )
  if (!numbers.length) return column.aggregate === 'sum' ? 0 : undefined
  if (column.aggregate === 'min') return numbers.reduce((a, b) => Math.min(a, b))
  if (column.aggregate === 'max') return numbers.reduce((a, b) => Math.max(a, b))
  const sum = numbers.reduce((a, b) => a + b, 0)
  return column.aggregate === 'mean' ? sum / numbers.length : sum
}
