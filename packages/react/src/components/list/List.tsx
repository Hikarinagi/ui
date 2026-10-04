import type { ElementType, OlHTMLAttributes, Ref } from 'react'
import { cn } from '../../lib/cn'

export interface ListProps extends OlHTMLAttributes<HTMLElement> {
  ordered?: boolean
  ref?: Ref<HTMLElement>
}

export function List({ ordered, className, ...attrs }: ListProps) {
  const Tag = (ordered ? 'ol' : 'ul') as ElementType
  return <Tag {...attrs} className={cn('hn-list', className)} />
}
