'use client'

import type { HTMLAttributes, ReactNode, Ref } from 'react'
import { ContextMenuItem as PrimitiveContextMenuItem } from '../../primitives/context-menu'
import { cn } from '../../lib/cn'
import { dropdownItem, type DropdownItemVariants } from '../dropdown-menu/dropdown-menu.variants'

export interface ContextMenuItemProps extends Omit<HTMLAttributes<HTMLElement>, 'onSelect'> {
  tone?: DropdownItemVariants['tone']
  disabled?: boolean
  textValue?: string
  icon?: ReactNode
  trailing?: ReactNode
  onSelect?: (event: Event) => void
  ref?: Ref<HTMLElement>
  [attribute: `data-${string}`]: string | undefined
}

export function ContextMenuItem({
  tone,
  disabled,
  textValue,
  icon,
  trailing,
  className,
  children,
  onSelect,
  ...attrs
}: ContextMenuItemProps) {
  return (
    <PrimitiveContextMenuItem
      {...attrs}
      disabled={disabled}
      textValue={textValue}
      className={cn(dropdownItem({ tone }), className)}
      onSelect={event => onSelect?.(event)}
    >
      {icon}
      <span className="min-w-0 flex-1">{children}</span>
      {trailing}
    </PrimitiveContextMenuItem>
  )
}
