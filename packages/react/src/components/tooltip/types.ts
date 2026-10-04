import type { ReactNode } from 'react'

export interface TooltipProps {
  content?: ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
  open?: boolean
  disabled?: boolean
  className?: string
}
