import type { HTMLAttributes, ReactNode, Ref } from 'react'

export type StepperOrientation = 'horizontal' | 'vertical'
export type StepperSize = 'sm' | 'md' | 'lg'
export type StepperState = 'inactive' | 'active' | 'completed' | 'error'
export type StepperBeforeChange = (
  step: number,
  previousStep: number,
) => boolean | void | Promise<boolean | void>

export interface StepperItem {
  title: string
  description?: string
  disabled?: boolean
  completed?: boolean
  error?: boolean
}

export interface StepperProps<T extends StepperItem = StepperItem> extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'defaultValue' | 'dir' | 'onError'
> {
  items: T[]
  value?: number
  defaultValue?: number
  onValueChange?: (step: number) => void
  orientation?: StepperOrientation
  size?: StepperSize
  linear?: boolean
  disabled?: boolean
  beforeChange?: StepperBeforeChange
  label?: string
  dir?: 'ltr' | 'rtl'
  onError?: (error: unknown) => void
  children?: ReactNode | ((props: StepperNavigation<T>) => ReactNode)
  renderIndicator?: (props: StepperSlotProps<T>) => ReactNode
  renderTitle?: (props: StepperSlotProps<T>) => ReactNode
  renderDescription?: (props: StepperSlotProps<T>) => ReactNode
  ref?: Ref<StepperExpose>
  [attribute: `data-${string}`]: string | undefined
}

export interface StepperSlotProps<T extends StepperItem = StepperItem> {
  item: T
  index: number
  step: number
  state: StepperState
  active: boolean
  pending: boolean
  disabled: boolean
}

export interface StepperNavigation<T extends StepperItem = StepperItem> {
  step: number
  item: T | undefined
  total: number
  pending: boolean
  canNext: boolean
  canPrev: boolean
  next: () => Promise<boolean>
  prev: () => Promise<boolean>
  goTo: (step: number) => Promise<boolean>
}

export interface StepperExpose {
  step: number
  pending: boolean
  next: () => Promise<boolean>
  prev: () => Promise<boolean>
  goTo: (step: number) => Promise<boolean>
  canNext: boolean
  canPrev: boolean
}
