import type { useLightboxFrames } from './useLightboxFrames'
import { openPose, type Pose } from '../utils/pose'
import { clipOf } from '../utils/clip'
import { sourceRect } from '../utils/source'
import type { LightboxItem } from '../types'

export function useLightboxPose(
  frames: ReturnType<typeof useLightboxFrames>,
  current: () => LightboxItem | undefined,
) {
  function fromSource(): Pose | null {
    const item = current()
    const source = item?.source?.()
    const box = sourceRect(source)
    const natural = frames.naturalOf(item)
    if (!box || !natural) return null
    const stage = frames.stage.value
    if (
      box.y + box.height <= 0 ||
      box.x + box.width <= 0 ||
      box.y >= stage.height ||
      box.x >= stage.width
    ) {
      return null
    }
    const el = source && 'getBoundingClientRect' in source ? source : undefined
    const clip = clipOf(el, box)
    if (clip.rect.width <= 0 || clip.rect.height <= 0) return null
    return openPose(frames.frameOf(item), box, natural, item?.fit, clip.corners, clip.rect)
  }

  return { fromSource }
}
