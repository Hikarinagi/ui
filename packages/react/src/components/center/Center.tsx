import type { ElementType, HTMLAttributes, Ref } from 'react'
import { cn } from '../../lib/cn'
import type { AnchorAttributes } from '../../lib/primitive'

export interface CenterProps extends HTMLAttributes<HTMLElement>, AnchorAttributes {
  as?: ElementType
  inline?: boolean
  ref?: Ref<HTMLElement>
}

export function Center({ as: Tag = 'div', inline = false, className, ...props }: CenterProps) {
  return (
    <Tag
      {...props}
      className={cn(inline ? 'inline-flex' : 'flex', 'items-center justify-center', className)}
    />
  )
}
