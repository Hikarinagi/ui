import type { ImageVariants } from '../image/image.variants'
import type { Rect } from './utils/pose'

export type LightboxSource = HTMLImageElement | Rect

export interface LightboxItem {
  id: string
  src: string
  preview?: string
  previewSize?: { width: number; height: number }
  alt: string
  fit?: ImageVariants['fit']
  source?: () => LightboxSource | null | undefined
}
