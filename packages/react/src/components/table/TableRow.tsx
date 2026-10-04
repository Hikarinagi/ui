import type { HTMLAttributes, Ref } from 'react'
import { cn } from '../../lib/cn'

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  ref?: Ref<HTMLTableRowElement>
}

export function TableRow({ className, ...props }: TableRowProps) {
  return <tr {...props} className={cn(className)} />
}
