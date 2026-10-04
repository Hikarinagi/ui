import type { ReactNode } from 'react'
import { TooltipArrow, TooltipContent, TooltipPortal } from '../../primitives/tooltip'
import { cn } from '../../lib/cn'
import type { TooltipProps } from './types'

export interface TooltipBubbleProps extends TooltipProps {
  children?: ReactNode
}

export function TooltipBubble({
  content,
  side = 'top',
  align = 'center',
  sideOffset = 8,
  open,
  className,
  children,
}: TooltipBubbleProps) {
  return (
    <TooltipPortal>
      <TooltipContent
        side={side}
        align={align}
        sideOffset={sideOffset}
        aria-label={typeof content === 'string' ? content : undefined}
        updatePositionStrategy={open === undefined ? 'optimized' : 'always'}
        className={cn(
          'hn-anim-pop [--hn-pop-in:var(--hn-duration-fast)] bg-neutral-solid text-neutral-solid-on z-(--hn-z-overlay)',
          'max-w-xs rounded-md px-2.5 py-1 text-xs shadow-md',
          className,
        )}
      >
        {children ?? content}
        <TooltipArrow width={10} height={5} className="fill-neutral-solid" />
      </TooltipContent>
    </TooltipPortal>
  )
}
