import type { ComputedRef, Ref } from 'vue'
import type { Orientation } from '../../../../shared/src/primitives/roving-focus'
import type { AcceptableValue } from '../utils/types'
import { createContext } from '../utils/createContext'

export interface RadioGroupRootContext {
  modelValue?: Readonly<Ref<AcceptableValue | undefined>>
  changeModelValue: (value?: AcceptableValue) => void
  disabled: Ref<boolean>
  loop: Ref<boolean>
  orientation: Ref<Orientation | undefined>
  name?: string
  required: Ref<boolean>
}

export const [injectRadioGroupRootContext, provideRadioGroupRootContext] =
  createContext<RadioGroupRootContext>('RadioGroupRoot')

export interface RadioGroupItemContext {
  disabled: ComputedRef<boolean>
  checked: ComputedRef<boolean>
}

export const [injectRadioGroupItemContext, provideRadioGroupItemContext] =
  createContext<RadioGroupItemContext>('RadioGroupItem')
