import type { HTMLAttributes, Ref } from 'react'
import { cn } from '../../lib/cn'

export interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {
  ref?: Ref<HTMLTableSectionElement>
}

export function TableBody({ className, ...props }: TableBodyProps) {
  return <tbody {...props} className={cn(className)} />
}
