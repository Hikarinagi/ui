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
import { composeEventHandlers } from 'radix-ui/internal'
import { Primitive, type PrimitiveProps } from '../../lib/primitive'
import { getRange, transform, type PaginationItems } from './utils'

export type { PaginationItems } from './utils'

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
  const pageCount = Math.max(1, Math.ceil(total / (itemsPerPage || 1)))
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

interface ControlOptions {
  label: string
  fallback: string
  consumer: string
  disabled: (context: PaginationRootContextValue) => boolean
  target: (context: PaginationRootContextValue) => number
}

export interface PaginationControlProps extends ElementProps {
  children?: ReactNode
}

function control({ label, fallback, consumer, disabled: isDisabled, target }: ControlOptions) {
  return function PaginationControl({
    as = 'button',
    asChild,
    onClick,
    children,
    ...attrs
  }: PaginationControlProps) {
    const rootContext = usePaginationRootContext(consumer)
    const disabled = isDisabled(rootContext)
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
            if (!disabled) rootContext.onPageChange(target(rootContext))
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

export const PaginationFirst = control({
  label: 'First Page',
  fallback: 'First page',
  consumer: 'PaginationFirst',
  disabled: context => context.page === 1 || context.disabled,
  target: () => 1,
})

export const PaginationPrev = control({
  label: 'Previous Page',
  fallback: 'Prev page',
  consumer: 'PaginationPrev',
  disabled: context => context.page === 1 || context.disabled,
  target: context => context.page - 1,
})

export const PaginationNext = control({
  label: 'Next Page',
  fallback: 'Next page',
  consumer: 'PaginationNext',
  disabled: context => context.page === context.pageCount || context.disabled,
  target: context => context.page + 1,
})

export const PaginationLast = control({
  label: 'Last Page',
  fallback: 'Last page',
  consumer: 'PaginationLast',
  disabled: context => context.page === context.pageCount || context.disabled,
  target: context => context.pageCount,
})

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
