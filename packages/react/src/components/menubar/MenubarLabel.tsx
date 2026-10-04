import type { HTMLAttributes, Ref } from 'react'
import { MenubarLabel as PrimitiveMenubarLabel } from '../../primitives/menubar'
import { cn } from '../../lib/cn'

export interface MenubarLabelProps extends HTMLAttributes<HTMLElement> {
  ref?: Ref<HTMLElement>
  [attribute: `data-${string}`]: string | undefined
}

export function MenubarLabel({ className, ...attrs }: MenubarLabelProps) {
  return (
    <PrimitiveMenubarLabel
      {...attrs}
      className={cn('text-muted px-2.5 py-1.5 text-xs font-medium', className)}
    />
  )
}
