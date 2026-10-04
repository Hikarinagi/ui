import type { HTMLAttributes, Ref } from 'react'
import { cn } from '../../lib/cn'

export interface DescriptionListProps extends HTMLAttributes<HTMLDListElement> {
  ref?: Ref<HTMLDListElement>
}

export function DescriptionList({ className, ...attrs }: DescriptionListProps) {
  return <dl {...attrs} className={cn('hn-dl', className)} />
}
