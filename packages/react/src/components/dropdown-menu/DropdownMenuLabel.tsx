import type { HTMLAttributes, Ref } from 'react'
import { DropdownMenuLabel as PrimitiveDropdownMenuLabel } from '../../primitives/dropdown-menu'
import { cn } from '../../lib/cn'

export interface DropdownMenuLabelProps extends HTMLAttributes<HTMLElement> {
  ref?: Ref<HTMLElement>
  [attribute: `data-${string}`]: string | undefined
}

export function DropdownMenuLabel({ className, ...attrs }: DropdownMenuLabelProps) {
  return (
    <PrimitiveDropdownMenuLabel
      {...attrs}
      className={cn('text-muted px-2.5 py-1.5 text-xs font-medium', className)}
    />
  )
}
