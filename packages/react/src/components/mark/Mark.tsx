import type { HTMLAttributes, Ref } from 'react'
import { cn } from '../../lib/cn'

export interface MarkProps extends HTMLAttributes<HTMLElement> {
  ref?: Ref<HTMLElement>
}

export function Mark({ className, ...attrs }: MarkProps) {
  return <mark {...attrs} className={cn('hn-mark', className)} />
}
