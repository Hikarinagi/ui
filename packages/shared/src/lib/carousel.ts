export function carouselIndex(value: number | undefined, count = Infinity) {
  return Math.max(
    0,
    Math.min(Math.max(0, count - 1), Number.isFinite(value) ? Math.trunc(value!) : 0),
  )
}

export function carouselInitialLayout(count: number, value: number | undefined, loop = false) {
  const index = carouselIndex(value, count)
  return {
    index,
    snapCount: count,
    canPrev: count > 1 && (loop || index > 0),
    canNext: count > 1 && (loop || index < count - 1),
    visibleItems: count ? [index] : [],
  }
}
