'use client'

import type { HTMLAttributes, Ref } from 'react'
import { cn } from '../../lib/cn'
import { useUiLocale } from '../../locale'

export interface PrevNextProps extends HTMLAttributes<HTMLElement> {
  label?: string
  ref?: Ref<HTMLElement>
  [attribute: `data-${string}`]: string | undefined
}

export function PrevNext({ label, className, ...attrs }: PrevNextProps) {
  const t = useUiLocale()
  return (
    <nav
      aria-label={label ?? t.pagination.navLabel}
      {...attrs}
      className={cn('grid grid-cols-1 gap-4 sm:grid-cols-2', className)}
    />
  )
}
