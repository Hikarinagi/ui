import type { CSSProperties, ElementType, HTMLAttributes, Ref } from 'react'
import { cn } from '../../lib/cn'
import { simpleGrid, type SimpleGridVariants } from './simple-grid.variants'
import type { AnchorAttributes } from '../../lib/primitive'

export interface SimpleGridProps extends HTMLAttributes<HTMLElement>, AnchorAttributes {
  as?: ElementType
  min?: string
  fit?: boolean
  gap?: SimpleGridVariants['gap']
  ref?: Ref<HTMLElement>
}

export function SimpleGrid({
  as: Tag = 'div',
  min = '14rem',
  fit = false,
  gap,
  className,
  style,
  ...props
}: SimpleGridProps) {
  return (
    <Tag
      {...props}
      style={{ '--hn-simple-grid-min': min, ...style } as CSSProperties}
      className={cn(simpleGrid({ fit, gap }), className)}
    />
  )
}
