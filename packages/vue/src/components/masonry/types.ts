import type { MasonryGap } from './masonry.variants'

export type MasonryKey = string | number
export interface MasonryLayout {
  columns: number
  height: number
}
export interface MasonrySlotProps<T> {
  item: T
  index: number
}
export interface MasonryProps<T> {
  items: readonly T[]
  getKey: (item: T, index: number) => MasonryKey
  columns?: number
  minColumnWidth?: number
  gap?: MasonryGap
  sequential?: boolean
  loading?: boolean
  emptyText?: string
  label?: string
  dir?: 'ltr' | 'rtl'
  class?: string
  itemClass?: string | ((item: T, index: number) => string | undefined)
}
export interface MasonryExpose {
  element: HTMLElement | undefined
  measure: () => void
}
