'use client'

import { motion, type HTMLMotionProps } from 'motion/react'
import type { Ref } from 'react'
import { cn } from '../../lib/cn'
import { useHighlightMotion } from './hooks/useHighlightMotion'

export interface HighlightProps extends Omit<HTMLMotionProps<'div'>, 'id' | 'ref'> {
  id?: string
  axis?: 'x' | 'y' | 'both'
  as?: 'div' | 'li'
  ref?: Ref<HTMLElement>
}

export function Highlight({
  id,
  axis = 'both',
  as = 'div',
  className,
  ref,
  ...attrs
}: HighlightProps) {
  const { transition, transformTemplate } = useHighlightMotion(axis)
  const Component = (as === 'li' ? motion.li : motion.div) as typeof motion.div

  return (
    <Component
      ref={ref as Ref<HTMLDivElement>}
      layout
      layoutId={id}
      aria-hidden="true"
      data-hn-highlight=""
      transition={transition}
      transformTemplate={transformTemplate}
      {...attrs}
      className={cn('pointer-events-none', className)}
    />
  )
}
