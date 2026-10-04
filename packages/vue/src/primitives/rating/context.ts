import type { ComputedRef, Ref } from 'vue'
import { createContext } from '../utils/createContext'

export interface RatingRootContext {
  modelValue: Ref<number | undefined>
  items: ComputedRef<number[]>
  hoveredRating: Ref<number>
  disabled: Ref<boolean>
  step: Ref<number>
  changeModelValue: (value: number) => void
  changeHoveredRating: (value: number) => void
}

export const [injectRatingRootContext, provideRatingRootContext] =
  createContext<RatingRootContext>('RatingRoot')

export interface RatingItemContext {
  steps: ComputedRef<number[]>
}

export const [injectRatingItemContext, provideRatingItemContext] =
  createContext<RatingItemContext>('RatingItem')
