import type { HTMLAttributes, Ref } from 'react'
import { cn } from '../../lib/cn'
import { heading, type HeadingVariants } from './heading.variants'

const sizeByLevel = {
  1: '2xl',
  2: 'xl',
  3: 'lg',
  4: 'md',
  5: 'base',
  6: 'sm',
} as const

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6
  size?: HeadingVariants['size']
  weight?: HeadingVariants['weight']
  truncate?: boolean
  ref?: Ref<HTMLHeadingElement>
}

export function Heading({ level = 2, size, weight, truncate, className, ...props }: HeadingProps) {
  const Tag = `h${level}` as const
  return (
    <Tag
      {...props}
      className={cn(heading({ size: size ?? sizeByLevel[level], weight, truncate }), className)}
    />
  )
}
