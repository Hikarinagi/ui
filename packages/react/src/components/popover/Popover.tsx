'use client'

import { Children, type HTMLAttributes, type ReactNode } from 'react'
import { useControllableState } from 'radix-ui/internal'
import { PopoverPortal, PopoverRoot, PopoverTrigger } from '../../primitives/popover'
import { PopoverContent } from './PopoverContent'
import {
  useAnchoredOverlay,
  type FocusOutsideEvent,
  type PointerDownOutsideEvent,
} from '../../lib/anchored-overlay'
import type { OverlayAnchor, OverlayPositionStrategy } from '../../lib/overlay-anchor'
import { hasContent } from '../../lib/content'
import { Card } from '../card/Card'
import { cn } from '../../lib/cn'

export interface PopoverProps extends Omit<HTMLAttributes<HTMLElement>, 'content'> {
  anchor?: OverlayAnchor | null
  updatePositionStrategy?: OverlayPositionStrategy
  modal?: boolean
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
  padded?: boolean
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  onOpenAutoFocus?: (event: Event) => void
  onCloseAutoFocus?: (event: Event) => void
  onEscapeKeyDown?: (event: KeyboardEvent) => void
  onPointerDownOutside?: (event: PointerDownOutsideEvent) => void
  onFocusOutside?: (event: FocusOutsideEvent) => void
  onInteractOutside?: (event: PointerDownOutsideEvent | FocusOutsideEvent) => void
  content?: ReactNode
  children?: ReactNode
  [attribute: `data-${string}`]: string | undefined
}

export function Popover({
  anchor,
  updatePositionStrategy = 'optimized',
  modal = true,
  side = 'bottom',
  align = 'center',
  sideOffset = 8,
  padded = true,
  className,
  open: openProp,
  defaultOpen,
  onOpenChange,
  onOpenAutoFocus,
  onCloseAutoFocus,
  onEscapeKeyDown,
  onPointerDownOutside,
  onFocusOutside,
  onInteractOutside,
  content,
  children,
  ...attrs
}: PopoverProps) {
  const [open, setOpen] = useControllableState<boolean | undefined>({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: value => {
      if (value !== undefined) onOpenChange?.(value)
    },
    caller: 'Popover',
  })
  const { trigger, contentRef, present, reference, visible, events } = useAnchoredOverlay(
    { anchor, modal, updatePositionStrategy },
    open,
    { onCloseAutoFocus, onEscapeKeyDown, onPointerDownOutside, onFocusOutside, onInteractOutside },
    event => onOpenAutoFocus?.(event),
  )

  const pressOrigin =
    side === 'left'
      ? 'right'
      : side === 'right'
        ? 'left'
        : align === 'start'
          ? 'left'
          : align === 'end'
            ? 'right'
            : 'center'

  return (
    <PopoverRoot open={visible} onOpenChange={setOpen} modal={modal}>
      {hasContent(children) && Children.toArray(children).length > 0 && (
        <PopoverTrigger ref={trigger} asChild style={{ transformOrigin: pressOrigin }}>
          {children}
        </PopoverTrigger>
      )}
      {present && (
        <PopoverPortal>
          <PopoverContent
            {...attrs}
            {...events}
            reference={reference}
            updatePositionStrategy={updatePositionStrategy}
            asChild
            side={side}
            align={align}
            sideOffset={sideOffset}
          >
            <Card
              ref={contentRef}
              padded={padded}
              className={cn(
                'hn-anim-pop z-(--hn-z-overlay) max-w-sm shadow-md outline-none',
                className,
              )}
            >
              {content}
            </Card>
          </PopoverContent>
        </PopoverPortal>
      )}
    </PopoverRoot>
  )
}
