'use client'

import { ArrowLeft, ArrowRight } from 'lucide-react'
import type { AnchorHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import { lucide } from '../../lib/icon'
import { Primitive, type PrimitiveElementProps } from '../../lib/primitive'
import { useUiLocale } from '../../locale'
import { Ripple } from '../ripple/Ripple'
import { prevNextLink, prevNextEyebrow, type PrevNextVariants } from './prev-next.variants'

const ArrowLeftIcon = lucide(ArrowLeft)
const ArrowRightIcon = lucide(ArrowRight)

export interface PrevNextLinkProps
  extends
    PrimitiveElementProps,
    Omit<AnchorHTMLAttributes<HTMLElement>, keyof PrimitiveElementProps> {
  direction: NonNullable<PrevNextVariants['direction']>
  label?: string
}

export function PrevNextLink({
  as = 'a',
  asChild,
  direction,
  label,
  className,
  children,
  ...attrs
}: PrevNextLinkProps) {
  const t = useUiLocale()
  const own = { rel: direction, 'data-direction': direction }
  return (
    <Primitive
      {...attrs}
      {...own}
      as={as}
      asChild={asChild}
      className={cn(prevNextLink({ direction }), className)}
    >
      <Ripple />
      <span className={prevNextEyebrow({ direction })}>
        {direction === 'prev' ? (
          <ArrowLeftIcon className="size-4" aria-hidden="true" />
        ) : (
          <ArrowRightIcon className="size-4" aria-hidden="true" />
        )}
        {label ?? (direction === 'prev' ? t.pagination.prev : t.pagination.next)}
      </span>
      <span className="text-fg max-w-full font-medium">{children}</span>
    </Primitive>
  )
}
