import type { ImageVariants } from '../image/image.variants'

export interface LightboxItem {
  id: string
  src: string
  preview?: string
  alt: string
  fit?: ImageVariants['fit']
  source?: () => HTMLImageElement | null | undefined
}
