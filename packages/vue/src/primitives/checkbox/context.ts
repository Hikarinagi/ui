import type { ComputedRef, Ref } from 'vue'
import type { CheckedState } from '../../../../shared/src/primitives/checkbox'
import { createContext } from '../utils/createContext'

export interface CheckboxGroupRootContext {
  modelValue: Ref<unknown[]>
  rovingFocus: Ref<boolean>
  disabled: Ref<boolean>
}

export const [injectCheckboxGroupRootContext, provideCheckboxGroupRootContext] =
  createContext<CheckboxGroupRootContext>('CheckboxGroupRoot')

export interface CheckboxRootContext {
  disabled: Ref<boolean>
  state: ComputedRef<CheckedState>
}

export const [injectCheckboxRootContext, provideCheckboxRootContext] =
  createContext<CheckboxRootContext>('CheckboxRoot')
