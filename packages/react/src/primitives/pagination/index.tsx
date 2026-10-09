'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
  type Ref,
} from 'react'
import { Primitive, type PrimitiveProps } from '../../lib/primitive'
import {
  getRange,
  PAGINATION_EDGES,
  paginationEdgeDisabled,
  paginationEdgeTarget,
  paginationPageCount,
  transform,
  type PaginationEdge,
  type PaginationItems,
} from '../../../../shared/src/primitives/pagination'
import { composeEventHandlers } from '../utils/compose-event-handlers'

export type { PaginationItems } from '../../../../shared/src/primitives/pagination'

interface PaginationRootContextValue {
  page: number
  onPageChange: (value: number) => void
  pageCount: number
  siblingCount: number
  disabled: boolean
  showEdges: boolean
}

const PaginationRootContext = createContext<PaginationRootContextValue | null>(null)

function usePaginationRootContext(consumer: string) {
  const context = useContext(PaginationRootContext)
  if (!context)
    throw new Error(
      `Injection \`Symbol(PaginationRootContext)\` not found. Component must be used within \`PaginationRoot\`, \`${consumer}\``,
    )
  return context
}

type ElementProps = PrimitiveProps &
  Omit<HTMLAttributes<HTMLElement>, 'children'> & {
    ref?: Ref<HTMLElement>
    [attribute: `data-${string}`]: string | undefined
  }

export interface PaginationRootProps extends ElementProps {
  page?: number
  defaultPage?: number
  onPageChange?: (value: number) => void
  itemsPerPage: number
  total?: number
  siblingCount?: number
  disabled?: boolean
  showEdges?: boolean
  children?: ReactNode | ((props: { page: number; pageCount: number }) => ReactNode)
}

export function PaginationRoot({
  as = 'nav',
  asChild,
  page: pageProp,
  defaultPage = 1,
  onPageChange,
  itemsPerPage,
  total = 0,
  siblingCount = 2,
  disabled = false,
  showEdges = false,
  children,
  ...attrs
}: PaginationRootProps) {
  const [passive] = useState(pageProp === undefined)
  const [local, setLocal] = useState(defaultPage)
  const page = passive ? local : (pageProp as number)
  const pageCount = paginationPageCount(total, itemsPerPage)
  const change = useCallback(
    (value: number) => {
      if (passive) setLocal(value)
      onPageChange?.(value)
    },
    [passive, onPageChange],
  )
  const context = useMemo<PaginationRootContextValue>(
    () => ({ page, onPageChange: change, pageCount, siblingCount, disabled, showEdges }),
    [page, change, pageCount, siblingCount, disabled, showEdges],
  )
  return (
    <PaginationRootContext value={context}>
      <Primitive as={as} asChild={asChild} {...attrs}>
        {typeof children === 'function' ? children({ page, pageCount }) : children}
      </Primitive>
    </PaginationRootContext>
  )
}

export interface PaginationListProps extends ElementProps {
  children?: ReactNode | ((props: { items: PaginationItems }) => ReactNode)
}

export function PaginationList({ as, asChild, children, ...attrs }: PaginationListProps) {
  const { page, pageCount, siblingCount, showEdges } = usePaginationRootContext('PaginationList')
  const items = useMemo(
    () => transform(getRange(page, pageCount, siblingCount, showEdges)),
    [page, pageCount, siblingCount, showEdges],
  )
  return (
    <Primitive as={as} asChild={asChild} {...attrs}>
      {typeof children === 'function' ? children({ items }) : children}
    </Primitive>
  )
}

export interface PaginationListItemProps extends ElementProps {
  value: number
  children?: ReactNode
}

export function PaginationListItem({
  as = 'button',
  asChild,
  value,
  onClick,
  children,
  ...attrs
}: PaginationListItemProps) {
  const rootContext = usePaginationRootContext('PaginationListItem')
  const isSelected = rootContext.page === value
  const disabled = rootContext.disabled
  return (
    <Primitive
      as={as}
      asChild={asChild}
      {...{ value }}
      data-type="page"
      aria-label={`Page ${value}`}
      aria-current={isSelected ? 'page' : undefined}
      data-selected={isSelected ? 'true' : undefined}
      {...{ disabled }}
      {...{ type: as === 'button' ? 'button' : undefined }}
      {...attrs}
      onClick={composeEventHandlers(
        (event: MouseEvent<HTMLElement>) => {
          if (!disabled) rootContext.onPageChange(value)
          return event
        },
        onClick,
        { checkForDefaultPrevented: false },
      )}
    >
      {children ?? value}
    </Primitive>
  )
}

export interface PaginationControlProps extends ElementProps {
  children?: ReactNode
}

function control(edge: PaginationEdge, consumer: string) {
  const { label, fallback } = PAGINATION_EDGES[edge]
  return function PaginationControl({
    as = 'button',
    asChild,
    onClick,
    children,
    ...attrs
  }: PaginationControlProps) {
    const rootContext = usePaginationRootContext(consumer)
    const disabled = paginationEdgeDisabled(
      edge,
      rootContext.page,
      rootContext.pageCount,
      rootContext.disabled,
    )
    return (
      <Primitive
        as={as}
        asChild={asChild}
        aria-label={label}
        {...{ type: as === 'button' ? 'button' : undefined }}
        {...{ disabled }}
        {...attrs}
        onClick={composeEventHandlers(
          (event: MouseEvent<HTMLElement>) => {
            if (!disabled)
              rootContext.onPageChange(
                paginationEdgeTarget(edge, rootContext.page, rootContext.pageCount),
              )
            return event
          },
          onClick,
          { checkForDefaultPrevented: false },
        )}
      >
        {children ?? fallback}
      </Primitive>
    )
  }
}

export const PaginationFirst = control('first', 'PaginationFirst')
export const PaginationPrev = control('prev', 'PaginationPrev')
export const PaginationNext = control('next', 'PaginationNext')
export const PaginationLast = control('last', 'PaginationLast')

export interface PaginationEllipsisProps extends ElementProps {
  children?: ReactNode
}

export function PaginationEllipsis({ as, asChild, children, ...attrs }: PaginationEllipsisProps) {
  return (
    <Primitive as={as} asChild={asChild} data-type="ellipsis" {...attrs}>
      {children ?? '…'}
    </Primitive>
  )
}
