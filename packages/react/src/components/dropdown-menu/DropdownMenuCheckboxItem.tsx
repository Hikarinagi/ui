'use client'

import type { HTMLAttributes, ReactNode, Ref } from 'react'
import { Check } from 'lucide-react'
import { useControllableState } from 'radix-ui/internal'
import {
  DropdownMenuCheckboxItem as PrimitiveDropdownMenuCheckboxItem,
  DropdownMenuItemIndicator,
} from '../../primitives/dropdown-menu'
import { lucide } from '../../lib/icon'
import { cn } from '../../lib/cn'
import { dropdownItem } from './dropdown-menu.variants'

const CheckIcon = lucide(Check)

export interface DropdownMenuCheckboxItemProps extends Omit<
  HTMLAttributes<HTMLElement>,
  'onSelect'
> {
  disabled?: boolean
  textValue?: string
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  trailing?: ReactNode
  onSelect?: (event: Event) => void
  ref?: Ref<HTMLElement>
  [attribute: `data-${string}`]: string | undefined
}

export function DropdownMenuCheckboxItem({
  disabled,
  textValue,
  checked: checkedProp,
  defaultChecked,
  onCheckedChange,
  trailing,
  className,
  children,
  onSelect,
  ...attrs
}: DropdownMenuCheckboxItemProps) {
  const [checked = false, setChecked] = useControllableState({
    prop: checkedProp,
    defaultProp: defaultChecked ?? false,
    onChange: onCheckedChange,
    caller: 'DropdownMenuCheckboxItem',
  })
  return (
    <PrimitiveDropdownMenuCheckboxItem
      {...attrs}
      checked={checked}
      onCheckedChange={setChecked}
      disabled={disabled}
      textValue={textValue}
      className={cn(dropdownItem(), className)}
      onSelect={event => {
        onSelect?.(event)
        event.preventDefault()
      }}
    >
      <span className="min-w-0 flex-1">{children}</span>
      {trailing}
      <span className="flex size-4 shrink-0 items-center justify-center">
        <DropdownMenuItemIndicator>
          <CheckIcon />
        </DropdownMenuItemIndicator>
      </span>
    </PrimitiveDropdownMenuCheckboxItem>
  )
}
