import type { HTMLAttributes, Ref } from 'react'
import { DropdownMenuGroup as PrimitiveDropdownMenuGroup } from '../../primitives/dropdown-menu'
import { cn } from '../../lib/cn'

export interface DropdownMenuGroupProps extends HTMLAttributes<HTMLElement> {
  ref?: Ref<HTMLElement>
  [attribute: `data-${string}`]: string | undefined
}

export function DropdownMenuGroup({ className, ...attrs }: DropdownMenuGroupProps) {
  return (
    <PrimitiveDropdownMenuGroup {...attrs} className={cn('flex flex-col gap-0.5', className)} />
  )
}
