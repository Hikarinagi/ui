import type { HTMLAttributes, ReactNode, Ref } from 'react'
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
export interface MasonryProps<T> extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'dir'> {
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
  itemClass?: string | ((item: T, index: number) => string | undefined)
  onLayout?: (value: MasonryLayout) => void
  children?: ReactNode | ((props: MasonrySlotProps<T>) => ReactNode)
  empty?: ReactNode
  loadingContent?: ReactNode
  pending?: ReactNode
  ref?: Ref<MasonryExpose>
  [attribute: `data-${string}`]: string | undefined
}
export interface MasonryExpose {
  element: HTMLElement | undefined
  measure: () => void
}
