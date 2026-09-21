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
export interface DataListProps<T> {
  items: readonly T[]
  itemKey: DataListKeyField<T> | ((item: T, index: number) => DataListKey)
  itemTitle?: DataListTextField<T>
  itemDescription?: DataListTextField<T>
  mediaRatio?: number
  layout?: DataListLayout
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
  class?: string
  bodyClass?: string
  contentClass?: string
  itemClass?: string | ((item: T, index: number) => string | undefined)
}
export interface DataListExpose {
  viewport: HTMLElement | undefined
  scrollToIndex: (index: number, options?: VirtualListScrollOptions) => void
}
export type DataListRange = VirtualListRange
