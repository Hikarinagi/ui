export interface Point {
  x: number
  y: number
}

export type Polygon = Point[]

type Side = 'top' | 'right' | 'bottom' | 'left'

export function exitSideFromRect(point: Point, rect: DOMRect): Side {
  const top = Math.abs(rect.top - point.y)
  const bottom = Math.abs(rect.bottom - point.y)
  const right = Math.abs(rect.right - point.x)
  const left = Math.abs(rect.left - point.x)
  switch (Math.min(top, bottom, right, left)) {
    case left:
      return 'left'
    case right:
      return 'right'
    case top:
      return 'top'
    default:
      return 'bottom'
  }
}

export function paddedExitPoints(exitPoint: Point, exitSide: Side, padding = 5): Point[] {
  switch (exitSide) {
    case 'top':
      return [
        { x: exitPoint.x - padding, y: exitPoint.y + padding },
        { x: exitPoint.x + padding, y: exitPoint.y + padding },
      ]
    case 'bottom':
      return [
        { x: exitPoint.x - padding, y: exitPoint.y - padding },
        { x: exitPoint.x + padding, y: exitPoint.y - padding },
      ]
    case 'left':
      return [
        { x: exitPoint.x + padding, y: exitPoint.y - padding },
        { x: exitPoint.x + padding, y: exitPoint.y + padding },
      ]
    case 'right':
      return [
        { x: exitPoint.x - padding, y: exitPoint.y - padding },
        { x: exitPoint.x - padding, y: exitPoint.y + padding },
      ]
  }
}

export function pointsFromRect(rect: DOMRect): Point[] {
  const { top, right, bottom, left } = rect
  return [
    { x: left, y: top },
    { x: right, y: top },
    { x: right, y: bottom },
    { x: left, y: bottom },
  ]
}

export function isPointInPolygon(point: Point, polygon: Polygon) {
  const { x, y } = point
  let inside = false
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const a = polygon[i]!
    const b = polygon[j]!
    const intersect = a.y > y !== b.y > y && x < ((b.x - a.x) * (y - a.y)) / (b.y - a.y) + a.x
    if (intersect) inside = !inside
  }
  return inside
}

function hullPresorted(points: Point[]): Point[] {
  if (points.length <= 1) return points.slice()
  const upper: Point[] = []
  for (const p of points) {
    while (upper.length >= 2) {
      const q = upper[upper.length - 1]!
      const r = upper[upper.length - 2]!
      if ((q.x - r.x) * (p.y - r.y) >= (q.y - r.y) * (p.x - r.x)) upper.pop()
      else break
    }
    upper.push(p)
  }
  upper.pop()
  const lower: Point[] = []
  for (let i = points.length - 1; i >= 0; i--) {
    const p = points[i]!
    while (lower.length >= 2) {
      const q = lower[lower.length - 1]!
      const r = lower[lower.length - 2]!
      if ((q.x - r.x) * (p.y - r.y) >= (q.y - r.y) * (p.x - r.x)) lower.pop()
      else break
    }
    lower.push(p)
  }
  lower.pop()
  if (
    upper.length === 1 &&
    lower.length === 1 &&
    upper[0]!.x === lower[0]!.x &&
    upper[0]!.y === lower[0]!.y
  )
    return upper
  return upper.concat(lower)
}

export function hull(points: Point[]) {
  const sorted = points.slice().sort((a, b) => (a.x !== b.x ? a.x - b.x : a.y - b.y))
  return hullPresorted(sorted)
}
