import type { HTMLAttributes, ReactNode, Ref } from 'react'
import type { VirtualListRange, VirtualListScrollOptions } from '../virtual-list/types'
import type { DataListContentVariants, DataListItemVariants } from './data-list.variants'

export type DataListKey = string | number
export type DataListLayout = 'list' | 'grid'
export type DataListKeyField<T> = {
  [K in keyof T]-?: T[K] extends DataListKey ? K : never
}[keyof T] &
  string
export type DataListTextField<T> =
  | ({
      [K in keyof T]-?: T[K] extends string | number | null | undefined ? K : never
    }[keyof T] &
      string)
  | ((item: T, index: number) => string | number | null | undefined)
export interface DataListPageChange {
  page: number
  pageSize: number
}
export interface DataListItemSlot<T> {
  item: T
  index: number
  key: DataListKey
  layout: DataListLayout
}
export interface DataListPlaceholderSlot {
  index: number
  layout: DataListLayout
}
export interface DataListState<T> extends DataListPageChange {
  items: readonly T[]
  total: number | undefined
  pageCount: number | undefined
  layout: DataListLayout
  loading: boolean
  refreshing: boolean
  hasPreviousPage: boolean
  hasNextPage: boolean
  setPage: (page: number) => void
  setPageSize: (pageSize: number) => void
  setLayout: (layout: DataListLayout) => void
}
export interface DataListVirtualOptions {
  estimateSize?: number
  overscan?: number
  initialColumns?: number
}
export interface DataListExpose {
  viewport: HTMLElement | undefined
  scrollToIndex: (index: number, options?: VirtualListScrollOptions) => void
}
export type DataListRange = VirtualListRange
export interface DataListOptions<T> {
  items: readonly T[]
  itemKey: DataListKeyField<T> | ((item: T, index: number) => DataListKey)
  itemTitle?: DataListTextField<T>
  itemDescription?: DataListTextField<T>
  mediaRatio?: number
  layoutToggle?: boolean
  gridMin?: string
  gridGap?: DataListContentVariants['gap']
  size?: DataListItemVariants['size']
  divided?: boolean
  pagination?: boolean
  manual?: boolean
  total?: number
  hasNextPage?: boolean
  loading?: boolean
  placeholderCount?: number
  emptyText?: string
  label?: string
  virtualize?: boolean | DataListVirtualOptions
  height?: string | number
  minHeight?: string | number
  className?: string
  bodyClass?: string
  contentClass?: string
  itemClass?: string | ((item: T, index: number) => string | undefined)
}
export interface DataListProps<T>
  extends
    DataListOptions<T>,
    Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'className' | 'defaultValue'> {
  layout?: DataListLayout
  defaultLayout?: DataListLayout
  onLayoutChange?: (layout: DataListLayout) => void
  page?: number
  defaultPage?: number
  onPageChange?: (page: number) => void
  pageSize?: number
  defaultPageSize?: number
  onPageSizeChange?: (pageSize: number) => void
  onPaginationChange?: (value: DataListPageChange) => void
  onRangeChange?: (range: DataListRange) => void
  children?: (props: DataListItemSlot<T>) => ReactNode
  renderMedia?: (props: DataListItemSlot<T>) => ReactNode
  renderTitle?: (props: DataListItemSlot<T>) => ReactNode
  renderDescription?: (props: DataListItemSlot<T>) => ReactNode
  renderMeta?: (props: DataListItemSlot<T>) => ReactNode
  renderActions?: (props: DataListItemSlot<T>) => ReactNode
  renderPlaceholder?: (props: DataListPlaceholderSlot) => ReactNode
  renderHeader?: (props: DataListState<T>) => ReactNode
  renderFooter?: (props: DataListState<T>) => ReactNode
  renderPagination?: (props: DataListState<T>) => ReactNode
  renderEmpty?: (props: DataListState<T>) => ReactNode
  renderLoading?: (props: DataListState<T>) => ReactNode
  ref?: Ref<DataListExpose>
  [attribute: `data-${string}`]: string | undefined
}
