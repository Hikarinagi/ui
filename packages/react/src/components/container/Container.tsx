import type { ElementType, HTMLAttributes, Ref } from 'react'
import { cn } from '../../lib/cn'
import { container, type ContainerVariants } from './container.variants'
import type { AnchorAttributes } from '../../lib/primitive'

export interface ContainerProps extends HTMLAttributes<HTMLElement>, AnchorAttributes {
  as?: ElementType
  size?: ContainerVariants['size']
  ref?: Ref<HTMLElement>
}

export function Container({ as: Tag = 'div', size, className, ...props }: ContainerProps) {
  return <Tag {...props} className={cn(container({ size }), className)} />
}
