'use client'

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import {
  PaginationFirst,
  PaginationLast,
  PaginationNext,
  PaginationPrev,
} from '../../primitives/pagination'
import { lucide } from '../../lib/icon'
import { useUiLocale } from '../../locale'
import { Button } from '../button/Button'
import type { ButtonVariants } from '../button/button.variants'
import { paginationArrow } from './pagination.variants'

const controls = {
  first: { Component: PaginationFirst, Icon: lucide(ChevronsLeft) },
  prev: { Component: PaginationPrev, Icon: lucide(ChevronLeft) },
  next: { Component: PaginationNext, Icon: lucide(ChevronRight) },
  last: { Component: PaginationLast, Icon: lucide(ChevronsRight) },
}

export interface PaginationControlProps {
  action: 'first' | 'prev' | 'next' | 'last'
  size?: ButtonVariants['size']
  dir: 'ltr' | 'rtl'
}

export function PaginationControl({ action, size, dir }: PaginationControlProps) {
  const t = useUiLocale()
  const { Component, Icon } = controls[action]
  return (
    <Component asChild>
      <Button
        variant="ghost"
        tone="neutral"
        size={size}
        iconOnly
        aria-label={t.pagination[action]}
        data-hn-pagination-action={action}
      >
        <Icon aria-hidden="true" className={paginationArrow({ dir })} />
      </Button>
    </Component>
  )
}
