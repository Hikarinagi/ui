import type { HTMLAttributes, Ref } from 'react'
import { MenubarSeparator as PrimitiveMenubarSeparator } from '../../primitives/menubar'
import { cn } from '../../lib/cn'

export interface MenubarSeparatorProps extends HTMLAttributes<HTMLElement> {
  ref?: Ref<HTMLElement>
  [attribute: `data-${string}`]: string | undefined
}

export function MenubarSeparator({ className, ...attrs }: MenubarSeparatorProps) {
  return (
    <PrimitiveMenubarSeparator {...attrs} className={cn('bg-line -mx-1 my-1 h-px', className)} />
  )
}
