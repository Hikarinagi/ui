import { Megaphone } from 'lucide-react'
import { lucide } from '../../lib/icon'
import { calloutIcons } from '../callout/icons'

export const bannerIcons = {
  ...calloutIcons,
  accent: lucide(Megaphone),
} as const
