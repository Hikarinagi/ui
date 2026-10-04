'use client'

import type { ReactNode } from 'react'
import clsx from 'clsx'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { hasContent } from '../../lib/content'
import { lucide } from '../../lib/icon'
import { useUiLocale } from '../../locale'
import { Button } from '../button/Button'
import { usePaginationContext } from './context'
import { paginationArrow } from './pagination.variants'
import type { PaginationRange, PaginationSide } from './types'
import type { PaginationEllipsisController } from './hooks/usePaginationEllipsis'

const MoreIcon = lucide(MoreHorizontal)
const PrevIcon = lucide(ChevronLeft)
const NextIcon = lucide(ChevronRight)

export interface PaginationEllipsisSlotProps {
  side: PaginationSide
  expanded: boolean
}

export interface PaginationEllipsisProps {
  range: PaginationRange
  controller: PaginationEllipsisController
  children?: (props: PaginationEllipsisSlotProps) => ReactNode
}

export function PaginationEllipsis({ range, controller, children }: PaginationEllipsisProps) {
  const { size, blocked, direction, siblingCount } = usePaginationContext()
  const t = useUiLocale()
  const side = range.side
  const expanded = controller.open && controller.active === side
  const step = siblingCount * 2 + 1
  const Chevron = side === 'prev' ? PrevIcon : NextIcon
  const content = children?.({ side, expanded })

  return (
    <Button
      ref={controller.register(side)}
      variant="ghost"
      tone="neutral"
      iconOnly
      size={size}
      disabled={blocked}
      data-hn-pagination-ellipsis=""
      data-type="ellipsis"
      data-side={side}
      aria-haspopup="dialog"
      aria-expanded={expanded}
      aria-controls={expanded ? controller.id : undefined}
      aria-label={
        side === 'prev' ? t.pagination.previousPagesLabel(step) : t.pagination.nextPagesLabel(step)
      }
      aria-description={t.pagination.choosePageHint}
      aria-keyshortcuts="ArrowDown ArrowUp"
      onPointerDown={event => controller.pointerdown(event)}
      onFocus={() => controller.focus(side)}
      onKeyDown={event => controller.keydown(side, event)}
      onClick={() => controller.click(side)}
    >
      {hasContent(content) ? (
        content
      ) : (
        <span className="grid" aria-hidden="true">
          <MoreIcon
            className={clsx(
              'hn-transition-base [grid-area:1/1]',
              expanded ? 'scale-90 opacity-0' : 'scale-100 opacity-100',
            )}
          />
          <Chevron
            className={clsx(
              paginationArrow({ dir: direction }),
              expanded ? 'scale-100 opacity-100' : 'scale-90 opacity-0',
              'hn-transition-base [grid-area:1/1]',
            )}
          />
        </span>
      )}
    </Button>
  )
}
