import type { HTMLAttributes, Ref } from 'react'
import { cn } from '../../lib/cn'

export interface TableHeaderProps extends HTMLAttributes<HTMLTableSectionElement> {
  ref?: Ref<HTMLTableSectionElement>
}

export function TableHeader({ className, ...props }: TableHeaderProps) {
  return <thead {...props} className={cn(className)} />
}
