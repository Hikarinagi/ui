import { rubberBand } from './zoom'

export const PAGE_COMMIT = 0.2
export const PAGE_VELOCITY = 400
export const PAGE_PROJECTION = 0.25

export function pageSteps(offset: number, velocity: number, width: number): number {
  if (width <= 0) return 0
  if (Math.abs(offset) < width * PAGE_COMMIT && Math.abs(velocity) < PAGE_VELOCITY) return 0
  const projected = offset + velocity * PAGE_PROJECTION
  if (projected === 0) return 0
  return projected < 0 ? 1 : -1
}

export function clampIndex(index: number, count: number): number {
  if (count <= 0) return 0
  return Math.min(Math.max(index, 0), count - 1)
}

export function wrapIndex(index: number, count: number): number {
  if (count <= 0) return 0
  return ((index % count) + count) % count
}

export function shortestDelta(delta: number, count: number): number {
  if (count <= 0) return 0
  const forward = wrapIndex(delta, count)
  return forward > count / 2 ? forward - count : forward
}

export function edgePosition(raw: number, count: number, width: number): number {
  return rubberBand(raw, -Math.max(0, count - 1) * width, 0, width)
}
