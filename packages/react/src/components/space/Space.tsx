import type { HTMLAttributes, Ref } from 'react'
import { cn } from '../../lib/cn'
import { space, type SpaceVariants } from './space.variants'

export interface SpaceProps extends HTMLAttributes<HTMLDivElement> {
  size?: SpaceVariants['size']
  ref?: Ref<HTMLDivElement>
}

export function Space({ size, className, ...props }: SpaceProps) {
  return <div aria-hidden="true" {...props} className={cn(space({ size }), className)} />
}
