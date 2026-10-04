import type { HTMLAttributes, Ref } from 'react'
import { ContextMenuLabel as PrimitiveContextMenuLabel } from '../../primitives/context-menu'
import { cn } from '../../lib/cn'

export interface ContextMenuLabelProps extends HTMLAttributes<HTMLElement> {
  ref?: Ref<HTMLElement>
  [attribute: `data-${string}`]: string | undefined
}

export function ContextMenuLabel({ className, ...attrs }: ContextMenuLabelProps) {
  return (
    <PrimitiveContextMenuLabel
      {...attrs}
      className={cn('text-muted px-2.5 py-1.5 text-xs font-medium', className)}
    />
  )
}
