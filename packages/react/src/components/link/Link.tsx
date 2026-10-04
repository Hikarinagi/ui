import type { AnchorHTMLAttributes, Ref } from 'react'
import { cn } from '../../lib/cn'
import { Primitive, type PrimitiveProps } from '../../lib/primitive'
import { link, type LinkVariants } from './link.variants'

export interface LinkProps extends PrimitiveProps, AnchorHTMLAttributes<HTMLElement> {
  tone?: LinkVariants['tone']
  underline?: boolean
  ref?: Ref<HTMLElement>
  [attribute: `data-${string}`]: string | undefined
}

export function Link({
  as = 'a',
  asChild,
  tone = 'accent',
  underline,
  className,
  ...attrs
}: LinkProps) {
  return (
    <Primitive
      as={as}
      asChild={asChild}
      data-underline={underline ? '' : undefined}
      {...attrs}
      className={cn(link({ tone }), className)}
    />
  )
}
