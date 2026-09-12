import { reactive } from 'vue'
import type { useLightboxFrames } from './useLightboxFrames'
import { baseScale } from '../utils/pose'
import { rotatedSize, zoomLevels } from '../utils/zoom'
import type { LightboxItem } from '../types'

export function useLightboxRotation(
  frames: ReturnType<typeof useLightboxFrames>,
  current: () => LightboxItem | undefined,
) {
  const rotations = reactive(new Map<string, number>())

  function rotationOf(item: LightboxItem | undefined): number {
    return item ? (rotations.get(item.id) ?? 0) : 0
  }

  function baseOf(item: LightboxItem | undefined): number {
    const frame = frames.frameOf(item)
    return baseScale(
      frame,
      frames.area.value,
      rotationOf(item) % 360,
      frames.displayOf(item) ?? frame,
    )
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
      stage: frames.area.value,
      base,
      ...zoomLevels(natural, fit, frames.area.value),
    }
  }

  function clear() {
    rotations.clear()
  }

  function advance(): number {
    const item = current()
    if (!item) return 0
    rotations.set(item.id, rotationOf(item) + 90)
    return rotationOf(item)
  }

  function drop(item: LightboxItem | undefined) {
    if (item) rotations.set(item.id, Math.round(rotationOf(item) / 360) * 360)
  }

  return { rotationOf, baseOf, geometry, clear, advance, drop }
}
