'use client'

import type { LabelHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import { useUiLocale } from '../../locale'
import { Input } from '../input/Input'
import { usePaginationJump } from './hooks/usePaginationJump'

export interface PaginationJumpProps extends LabelHTMLAttributes<HTMLLabelElement> {
  [attribute: `data-${string}`]: string | undefined
}

export function PaginationJump({ className, ...attrs }: PaginationJumpProps) {
  const t = useUiLocale()
  const { draft, setDraft, commit, reset, size, blocked } = usePaginationJump()
  return (
    <label
      data-hn-pagination-jump=""
      className={cn(
        'text-muted flex shrink-0 items-center gap-2 text-sm whitespace-nowrap',
        className,
      )}
      {...attrs}
    >
      {t.pagination.jumpLabel}
      <Input
        value={draft}
        onValueChange={setDraft}
        size={size}
        disabled={blocked}
        inputMode="numeric"
        aria-label={t.pagination.jumpLabel}
        className="w-16"
        onBlur={commit}
        onKeyDown={event => {
          if (event.key === 'Enter') {
            event.preventDefault()
            event.stopPropagation()
            commit()
          } else if (event.key === 'Escape' || event.key === 'Esc') {
            event.preventDefault()
            event.stopPropagation()
            reset()
          }
        }}
      />
    </label>
  )
}
