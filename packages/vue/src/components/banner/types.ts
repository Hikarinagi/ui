import type { Component } from 'vue'
import type { BannerVariants } from './banner.variants'

export type BannerTone = NonNullable<BannerVariants['tone']>

export interface BannerNotice {
  tone?: BannerTone
  icon?: Component
}
