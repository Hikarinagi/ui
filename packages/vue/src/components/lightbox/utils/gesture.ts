import type { Point } from './zoom'

export interface Touch extends Point {
  time: number
}

export const DRAG_THRESHOLD = 4
export const TAP_MAX_DISTANCE = 10
export const TAP_MAX_MS = 300
export const DOUBLE_TAP_MS = 300
export const DOUBLE_TAP_DISTANCE = 25
export const WHEEL_LINE = 16
export const TRACKPAD_INTENSITY = 0.01

export const FLING = {
  power: 0.8,
  timeConstant: 750,
  bounceStiffness: 200,
  bounceDamping: 40,
  restDelta: 1,
  restSpeed: 10,
} as const

export function midpoint(a: Point, b: Point): Point {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
}

export function distance(a: Point, b: Point): number {
  return Math.hypot(b.x - a.x, b.y - a.y)
}

export function dragAxis(start: Point, current: Point): 'x' | 'y' | null {
  const dx = Math.abs(current.x - start.x)
  const dy = Math.abs(current.y - start.y)
  if (Math.max(dx, dy) < DRAG_THRESHOLD) return null
  return dx > dy ? 'x' : 'y'
}

export function isTap(start: Touch, end: Touch): boolean {
  return distance(start, end) <= TAP_MAX_DISTANCE && end.time - start.time <= TAP_MAX_MS
}

export function isDoubleTap(previous: Touch | null, next: Touch): boolean {
  if (!previous) return false
  return (
    next.time - previous.time <= DOUBLE_TAP_MS && distance(previous, next) <= DOUBLE_TAP_DISTANCE
  )
}

export function wheelDelta(deltaY: number, deltaMode: number, stageHeight: number): number {
  if (deltaMode === 1) return deltaY * WHEEL_LINE
  if (deltaMode === 2) return deltaY * stageHeight
  return deltaY
}
