import type { HTMLAttributes, ReactNode, Ref } from 'react'

export type VirtualListKey = string | number

export interface VirtualListSlotProps<T> {
  item: T
  index: number
}

export interface VirtualListRange {
  startIndex: number
  endIndex: number
}

export interface VirtualListScrollOptions {
  align?: 'start' | 'center' | 'end' | 'auto'
  behavior?: 'auto' | 'smooth'
}

export interface VirtualListProps<T> extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'dir'
> {
  items: readonly T[]
  getKey: (item: T, index: number) => VirtualListKey
  estimateSize?: number | ((item: T, index: number) => number)
  dynamic?: boolean
  height?: number | string
  orientation?: 'vertical' | 'horizontal'
  dir?: 'ltr' | 'rtl'
  overscan?: number
  gap?: number
  paddingStart?: number
  paddingEnd?: number
  initialRect?: { width: number; height: number }
  initialOffset?: number
  loading?: boolean
  emptyText?: string
  label?: string
  shadow?: boolean
  className?: string
  itemClass?: string | ((item: T, index: number) => string | undefined)
  onRangeChange?: (range: VirtualListRange) => void
  children?: (props: VirtualListSlotProps<T>) => ReactNode
  empty?: ReactNode
  loadingContent?: ReactNode
  ref?: Ref<VirtualListExpose>
  [attribute: `data-${string}`]: string | undefined
}

export interface VirtualListExpose {
  viewport: HTMLElement | undefined
  scrollToIndex: (index: number, options?: VirtualListScrollOptions) => void
  scrollToOffset: (offset: number, options?: Pick<VirtualListScrollOptions, 'behavior'>) => void
  measure: () => void
}
