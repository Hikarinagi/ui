import { cn } from '../../lib/cn'
import { Primitive, type PrimitiveElementProps } from '../../lib/primitive'
import { tag, type TagVariants } from './tag.variants'

export interface TagProps extends PrimitiveElementProps {
  variant?: TagVariants['variant']
  tone?: TagVariants['tone']
  size?: TagVariants['size']
  pill?: boolean
}

export function Tag({
  as = 'span',
  asChild,
  variant,
  tone,
  size,
  pill = false,
  className,
  ...attrs
}: TagProps) {
  return (
    <Primitive
      as={as}
      asChild={asChild}
      {...attrs}
      className={cn(tag({ variant, tone, size, pill }), className)}
    />
  )
}
