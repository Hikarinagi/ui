import type {
  TourAlign,
  TourBeforeChange,
  TourSide,
  TourStepBase,
  TourTarget,
} from '../../../../shared/src/lib/tour'

export type { TourAlign, TourBeforeChange, TourSide, TourTarget }

export type TourStep = TourStepBase

export interface TourProps {
  steps: TourStep[]
  mask?: boolean
  locked?: boolean
  beacon?: boolean
  nextText?: string
  prevText?: string
  finishText?: string
  skipText?: string
  beforeChange?: TourBeforeChange
  dir?: 'ltr' | 'rtl'
  class?: string
}

export interface TourSlotProps {
  step: TourStep
  current: number
  total: number
  busy: boolean
  next: () => void
  prev: () => void
  skip: () => void
}

export interface TourExpose {
  next: () => Promise<void>
  prev: () => Promise<void>
  goTo: (step: number) => Promise<void>
  close: () => void
}
