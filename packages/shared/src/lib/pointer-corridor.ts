type Point = { x: number; y: number }
const cross = (a: Point, b: Point, c: Point) =>
  (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)

export function inPointerCorridor(point: Point, first: DOMRect, second: DOMRect) {
  const points = [first, second]
    .flatMap(rect => [
      { x: rect.left - 6, y: rect.top - 6 },
      { x: rect.right + 6, y: rect.top - 6 },
      { x: rect.left - 6, y: rect.bottom + 6 },
      { x: rect.right + 6, y: rect.bottom + 6 },
    ])
    .sort((a, b) => a.x - b.x || a.y - b.y)
  const half = (values: Point[]) => {
    const hull: Point[] = []
    for (const value of values) {
      while (hull.length > 1 && cross(hull[hull.length - 2]!, hull[hull.length - 1]!, value) <= 0)
        hull.pop()
      hull.push(value)
    }
    hull.pop()
    return hull
  }
  const hull = [...half(points), ...half([...points].reverse())]
  return hull.every((a, i) => cross(a, hull[(i + 1) % hull.length]!, point) >= 0)
}
