import type { HTMLAttributes, Ref } from 'react'
import { cn } from '../../lib/cn'
import { buttonGroup, type ButtonGroupVariants } from './button-group.variants'

export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  label?: string
  orientation?: ButtonGroupVariants['orientation']
  block?: boolean
  divider?: boolean
  ref?: Ref<HTMLDivElement>
  [attribute: `data-${string}`]: string | undefined
}

export function ButtonGroup({
  label,
  orientation = 'horizontal',
  block = false,
  divider = false,
  className,
  ...attrs
}: ButtonGroupProps) {
  return (
    <div
      role="group"
      aria-label={label}
      aria-orientation={orientation === 'vertical' ? 'vertical' : undefined}
      {...attrs}
      className={cn(buttonGroup({ orientation, block, divider }), className)}
    />
  )
}
