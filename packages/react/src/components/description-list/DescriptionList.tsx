import type { HTMLAttributes, Ref } from 'react'
import { cn } from '../../lib/cn'

export interface DescriptionListProps extends HTMLAttributes<HTMLDListElement> {
  orientation?: 'vertical' | 'horizontal'
  ref?: Ref<HTMLDListElement>
}

export function DescriptionList({ orientation, className, ...attrs }: DescriptionListProps) {
  return (
    <dl
      data-orientation={orientation === 'horizontal' ? 'horizontal' : undefined}
      {...attrs}
      className={cn('hn-dl', className)}
    />
  )
}
