import type { LightboxFrames } from './useLightboxFrames'
import { baseScale } from '../../../../../shared/src/lib/lightbox/pose'
import { rotatedSize, zoomLevels } from '../../../../../shared/src/lib/lightbox/zoom'
import type { LightboxItem } from '../types'

export function createLightboxRotation(
  frames: LightboxFrames,
  current: () => LightboxItem | undefined,
  notify: () => void,
) {
  const rotations = new Map<string, number>()

  function rotationOf(item: LightboxItem | undefined): number {
    return item ? (rotations.get(item.id) ?? 0) : 0
  }

  function baseOf(item: LightboxItem | undefined): number {
    const frame = frames.frameOf(item)
    return baseScale(frame, frames.area, rotationOf(item) % 360, frames.displayOf(item) ?? frame)
  }

  function geometry() {
    const item = current()
    const base = baseOf(item)
    const visual = rotatedSize(frames.frameOf(item), rotationOf(item) % 360)
    const fit = { width: visual.width * base, height: visual.height * base }
    const natural = rotatedSize(frames.displayOf(item) ?? fit, rotationOf(item) % 360)
    return {
      fit,
      frame: frames.frameOf(item),
      stage: frames.area,
      base,
      ...zoomLevels(natural, fit, frames.area),
    }
  }

  function clear() {
    if (!rotations.size) return
    rotations.clear()
    notify()
  }

  function advance(): number {
    const item = current()
    if (!item) return 0
    rotations.set(item.id, rotationOf(item) + 90)
    notify()
    return rotationOf(item)
  }

  function drop(item: LightboxItem | undefined) {
    if (!item) return
    const next = Math.round(rotationOf(item) / 360) * 360
    if (rotations.get(item.id) === next) return
    rotations.set(item.id, next)
    notify()
  }

  return { rotationOf, baseOf, geometry, clear, advance, drop }
}

export type LightboxRotation = ReturnType<typeof createLightboxRotation>
