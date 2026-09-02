import { Info, Lightbulb, CircleCheck, TriangleAlert, CircleX } from '@lucide/vue'

export const calloutIcons = {
  neutral: Info,
  accent: Lightbulb,
  info: Info,
  success: CircleCheck,
  warning: TriangleAlert,
  danger: CircleX,
} as const
