import type { HTMLAttributes, Ref } from 'react'
import { cn } from '../../lib/cn'

export interface DescriptionTermProps extends HTMLAttributes<HTMLElement> {
  ref?: Ref<HTMLElement>
}

export function DescriptionTerm({ className, ...attrs }: DescriptionTermProps) {
  return <dt {...attrs} className={cn(className)} />
}
