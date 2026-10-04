'use client'

import type { ReactNode } from 'react'
import { usePaginationContext } from './context'
import { PaginationControl } from './PaginationControl'
import { PaginationPage, type PaginationPageSlotProps } from './PaginationPage'
import { PaginationEllipsis, type PaginationEllipsisSlotProps } from './PaginationEllipsis'
import { PaginationPopup } from './PaginationPopup'
import { usePaginationEllipsis } from './hooks/usePaginationEllipsis'
import type { PaginationEntry } from './types'

export interface PaginationPagesProps {
  items: PaginationEntry[]
  host?: HTMLElement | null
  renderPage?: (props: PaginationPageSlotProps) => ReactNode
  renderEllipsis?: (props: PaginationEllipsisSlotProps) => ReactNode
}

export function PaginationPages({ items, host, renderPage, renderEllipsis }: PaginationPagesProps) {
  const { size, direction, showFirstLast } = usePaginationContext()
  const ellipsis = usePaginationEllipsis(host ?? null, items)

  return (
    <>
      {showFirstLast && (
        <li>
          <PaginationControl action="first" size={size} dir={direction} />
        </li>
      )}
      <li>
        <PaginationControl action="prev" size={size} dir={direction} />
      </li>
      {items.map((item, index) => {
        const side = index === 1 ? 'prev' : 'next'
        const range = ellipsis.ranges.find(range => range.side === side)
        return (
          <li key={item.type === 'page' ? item.value : 'ellipsis-' + side}>
            {item.type === 'page' ? (
              <PaginationPage page={item.value}>{renderPage}</PaginationPage>
            ) : range ? (
              <PaginationEllipsis range={range} controller={ellipsis}>
                {renderEllipsis}
              </PaginationEllipsis>
            ) : null}
          </li>
        )
      })}
      <li>
        <PaginationControl action="next" size={size} dir={direction} />
      </li>
      {showFirstLast && (
        <li>
          <PaginationControl action="last" size={size} dir={direction} />
        </li>
      )}
      <PaginationPopup controller={ellipsis} />
    </>
  )
}
