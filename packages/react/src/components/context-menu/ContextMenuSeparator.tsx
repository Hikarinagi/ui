import type { HTMLAttributes, Ref } from 'react'
import { ContextMenuSeparator as PrimitiveContextMenuSeparator } from '../../primitives/context-menu'
import { cn } from '../../lib/cn'

export interface ContextMenuSeparatorProps extends HTMLAttributes<HTMLElement> {
  ref?: Ref<HTMLElement>
  [attribute: `data-${string}`]: string | undefined
}

export function ContextMenuSeparator({ className, ...attrs }: ContextMenuSeparatorProps) {
  return (
    <PrimitiveContextMenuSeparator
      {...attrs}
      className={cn('bg-line -mx-1 my-1 h-px', className)}
    />
  )
}
