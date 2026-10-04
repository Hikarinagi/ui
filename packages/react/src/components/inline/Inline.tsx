import type { ElementType, HTMLAttributes, Ref } from 'react'
import { cn } from '../../lib/cn'
import { inline, type InlineVariants } from './inline.variants'
import type { AnchorAttributes } from '../../lib/primitive'

export interface InlineProps extends HTMLAttributes<HTMLElement>, AnchorAttributes {
  as?: ElementType
  gap?: InlineVariants['gap']
  align?: InlineVariants['align']
  justify?: InlineVariants['justify']
  wrap?: boolean
  ref?: Ref<HTMLElement>
}

export function Inline({
  as: Tag = 'div',
  gap,
  align,
  justify,
  wrap = true,
  className,
  ...props
}: InlineProps) {
  return <Tag {...props} className={cn(inline({ gap, align, justify, wrap }), className)} />
}
