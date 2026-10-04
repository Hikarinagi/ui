'use client'

import type { HTMLAttributes, Ref } from 'react'
import { cn } from '../../lib/cn'
import { useUiLocale } from '../../locale'

export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
  label?: string
  ref?: Ref<HTMLElement>
  [attribute: `data-${string}`]: string | undefined
}

export function Breadcrumb({ label, className, children, ...attrs }: BreadcrumbProps) {
  const t = useUiLocale()
  return (
    <nav aria-label={label ?? t.breadcrumb.navLabel} {...attrs} className={cn(className)}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">{children}</ol>
    </nav>
  )
}
