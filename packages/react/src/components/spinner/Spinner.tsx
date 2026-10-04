'use client'

import clsx from 'clsx'
import type { HTMLAttributes, Ref } from 'react'
import { cn } from '../../lib/cn'
import { useUiLocale } from '../../locale'
import { spinner, type SpinnerVariants } from './spinner.variants'

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  size?: SpinnerVariants['size']
  label?: string
  ref?: Ref<HTMLSpanElement>
}

export function Spinner({ size = 'md', label, className, style, ...attrs }: SpinnerProps) {
  const t = useUiLocale()
  return (
    <span
      {...attrs}
      role="status"
      aria-label={label ?? t.common.loading}
      className={clsx(className, cn(spinner({ size })))}
      style={{
        ...style,
        animation: 'hn-spin var(--hn-spin-duration) var(--hn-ease-linear) infinite',
      }}
    />
  )
}
