'use client'

import type { HTMLAttributes, Ref } from 'react'
import { Check } from 'lucide-react'
import {
  ContextMenuItemIndicator,
  ContextMenuRadioItem as PrimitiveContextMenuRadioItem,
} from '../../primitives/context-menu'
import { lucide } from '../../lib/icon'
import { cn } from '../../lib/cn'
import { dropdownItem } from '../dropdown-menu/dropdown-menu.variants'

const CheckIcon = lucide(Check)

export interface ContextMenuRadioItemProps extends Omit<HTMLAttributes<HTMLElement>, 'onSelect'> {
  value: string
  disabled?: boolean
  textValue?: string
  onSelect?: (event: Event) => void
  ref?: Ref<HTMLElement>
  [attribute: `data-${string}`]: string | undefined
}

export function ContextMenuRadioItem({
  value,
  disabled,
  textValue,
  className,
  children,
  ...attrs
}: ContextMenuRadioItemProps) {
  return (
    <PrimitiveContextMenuRadioItem
      {...attrs}
      value={value}
      disabled={disabled}
      textValue={textValue}
      className={cn(dropdownItem(), className)}
    >
      <span className="min-w-0 flex-1">{children}</span>
      <span className="flex size-4 shrink-0 items-center justify-center">
        <ContextMenuItemIndicator>
          <CheckIcon className="size-4" />
        </ContextMenuItemIndicator>
      </span>
    </PrimitiveContextMenuRadioItem>
  )
}
