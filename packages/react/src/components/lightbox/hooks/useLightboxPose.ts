import type { LightboxFrames } from './useLightboxFrames'
import { openPose, type Pose } from '../../../../../shared/src/lib/lightbox/pose'
import { clipOf } from '../../../../../shared/src/lib/lightbox/clip'
import { sourceRect } from '../../../../../shared/src/lib/lightbox/source'
import type { LightboxItem } from '../types'

export function createLightboxPose(
  frames: LightboxFrames,
  current: () => LightboxItem | undefined,
) {
  function fromSource(): Pose | null {
    const item = current()
    const source = item?.source?.()
    const box = sourceRect(source)
    const el = source && 'getBoundingClientRect' in source ? source : undefined
    const natural =
      el?.naturalWidth && el.naturalHeight
        ? { width: el.naturalWidth, height: el.naturalHeight }
        : (frames.naturalOf(item) ?? frames.displayOf(item))
    if (!box || !natural) return null
    const stage = frames.stage
    if (
      box.y + box.height <= 0 ||
      box.x + box.width <= 0 ||
      box.y >= stage.height ||
      box.x >= stage.width
    ) {
      return null
    }
    const clip = clipOf(el, box)
    if (clip.rect.width <= 0 || clip.rect.height <= 0) return null
    return openPose(frames.frameOf(item), box, natural, item?.fit, clip.corners, clip.rect)
  }

  return { fromSource }
}
