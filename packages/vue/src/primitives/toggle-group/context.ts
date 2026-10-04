import type { Ref } from 'vue'
import type { Orientation } from '../../../../shared/src/primitives/roving-focus'
import type { AcceptableValue } from '../utils/types'
import { createContext } from '../utils/createContext'
import type { Direction } from '../utils/useDirection'

export interface ToggleGroupRootContext {
  isSingle: Ref<boolean>
  modelValue: Ref<AcceptableValue | AcceptableValue[] | undefined>
  changeModelValue: (value: AcceptableValue) => void
  dir?: Ref<Direction>
  orientation?: Orientation
  loop: Ref<boolean>
  rovingFocus: Ref<boolean>
  disabled?: Ref<boolean>
}

export const [injectToggleGroupRootContext, provideToggleGroupRootContext] =
  createContext<ToggleGroupRootContext>('ToggleGroupRoot')
