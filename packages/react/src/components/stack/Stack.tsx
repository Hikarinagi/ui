import type { ElementType, HTMLAttributes, Ref } from 'react'
import { cn } from '../../lib/cn'
import { stack, type StackVariants } from './stack.variants'
import type { AnchorAttributes } from '../../lib/primitive'

export interface StackProps extends HTMLAttributes<HTMLElement>, AnchorAttributes {
  as?: ElementType
  gap?: StackVariants['gap']
  align?: StackVariants['align']
  justify?: StackVariants['justify']
  ref?: Ref<HTMLElement>
}

export function Stack({ as: Tag = 'div', gap, align, justify, className, ...props }: StackProps) {
  return <Tag {...props} className={cn(stack({ gap, align, justify }), className)} />
}
