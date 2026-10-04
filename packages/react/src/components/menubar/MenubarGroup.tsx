import type { HTMLAttributes, Ref } from 'react'
import { MenubarGroup as PrimitiveMenubarGroup } from '../../primitives/menubar'
import { cn } from '../../lib/cn'

export interface MenubarGroupProps extends HTMLAttributes<HTMLElement> {
  ref?: Ref<HTMLElement>
  [attribute: `data-${string}`]: string | undefined
}

export function MenubarGroup({ className, ...attrs }: MenubarGroupProps) {
  return <PrimitiveMenubarGroup {...attrs} className={cn('flex flex-col gap-0.5', className)} />
}
