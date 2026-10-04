import { cn } from '../../lib/cn'
import { Primitive, type PrimitiveElementProps } from '../../lib/primitive'
import { VisuallyHidden } from '../visually-hidden/VisuallyHidden'
import { indicator, type IndicatorVariants } from './indicator.variants'

export interface IndicatorProps extends Omit<PrimitiveElementProps, 'children'> {
  tone?: IndicatorVariants['tone']
  size?: IndicatorVariants['size']
  pulse?: boolean
  label?: string
}

export function Indicator({
  as = 'span',
  asChild,
  tone,
  size,
  pulse = false,
  label,
  className,
  ...attrs
}: IndicatorProps) {
  return (
    <Primitive
      as={as}
      asChild={asChild}
      aria-hidden={label ? undefined : 'true'}
      {...attrs}
      className={cn(indicator({ tone, size }), className)}
    >
      {pulse ? (
        <span aria-hidden="true" className="hn-ping absolute inset-0 rounded-full bg-inherit" />
      ) : null}
      {label ? <VisuallyHidden>{label}</VisuallyHidden> : null}
    </Primitive>
  )
}
