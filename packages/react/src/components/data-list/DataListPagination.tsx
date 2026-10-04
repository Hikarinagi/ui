'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { lucide } from '../../lib/icon'
import { useUiLocale } from '../../locale'
import { Button } from '../button/Button'
import { Pagination } from '../pagination/Pagination'
import { Text } from '../text/Text'
import { dataListPagination } from './data-list.variants'
import type { DataListState } from './types'

const PrevIcon = lucide(ChevronLeft)
const NextIcon = lucide(ChevronRight)

export interface DataListPaginationProps {
  state: DataListState<unknown>
}

export function DataListPagination({ state }: DataListPaginationProps) {
  const t = useUiLocale()
  if (state.total !== undefined)
    return (
      <Pagination
        value={state.page}
        pageSize={state.pageSize}
        total={state.total}
        pending={state.loading}
        align="end"
        onValueChange={state.setPage}
      />
    )
  return (
    <nav aria-label={t.pagination.navLabel} className={dataListPagination()}>
      <Button
        iconOnly
        size="md"
        variant="ghost"
        tone="neutral"
        disabled={state.loading || !state.hasPreviousPage}
        aria-label={t.pagination.prev}
        onClick={() => state.setPage(state.page - 1)}
      >
        <PrevIcon className="rtl:rotate-180" />
      </Button>
      <Text size="sm" aria-current="page" aria-label={t.pagination.pageLabel(state.page)}>
        {state.page}
      </Text>
      <Button
        iconOnly
        size="md"
        variant="ghost"
        tone="neutral"
        disabled={state.loading || !state.hasNextPage}
        aria-label={t.pagination.next}
        onClick={() => state.setPage(state.page + 1)}
      >
        <NextIcon className="rtl:rotate-180" />
      </Button>
    </nav>
  )
}
