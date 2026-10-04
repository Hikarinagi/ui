'use client'

import type { HTMLAttributes, Ref } from 'react'
import { Check } from 'lucide-react'
import {
  DropdownMenuItemIndicator,
  DropdownMenuRadioItem as PrimitiveDropdownMenuRadioItem,
} from '../../primitives/dropdown-menu'
import { lucide } from '../../lib/icon'
import { cn } from '../../lib/cn'
import { dropdownItem } from './dropdown-menu.variants'

const CheckIcon = lucide(Check)

export interface DropdownMenuRadioItemProps extends Omit<HTMLAttributes<HTMLElement>, 'onSelect'> {
  value: string
  disabled?: boolean
  textValue?: string
  onSelect?: (event: Event) => void
  ref?: Ref<HTMLElement>
  [attribute: `data-${string}`]: string | undefined
}

export function DropdownMenuRadioItem({
  value,
  disabled,
  textValue,
  className,
  children,
  ...attrs
}: DropdownMenuRadioItemProps) {
  return (
    <PrimitiveDropdownMenuRadioItem
      {...attrs}
      value={value}
      disabled={disabled}
      textValue={textValue}
      className={cn(dropdownItem(), className)}
    >
      <span className="min-w-0 flex-1">{children}</span>
      <span className="flex size-4 shrink-0 items-center justify-center">
        <DropdownMenuItemIndicator>
          <CheckIcon className="size-4" />
        </DropdownMenuItemIndicator>
      </span>
    </PrimitiveDropdownMenuRadioItem>
  )
}
