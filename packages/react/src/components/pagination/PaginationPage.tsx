'use client'

import { useState, type ReactNode } from 'react'
import { PaginationListItem } from '../../primitives/pagination'
import { hasContent } from '../../lib/content'
import { Button } from '../button/Button'
import { TooltipTarget } from '../float-button/TooltipTarget'
import { useUiLocale } from '../../locale'
import { usePaginationContext } from './context'
import { paginationItem } from './pagination.variants'
import { usePaginationPageTooltip } from './hooks/usePaginationPageTooltip'

export interface PaginationPageSlotProps {
  page: number
  selected: boolean
}

export interface PaginationPageProps {
  page: number
  children?: (props: PaginationPageSlotProps) => ReactNode
}

export function PaginationPage({ page, children }: PaginationPageProps) {
  const { state, size, blocked } = usePaginationContext()
  const t = useUiLocale()
  const [button, setButton] = useState<HTMLElement | null>(null)
  const [label, setLabel] = useState<HTMLElement | null>(null)
  const tooltip = usePaginationPageTooltip(label, blocked)
  const selected = page === state.page
  const content = children?.({ page, selected })

  return (
    <>
      <PaginationListItem value={page} asChild>
        <Button
          ref={setButton}
          variant="ghost"
          tone="neutral"
          size={size}
          aria-label={t.pagination.pageLabel(page)}
          className={paginationItem({ size, selected })}
        >
          <span ref={setLabel} className="min-w-0 truncate">
            {hasContent(content) ? content : page}
          </span>
        </Button>
      </PaginationListItem>
      <TooltipTarget target={button} options={{ content: tooltip || '' }} />
    </>
  )
}
