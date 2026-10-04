'use client'

import { useState, type HTMLAttributes, type ReactNode } from 'react'
import { PaginationList } from '../../primitives/pagination'
import { cn } from '../../lib/cn'
import { PaginationPages } from './PaginationPages'
import { paginationList } from './pagination.variants'
import type { PaginationPageSlotProps } from './PaginationPage'
import type { PaginationEllipsisSlotProps } from './PaginationEllipsis'

export interface PaginationContentProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  renderPage?: (props: PaginationPageSlotProps) => ReactNode
  renderEllipsis?: (props: PaginationEllipsisSlotProps) => ReactNode
  [attribute: `data-${string}`]: string | undefined
}

export function PaginationContent({
  className,
  renderPage,
  renderEllipsis,
  ...attrs
}: PaginationContentProps) {
  const [host, setHost] = useState<HTMLElement | null>(null)
  return (
    <PaginationList asChild {...attrs}>
      {({ items }) => (
        <ul ref={setHost} data-hn-pagination-content="" className={cn(paginationList(), className)}>
          <PaginationPages
            items={items}
            host={host}
            renderPage={renderPage}
            renderEllipsis={renderEllipsis}
          />
        </ul>
      )}
    </PaginationList>
  )
}
