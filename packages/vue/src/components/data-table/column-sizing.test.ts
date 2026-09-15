import { describe, expect, it } from 'vitest'
import { allocateWidths, resizeBoundary, resizeBounds, resizeWidths } from './column-sizing'
import type { DataTableColumn } from './types'
type Row = { a: number; b: number }
const columns: DataTableColumn<Row>[] = [
  { key: 'a', label: 'A', width: 200, minWidth: 100, maxWidth: 400 },
  { key: 'b', label: 'B', width: 200, minWidth: 150, maxWidth: 450 },
]

describe('DataTable width allocation', () => {
  it('uses the same limits for initial fill and interactive resizing', () => {
    const unbounded = columns.map(column => ({ ...column, maxWidth: undefined }))
    expect(allocateWidths(unbounded, {}, 4000)).toEqual({ a: 1600, b: 1600 })
    expect(allocateWidths(columns, {}, 1000)).toEqual({ a: 400, b: 450 })
    expect(allocateWidths(columns, {}, 100)).toEqual({ a: 200, b: 200 })
  })
  it('preserves explicit widths while distributing remaining width only to automatic columns', () => {
    expect(allocateWidths(columns, { a: 180 }, 600)).toEqual({ a: 180, b: 420 })
    expect(allocateWidths(columns, { a: 180, hidden: 300 }, 600)).toEqual({ a: 180, b: 420 })
    expect(allocateWidths(columns, { a: 180, b: 190 }, 600)).toEqual({ a: 180, b: 190 })
  })
  it('intersects both columns limits so a fit drag cannot change their total width', () => {
    const widths = { a: 250, b: 200 }
    expect(resizeBounds(columns[0]!, columns[1], widths)).toEqual({ min: 100, max: 300 })
    expect(resizeWidths(columns[0]!, columns[1], widths, 500)).toEqual({ a: 300, b: 150 })
    expect(resizeWidths(columns[0]!, columns[1], widths, 10)).toEqual({ a: 100, b: 350 })
  })
  it('owns the shared fit boundary on the end-pinned column and respects non-resizable neighbors', () => {
    const pinned = [{ ...columns[0]! }, { ...columns[1]!, pin: 'end' as const }]
    expect(resizeBoundary(pinned, pinned[0]!, 'fit')).toBeUndefined()
    expect(resizeBoundary(pinned, pinned[1]!, 'fit')).toEqual({
      side: 'start',
      neighbor: pinned[0],
    })
    expect(resizeBoundary(pinned, pinned[0]!, 'expand')?.side).toBe('end')
    pinned[0]!.resizable = false
    expect(resizeBoundary(pinned, pinned[1]!, 'fit')).toBeUndefined()
    expect(resizeBoundary(pinned, pinned[1]!, 'expand')).toEqual({
      side: 'start',
      neighbor: undefined,
    })
  })
})
