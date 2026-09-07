import { Megaphone } from '@lucide/vue'
import { calloutIcons } from '../callout/icons'

export const bannerIcons = {
  ...calloutIcons,
  accent: Megaphone,
} as const
