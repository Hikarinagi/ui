import type { LightboxSource } from '../types'
import type { Rect } from './pose'

export function sourceRect(source: LightboxSource | null | undefined): Rect | null {
  if (!source) return null
  const isElement = 'getBoundingClientRect' in source
  if (isElement && !source.isConnected) return null
  const rect = isElement ? source.getBoundingClientRect() : source
  if (
    ![rect.x, rect.y, rect.width, rect.height].every(Number.isFinite) ||
    rect.width <= 0 ||
    rect.height <= 0
  ) {
    return null
  }
  return { x: rect.x, y: rect.y, width: rect.width, height: rect.height }
}
