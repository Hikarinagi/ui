import type {
  TourAlign,
  TourBeforeChange,
  TourCloseReason,
  TourPlay,
  TourPlayContext,
  TourPoint,
  TourPointer,
  TourPointerKind,
  TourRectLike,
  TourSide,
  TourSpotlightOptions,
  TourStepBase,
  TourTarget,
  TourTargetItem,
  TourVirtualElement,
} from '../../../../shared/src/lib/tour'

export type {
  TourAlign,
  TourBeforeChange,
  TourCloseReason,
  TourPlay,
  TourPlayContext,
  TourPoint,
  TourPointer,
  TourPointerKind,
  TourRectLike,
  TourSide,
  TourSpotlightOptions,
  TourTarget,
  TourTargetItem,
  TourVirtualElement,
}

export type TourStep = TourStepBase

export interface TourProps {
  steps: TourStep[]
  mask?: boolean | 'dim'
  locked?: boolean
  beacon?: boolean
  blockTarget?: boolean
  blockPage?: boolean
  pointer?: 'auto' | TourPointerKind
  nextText?: string
  prevText?: string
  finishText?: string
  skipText?: string
  replayText?: string
  beforeChange?: TourBeforeChange
  dir?: 'ltr' | 'rtl'
  class?: string
}

export interface TourSlotProps {
  step: TourStep
  current: number
  total: number
  busy: boolean
  playing: boolean
  next: () => void
  prev: () => void
  skip: () => void
  replay: () => void
}

export interface TourExpose {
  next: () => Promise<void>
  prev: () => Promise<void>
  goTo: (step: number) => Promise<void>
  close: () => void
  replay: () => void
}
