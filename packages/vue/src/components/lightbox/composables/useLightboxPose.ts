import type { useLightboxFrames } from './useLightboxFrames'
import { openPose, radiusOf, type Pose, type Rect } from '../utils/pose'
import type { LightboxItem } from '../types'

export function useLightboxPose(
  frames: ReturnType<typeof useLightboxFrames>,
  current: () => LightboxItem | undefined,
) {
  function sourceBox(): Rect | null {
    const el = current()?.source?.()
    if (!el?.isConnected) return null
    const rect = el.getBoundingClientRect()
    if (rect.width <= 0 || rect.height <= 0) return null
    const stage = frames.stage.value
    if (
      rect.bottom <= 0 ||
      rect.right <= 0 ||
      rect.top >= stage.height ||
      rect.left >= stage.width
    ) {
      return null
    }
    return { x: rect.x, y: rect.y, width: rect.width, height: rect.height }
  }

  function fromSource(): Pose | null {
    const item = current()
    const box = sourceBox()
    const natural = frames.naturalOf(item)
    if (!box || !natural) return null
    return openPose(frames.frameOf(item), box, natural, item?.fit, radiusOf(item?.source?.()))
  }

  return { fromSource }
}
