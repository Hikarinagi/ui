import type { HTMLAttributes, ReactNode, Ref } from 'react'
import { NavigationMenuItem as PrimitiveItem } from '../../primitives/navigation-menu'

export interface NavigationMenuItemProps extends HTMLAttributes<HTMLLIElement> {
  value?: string
  children?: ReactNode
  ref?: Ref<HTMLLIElement>
  [attribute: `data-${string}`]: string | undefined
}

export function NavigationMenuItem({ value, ref, ...attrs }: NavigationMenuItemProps) {
  return <PrimitiveItem value={value} ref={ref as Ref<HTMLElement>} {...attrs} />
}
