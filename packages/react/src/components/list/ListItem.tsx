import type { LiHTMLAttributes, Ref } from 'react'
import { cn } from '../../lib/cn'

export interface ListItemProps extends LiHTMLAttributes<HTMLLIElement> {
  ref?: Ref<HTMLLIElement>
}

export function ListItem({ className, ...attrs }: ListItemProps) {
  return <li {...attrs} className={cn(className)} />
}
