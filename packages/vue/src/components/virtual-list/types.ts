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

export interface VirtualListProps<T> {
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
  class?: string
  itemClass?: string | ((item: T, index: number) => string | undefined)
}

export interface VirtualListExpose {
  viewport: HTMLElement | undefined
  scrollToIndex: (index: number, options?: VirtualListScrollOptions) => void
  scrollToOffset: (offset: number, options?: Pick<VirtualListScrollOptions, 'behavior'>) => void
  measure: () => void
}
