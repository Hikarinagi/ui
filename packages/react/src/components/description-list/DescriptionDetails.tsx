import type { HTMLAttributes, Ref } from 'react'
import { cn } from '../../lib/cn'

export interface DescriptionDetailsProps extends HTMLAttributes<HTMLElement> {
  ref?: Ref<HTMLElement>
}

export function DescriptionDetails({ className, ...attrs }: DescriptionDetailsProps) {
  return <dd {...attrs} className={cn(className)} />
}
