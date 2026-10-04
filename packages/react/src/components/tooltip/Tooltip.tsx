import type { ReactElement } from 'react'
import { TooltipRoot, TooltipTrigger } from '../../primitives/tooltip'
import { TooltipBubble } from './TooltipBubble'
import type { TooltipProps } from './types'

export interface TooltipComponentProps extends TooltipProps {
  children: ReactElement
}

export function Tooltip({ open, disabled = false, children, ...props }: TooltipComponentProps) {
  return (
    <TooltipRoot open={open} disabled={disabled} ignoreNonKeyboardFocus>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipBubble {...props} open={open} disabled={disabled} />
    </TooltipRoot>
  )
}
