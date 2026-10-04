export type SlideDirection = 1 | -1

export function stepBetween(previous: number, next: number, count: number): SlideDirection {
  if (count < 2) return 1
  const from = ((previous % count) + count) % count
  const to = ((next % count) + count) % count
  if (to === (from + 1) % count) return 1
  if (to === (from - 1 + count) % count) return -1
  return to > from ? 1 : -1
}
