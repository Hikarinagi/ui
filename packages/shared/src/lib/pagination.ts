import type { PaginationEntry, PaginationRange } from '../types/pagination'

export function paginationInteger(value: number, fallback: number, minimum: number) {
  return Number.isFinite(value) ? Math.max(minimum, Math.floor(value)) : fallback
}

export function paginationRanges(items: PaginationEntry[]): PaginationRange[] {
  return items.flatMap((item, index) => {
    if (item.type !== 'ellipsis') return []
    const previous = items[index - 1]
    const next = items[index + 1]
    if (previous?.type !== 'page' || next?.type !== 'page' || next.value <= previous.value + 1)
      return []
    return [{ side: index === 1 ? 'prev' : 'next', from: previous.value + 1, to: next.value - 1 }]
  })
}
