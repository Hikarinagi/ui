'use client'

import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { hasContent } from '../../lib/content'
import { useUiLocale } from '../../locale'
import { usePaginationContext } from './context'
import type { PaginationState } from './types'

export interface PaginationInfoProps extends Omit<
  HTMLAttributes<HTMLParagraphElement>,
  'children'
> {
  children?: ReactNode | ((state: PaginationState) => ReactNode)
  [attribute: `data-${string}`]: string | undefined
}

export function PaginationInfo({ className, children, ...attrs }: PaginationInfoProps) {
  const { state } = usePaginationContext()
  const t = useUiLocale()
  const content = typeof children === 'function' ? children(state) : children
  return (
    <p
      data-hn-pagination-info=""
      className={cn('text-muted max-w-full text-sm tabular-nums', className)}
      {...attrs}
    >
      {hasContent(content)
        ? content
        : `${t.pagination.rangeLabel(state.from, state.to, state.total)} · ${t.pagination.pageCountLabel(state.page, state.pageCount)}`}
    </p>
  )
}
