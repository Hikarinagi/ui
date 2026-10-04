import type { TimeHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import { Primitive, type PrimitiveElementProps } from '../../lib/primitive'
import { text, type TextVariants } from './text.variants'

export interface TextProps
  extends PrimitiveElementProps, Pick<TimeHTMLAttributes<HTMLElement>, 'dateTime'> {
  size?: TextVariants['size']
  tone?: TextVariants['tone']
  weight?: TextVariants['weight']
  truncate?: boolean
}

export function Text({ as = 'p', size, tone, weight, truncate, className, ...props }: TextProps) {
  return (
    <Primitive
      as={as}
      {...props}
      className={cn(text({ size, tone, weight, truncate }), className)}
    />
  )
}
