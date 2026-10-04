import type { ComputedRef, Ref } from 'vue'
import type { StepperState } from '../../../../shared/src/primitives/stepper'
import type { Orientation } from '../../../../shared/src/primitives/roving-focus'
import { createContext } from '../utils/createContext'
import type { Direction } from '../utils/useDirection'

export interface StepperRootContext {
  modelValue: Ref<number | undefined>
  changeModelValue: (value: number) => void
  orientation: Ref<Orientation>
  dir: Ref<Direction>
  linear: Ref<boolean>
  totalStepperItems: Ref<Set<HTMLElement>>
}

export const [injectStepperRootContext, provideStepperRootContext] =
  createContext<StepperRootContext>('StepperRoot')

export interface StepperItemContext {
  titleId: string
  descriptionId: string
  step: Ref<number>
  state: ComputedRef<StepperState>
  disabled: Ref<boolean>
  isFocusable: ComputedRef<boolean>
}

export const [injectStepperItemContext, provideStepperItemContext] =
  createContext<StepperItemContext>('StepperItem')
