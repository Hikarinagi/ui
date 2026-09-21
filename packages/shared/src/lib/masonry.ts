export interface MasonryPosition {
  column: number
  top: number
}

export function masonryColumns(width: number, minWidth: number, gap: number, columns?: number) {
  if (columns !== undefined && Number.isFinite(columns)) return Math.max(1, Math.floor(columns))
  const minimum = Number.isFinite(minWidth) && minWidth > 0 ? minWidth : 240
  return Math.max(1, Math.floor((Math.max(0, width) + gap) / (minimum + gap)))
}

export function layoutMasonry(
  heights: readonly number[],
  columns: number,
  gap: number,
  sequential = false,
): { positions: MasonryPosition[]; height: number } {
  const count = Math.max(1, Math.floor(columns))
  const ends = Array<number>(count).fill(0)
  const occupied = Array<boolean>(count).fill(false)
  const positions = heights.map((height, index) => {
    let column = index % count
    if (!sequential) {
      column = 0
      for (let i = 1; i < count; i++) if (ends[i]! < ends[column]!) column = i
    }
    const top = ends[column]!
    ends[column] = top + Math.max(0, height) + gap
    occupied[column] = true
    return { column, top }
  })
  return {
    positions,
    height: Math.max(0, ...ends.map((end, index) => (occupied[index] ? end - gap : 0))),
  }
}
