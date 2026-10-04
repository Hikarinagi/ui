import type { ComponentType } from 'react'
import type { BannerVariants } from './banner.variants'

export type BannerTone = NonNullable<BannerVariants['tone']>

export interface BannerNotice {
  tone?: BannerTone
  icon?: ComponentType<{ className?: string; 'aria-hidden'?: 'true' }>
}
