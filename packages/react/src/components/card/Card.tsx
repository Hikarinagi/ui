import { cn } from '../../lib/cn'
import { Primitive, type PrimitiveElementProps } from '../../lib/primitive'
import { card } from './card.variants'

export interface CardProps extends PrimitiveElementProps {
  padded?: boolean
}

export function Card({ as = 'div', padded = true, className, ...props }: CardProps) {
  return <Primitive as={as} {...props} className={cn(card({ padded }), className)} />
}
