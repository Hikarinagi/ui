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

export interface StepperProps<T extends StepperItem = StepperItem> {
  items: T[]
  modelValue?: number
  defaultValue?: number
  orientation?: StepperOrientation
  size?: StepperSize
  linear?: boolean
  disabled?: boolean
  beforeChange?: StepperBeforeChange
  label?: string
  dir?: 'ltr' | 'rtl'
  class?: string
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
