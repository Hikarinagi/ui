'use client'

import { Children, type HTMLAttributes, type ReactNode } from 'react'
import { useControllableState } from 'radix-ui/internal'
import {
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from '../../primitives/dropdown-menu'
import {
  useAnchoredOverlay,
  type FocusOutsideEvent,
  type PointerDownOutsideEvent,
} from '../../lib/anchored-overlay'
import type { OverlayAnchor, OverlayPositionStrategy } from '../../lib/overlay-anchor'
import { hasContent } from '../../lib/content'
import { Card } from '../card/Card'
import { cn } from '../../lib/cn'

export interface DropdownMenuProps extends Omit<HTMLAttributes<HTMLElement>, 'content' | 'dir'> {
  label?: string
  anchor?: OverlayAnchor | null
  updatePositionStrategy?: OverlayPositionStrategy
  modal?: boolean
  dir?: 'ltr' | 'rtl'
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  onCloseAutoFocus?: (event: Event) => void
  onEscapeKeyDown?: (event: KeyboardEvent) => void
  onPointerDownOutside?: (event: PointerDownOutsideEvent) => void
  onFocusOutside?: (event: FocusOutsideEvent) => void
  onInteractOutside?: (event: PointerDownOutsideEvent | FocusOutsideEvent) => void
  content?: ReactNode
  children?: ReactNode
  [attribute: `data-${string}`]: string | undefined
}

export function DropdownMenu({
  label,
  anchor,
  updatePositionStrategy = 'optimized',
  modal = true,
  dir,
  side = 'bottom',
  align = 'center',
  sideOffset = 8,
  className,
  open: openProp,
  defaultOpen,
  onOpenChange,
  onCloseAutoFocus,
  onEscapeKeyDown,
  onPointerDownOutside,
  onFocusOutside,
  onInteractOutside,
  content,
  children,
  ...attrs
}: DropdownMenuProps) {
  const [open, setOpen] = useControllableState<boolean | undefined>({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: value => {
      if (value !== undefined) onOpenChange?.(value)
    },
    caller: 'DropdownMenu',
  })
  const { trigger, contentRef, present, reference, visible, events } = useAnchoredOverlay(
    { anchor, modal, updatePositionStrategy, dir },
    open,
    { onCloseAutoFocus, onEscapeKeyDown, onPointerDownOutside, onFocusOutside, onInteractOutside },
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
    <DropdownMenuRoot open={visible} onOpenChange={setOpen} modal={modal} dir={dir}>
      {hasContent(children) && Children.toArray(children).length > 0 && (
        <DropdownMenuTrigger
          ref={trigger}
          asChild
          className="group/hn-disclosure"
          style={{ transformOrigin: pressOrigin }}
        >
          {children}
        </DropdownMenuTrigger>
      )}
      {present && (
        <DropdownMenuPortal>
          <DropdownMenuContent
            aria-label={label}
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
              padded={false}
              className={cn(
                'hn-anim-pop z-(--hn-z-overlay) flex min-w-40 flex-col gap-0.5 p-1 shadow-md outline-none',
                className,
              )}
            >
              {content}
            </Card>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      )}
    </DropdownMenuRoot>
  )
}
