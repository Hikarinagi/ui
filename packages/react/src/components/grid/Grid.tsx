import type { ElementType, HTMLAttributes, Ref } from 'react'
import { cn } from '../../lib/cn'
import { grid, type GridVariants } from './grid.variants'
import type { AnchorAttributes } from '../../lib/primitive'

export interface GridProps extends HTMLAttributes<HTMLElement>, AnchorAttributes {
  as?: ElementType
  cols?: GridVariants['cols']
  gap?: GridVariants['gap']
  ref?: Ref<HTMLElement>
}

export function Grid({ as: Tag = 'div', cols, gap, className, ...props }: GridProps) {
  return <Tag {...props} className={cn(grid({ cols, gap }), className)} />
}
