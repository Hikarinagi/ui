'use client'

import { Children, type ReactNode } from 'react'
import {
  HoverCardContent,
  HoverCardPortal,
  HoverCardRoot,
  HoverCardTrigger,
} from '../../primitives/hover-card'
import type { OverlayAnchor, OverlayPositionStrategy } from '../../lib/overlay-anchor'
import { hasContent } from '../../lib/content'
import { cn } from '../../lib/cn'
import { Card } from '../card/Card'
import { HoverCardAnchor } from './HoverCardAnchor'
import { useControllableState } from '../../primitives/utils/controllable-state'

export interface HoverCardProps {
  anchor?: OverlayAnchor | null
  updatePositionStrategy?: OverlayPositionStrategy
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
  openDelay?: number
  closeDelay?: number
  padded?: boolean
  className?: string
  positionerClass?: string
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  content?: ReactNode
  children?: ReactNode
}

export function HoverCard({
  anchor,
  updatePositionStrategy = 'optimized',
  side = 'bottom',
  align = 'center',
  sideOffset = 8,
  openDelay = 300,
  closeDelay = 150,
  padded = true,
  className,
  positionerClass,
  open: openProp,
  defaultOpen,
  onOpenChange,
  content,
  children,
}: HoverCardProps) {
  const [open, setOpen] = useControllableState<boolean | undefined>({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: value => {
      if (value !== undefined) onOpenChange?.(value)
    },
    caller: 'HoverCard',
  })
  const slotted = hasContent(children)

  return (
    <HoverCardRoot
      open={open ?? false}
      onOpenChange={setOpen}
      openDelay={openDelay}
      closeDelay={closeDelay}
    >
      {slotted && Children.toArray(children).length > 0 && (
        <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      )}
      <HoverCardAnchor
        anchor={anchor}
        updatePositionStrategy={updatePositionStrategy}
        external={!slotted}
        closeDelay={closeDelay}
        positionerClass={positionerClass}
      >
        {({ reference, contentRef, present }) =>
          present && (
            <HoverCardPortal>
              <HoverCardContent
                reference={reference}
                updatePositionStrategy={updatePositionStrategy}
                asChild
                side={side}
                align={align}
                sideOffset={sideOffset}
              >
                <Card
                  ref={contentRef}
                  data-hn-hover-card=""
                  inert={!open}
                  padded={padded}
                  className={cn(
                    'hn-anim-pop z-(--hn-z-overlay) max-w-sm shadow-md outline-none',
                    className,
                  )}
                >
                  {content}
                </Card>
              </HoverCardContent>
            </HoverCardPortal>
          )
        }
      </HoverCardAnchor>
    </HoverCardRoot>
  )
}
