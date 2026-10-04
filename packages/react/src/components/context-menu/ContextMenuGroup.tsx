import type { HTMLAttributes, Ref } from 'react'
import { ContextMenuGroup as PrimitiveContextMenuGroup } from '../../primitives/context-menu'
import { cn } from '../../lib/cn'

export interface ContextMenuGroupProps extends HTMLAttributes<HTMLElement> {
  ref?: Ref<HTMLElement>
  [attribute: `data-${string}`]: string | undefined
}

export function ContextMenuGroup({ className, ...attrs }: ContextMenuGroupProps) {
  return <PrimitiveContextMenuGroup {...attrs} className={cn('flex flex-col gap-0.5', className)} />
}
