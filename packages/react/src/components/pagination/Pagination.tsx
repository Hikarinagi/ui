'use client'

import { useMemo, type HTMLAttributes, type ReactNode } from 'react'
import { PaginationRoot } from '../../primitives/pagination'
import { cn } from '../../lib/cn'
import { hasContent } from '../../lib/content'
import { useDirection } from '../../lib/useDirection'
import { useUiLocale } from '../../locale'
import { LoadingOverlay } from '../loading-overlay/LoadingOverlay'
import { PaginationContent } from './PaginationContent'
import { PaginationInfo } from './PaginationInfo'
import { PaginationSize } from './PaginationSize'
import { PaginationJump } from './PaginationJump'
import { PaginationContext } from './context'
import { usePagination } from './hooks/usePagination'
import { pagination } from './pagination.variants'
import type { PaginationPageSlotProps } from './PaginationPage'
import type { PaginationEllipsisSlotProps } from './PaginationEllipsis'
import type { PaginationChange, PaginationState } from './types'

export interface PaginationProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'defaultValue' | 'dir' | 'onChange'
> {
  total: number
  itemCount?: number
  siblingCount?: number
  showEdges?: boolean
  showFirstLast?: boolean
  showInfo?: boolean
  showJump?: boolean
  hideSinglePage?: boolean
  pageSizeOptions?: number[]
  pending?: boolean
  align?: 'start' | 'center' | 'end' | 'between'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  dir?: 'ltr' | 'rtl'
  label?: string
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  pageSize?: number
  defaultPageSize?: number
  onPageSizeChange?: (value: number) => void
  onChange?: (value: PaginationChange) => void
  children?: ReactNode | ((state: PaginationState) => ReactNode)
  renderList?: (state: PaginationState) => ReactNode
  renderPage?: (props: PaginationPageSlotProps) => ReactNode
  renderEllipsis?: (props: PaginationEllipsisSlotProps) => ReactNode
  [attribute: `data-${string}`]: string | undefined
}

export function Pagination({
  total,
  itemCount,
  siblingCount = 1,
  showEdges = true,
  showFirstLast,
  showInfo,
  showJump,
  hideSinglePage,
  pageSizeOptions,
  pending,
  align = 'start',
  size = 'md',
  disabled,
  dir,
  label,
  value,
  defaultValue = 1,
  onValueChange,
  pageSize: pageSizeProp,
  defaultPageSize = 10,
  onPageSizeChange,
  onChange,
  className,
  children,
  renderList,
  renderPage,
  renderEllipsis,
  ...attrs
}: PaginationProps) {
  const t = useUiLocale()
  const { root, direction, rootDirection } = useDirection<HTMLDivElement>(dir)
  const {
    total: count,
    pageSize,
    siblingCount: siblings,
    page,
    state,
    blocked,
    sizes,
    update,
    resize,
  } = usePagination(
    {
      total,
      itemCount,
      siblingCount,
      pageSizeOptions,
      disabled,
      pending,
      value,
      defaultValue,
      onValueChange,
      pageSize: pageSizeProp,
      defaultPageSize,
      onPageSizeChange,
    },
    change => onChange?.(change),
  )
  const options = useMemo(
    () => sizes.map(value => ({ value, label: t.pagination.pageSizeOption(value) })),
    [sizes, t],
  )
  const context = {
    state,
    blocked,
    siblingCount: siblings,
    update,
    resize,
    direction,
    size,
    showFirstLast: !!showFirstLast,
    options,
  }
  const content = typeof children === 'function' ? children(state) : children

  return (
    <PaginationContext value={context}>
      <div
        {...attrs}
        ref={root}
        data-hn-pagination=""
        dir={rootDirection}
        aria-busy={pending || undefined}
        className={cn('max-w-full', renderList && 'flex min-h-0 flex-col gap-3', className)}
      >
        {renderList && (
          <div className="relative min-h-0 flex-auto">
            <div inert={pending || undefined}>{renderList(state)}</div>
            <LoadingOverlay visible={pending} />
          </div>
        )}
        {(!hideSinglePage || state.pageCount > 1) && (
          <PaginationRoot
            page={page}
            total={count}
            itemsPerPage={pageSize}
            siblingCount={siblings}
            showEdges={showEdges}
            disabled={blocked}
            asChild
            onPageChange={update}
          >
            <nav
              aria-label={label ?? t.pagination.navLabel}
              inert={pending || undefined}
              data-disabled={blocked ? '' : undefined}
              className={pagination({ align })}
            >
              {hasContent(content) ? (
                content
              ) : (
                <>
                  {showInfo && <PaginationInfo />}
                  <PaginationContent renderPage={renderPage} renderEllipsis={renderEllipsis} />
                  {(!!pageSizeOptions?.length || showJump) && (
                    <div className="flex max-w-full flex-wrap items-center gap-3">
                      {!!pageSizeOptions?.length && <PaginationSize />}
                      {showJump && <PaginationJump />}
                    </div>
                  )}
                </>
              )}
            </nav>
          </PaginationRoot>
        )}
      </div>
    </PaginationContext>
  )
}
