import type { DataTableColumn } from './types'

export function pixelWidth(value: number | string | undefined, fallback: number) {
  return typeof value === 'number' && Number.isFinite(value)
    ? value
    : typeof value === 'string' && /^\d+(\.\d+)?px$/.test(value)
      ? parseFloat(value)
      : fallback
}

export function columnBounds<T extends object>(column: DataTableColumn<T>) {
  const min = Math.max(0, pixelWidth(column.minWidth, 48))
  return { min, max: Math.max(min, pixelWidth(column.maxWidth, 1600)) }
}

export function clampWidth<T extends object>(column: DataTableColumn<T>, width: number) {
  const { min, max } = columnBounds(column)
  return Math.max(min, Math.min(max, width))
}

export function allocateWidths<T extends object>(
  columns: DataTableColumn<T>[],
  overrides: Record<string, number>,
  available: number,
) {
  const widths = Object.fromEntries(
    columns.map(column => [
      column.key,
      clampWidth(column, pixelWidth(overrides[column.key] ?? column.width, 160)),
    ]),
  )
  let remaining = available - Object.values(widths).reduce((sum, width) => sum + width, 0)
  let flexible = columns.filter(column => !column.pin && overrides[column.key] === undefined)
  while (remaining > 0.01 && flexible.length) {
    const share = remaining / flexible.length
    for (const column of flexible) {
      const extra = Math.min(share, columnBounds(column).max - widths[column.key]!)
      widths[column.key]! += extra
      remaining -= extra
    }
    flexible = flexible.filter(column => widths[column.key]! < columnBounds(column).max - 0.01)
  }
  return widths
}

export function resizeBoundary<T extends object>(
  columns: DataTableColumn<T>[],
  column: DataTableColumn<T>,
  mode: 'fit' | 'expand',
) {
  const index = columns.findIndex(item => item.key === column.key)
  if (index < 0 || column.resizable === false) return
  const side = column.pin === 'end' ? 'start' : 'end'
  const neighbor = columns[index + (side === 'start' ? -1 : 1)]
  if (mode === 'fit' && side === 'end' && neighbor?.pin === 'end') return
  if (mode === 'fit' && (!neighbor || neighbor.resizable === false)) return
  return { side, neighbor: mode === 'fit' ? neighbor : undefined } as const
}

export function resizeBounds<T extends object>(
  column: DataTableColumn<T>,
  neighbor: DataTableColumn<T> | undefined,
  widths: Record<string, number>,
  minimumTotalWidth = 0,
) {
  const bounds = columnBounds(column)
  if (!neighbor) {
    const otherWidth = Object.entries(widths).reduce(
      (sum, [key, width]) => sum + (key === column.key ? 0 : width),
      0,
    )
    return {
      min: Math.max(bounds.min, Math.min(widths[column.key]!, minimumTotalWidth - otherWidth)),
      max: bounds.max,
    }
  }
  const other = columnBounds(neighbor)
  const total = widths[column.key]! + widths[neighbor.key]!
  return {
    min: Math.max(bounds.min, total - other.max),
    max: Math.min(bounds.max, total - other.min),
  }
}

export function resizeWidths<T extends object>(
  column: DataTableColumn<T>,
  neighbor: DataTableColumn<T> | undefined,
  widths: Record<string, number>,
  value: number,
  minimumTotalWidth = 0,
) {
  const { min, max } = resizeBounds(column, neighbor, widths, minimumTotalWidth)
  const width = Math.max(min, Math.min(max, value))
  return {
    [column.key]: width,
    ...(neighbor ? { [neighbor.key]: widths[neighbor.key]! + widths[column.key]! - width } : {}),
  }
}
