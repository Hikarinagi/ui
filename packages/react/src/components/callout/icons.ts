import { Info, Lightbulb, CircleCheck, TriangleAlert, CircleX } from 'lucide-react'
import { lucide } from '../../lib/icon'

const InfoIcon = lucide(Info)

export const calloutIcons = {
  neutral: InfoIcon,
  accent: lucide(Lightbulb),
  info: InfoIcon,
  success: lucide(CircleCheck),
  warning: lucide(TriangleAlert),
  danger: lucide(CircleX),
} as const
