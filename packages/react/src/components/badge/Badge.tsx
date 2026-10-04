import type { HTMLAttributes, ReactNode, Ref } from 'react'
import { cn } from '../../lib/cn'
import { hasContent } from '../../lib/content'
import { Transition } from '../../lib/transition/Transition'
import { VisuallyHidden } from '../visually-hidden/VisuallyHidden'
import { badge, type BadgeVariants } from './badge.variants'

export interface BadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'content'> {
  content?: ReactNode
  max?: number
  tone?: BadgeVariants['tone']
  size?: BadgeVariants['size']
  placement?: BadgeVariants['placement']
  shape?: BadgeVariants['shape']
  outline?: boolean
  bare?: boolean
  label?: string
  ref?: Ref<HTMLSpanElement>
  [attribute: `data-${string}`]: string | undefined
}

export function Badge({
  content,
  max = 99,
  tone,
  size,
  placement,
  shape,
  outline = true,
  bare = false,
  label,
  className,
  children,
  ...attrs
}: BadgeProps) {
  const visible = hasContent(content) && content !== '' && content !== 0
  const text = typeof content === 'number' && content > max ? `${max}+` : content

  return (
    <span {...attrs} className={cn('relative inline-flex shrink-0 align-middle', className)}>
      {children}
      <Transition
        show={visible}
        enterActiveClass="hn-transition-base"
        enterFromClass="scale-50 opacity-0"
        leaveActiveClass="hn-transition"
        leaveToClass="scale-50 opacity-0"
      >
        <span className={badge({ tone, size, placement, shape, outline, bare })}>
          {text}
          {label ? <VisuallyHidden>{label}</VisuallyHidden> : null}
        </span>
      </Transition>
    </span>
  )
}
