'use client'

import type { HTMLAttributes, ReactNode, Ref } from 'react'
import { DropdownMenuItem as PrimitiveDropdownMenuItem } from '../../primitives/dropdown-menu'
import { cn } from '../../lib/cn'
import { dropdownItem, type DropdownItemVariants } from './dropdown-menu.variants'

export interface DropdownMenuItemProps extends Omit<HTMLAttributes<HTMLElement>, 'onSelect'> {
  tone?: DropdownItemVariants['tone']
  disabled?: boolean
  textValue?: string
  icon?: ReactNode
  trailing?: ReactNode
  onSelect?: (event: Event) => void
  ref?: Ref<HTMLElement>
  [attribute: `data-${string}`]: string | undefined
}

export function DropdownMenuItem({
  tone,
  disabled,
  textValue,
  icon,
  trailing,
  className,
  children,
  onSelect,
  ...attrs
}: DropdownMenuItemProps) {
  return (
    <PrimitiveDropdownMenuItem
      {...attrs}
      disabled={disabled}
      textValue={textValue}
      className={cn(dropdownItem({ tone }), className)}
      onSelect={event => onSelect?.(event)}
    >
      {icon}
      <span className="min-w-0 flex-1">{children}</span>
      {trailing}
    </PrimitiveDropdownMenuItem>
  )
}
