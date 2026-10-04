import type { HTMLAttributes, Ref } from 'react'
import { cn } from '../../lib/cn'

export interface PageBodyProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>
}

export function PageBody({ className, ...attrs }: PageBodyProps) {
  return <div {...attrs} className={cn('flex min-w-0 flex-col gap-6', className)} />
}
