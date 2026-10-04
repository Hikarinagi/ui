import type { HTMLAttributes, Ref } from 'react'
import { DropdownMenuSeparator as PrimitiveDropdownMenuSeparator } from '../../primitives/dropdown-menu'
import { cn } from '../../lib/cn'

export interface DropdownMenuSeparatorProps extends HTMLAttributes<HTMLElement> {
  ref?: Ref<HTMLElement>
  [attribute: `data-${string}`]: string | undefined
}

export function DropdownMenuSeparator({ className, ...attrs }: DropdownMenuSeparatorProps) {
  return (
    <PrimitiveDropdownMenuSeparator
      {...attrs}
      className={cn('bg-line -mx-1 my-1 h-px', className)}
    />
  )
}
