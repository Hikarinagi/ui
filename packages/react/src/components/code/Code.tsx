import type { HTMLAttributes, Ref } from 'react'
import { cn } from '../../lib/cn'

export interface CodeProps extends HTMLAttributes<HTMLElement> {
  ref?: Ref<HTMLElement>
}

export function Code({ className, ...attrs }: CodeProps) {
  return <code {...attrs} className={cn('hn-code', className)} />
}
