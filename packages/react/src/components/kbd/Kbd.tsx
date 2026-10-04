import type { HTMLAttributes, Ref } from 'react'
import { cn } from '../../lib/cn'

export interface KbdProps extends HTMLAttributes<HTMLElement> {
  ref?: Ref<HTMLElement>
}

export function Kbd({ className, ...attrs }: KbdProps) {
  return <kbd {...attrs} className={cn('hn-kbd', className)} />
}
