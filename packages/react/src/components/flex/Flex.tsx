import type { ElementType, HTMLAttributes, Ref } from 'react'
import { cn } from '../../lib/cn'
import { flex, type FlexVariants } from './flex.variants'
import type { AnchorAttributes } from '../../lib/primitive'

export interface FlexProps extends HTMLAttributes<HTMLElement>, AnchorAttributes {
  as?: ElementType
  direction?: FlexVariants['direction']
  gap?: FlexVariants['gap']
  align?: FlexVariants['align']
  justify?: FlexVariants['justify']
  wrap?: boolean
  ref?: Ref<HTMLElement>
}

export function Flex({
  as: Tag = 'div',
  direction,
  gap,
  align,
  justify,
  wrap,
  className,
  ...props
}: FlexProps) {
  return (
    <Tag {...props} className={cn(flex({ direction, gap, align, justify, wrap }), className)} />
  )
}
