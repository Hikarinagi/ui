import type { ComputedRef, Ref } from 'vue'
import type { PinInputValue } from '../../../../shared/src/primitives/pin-input'
import { createContext } from '../utils/createContext'
import type { Direction } from '../utils/useDirection'

export type PinInputType = 'text' | 'number'

export interface PinInputRootContext {
  modelValue: Ref<PinInputValue>
  currentModelValue: ComputedRef<PinInputValue>
  mask: Ref<boolean>
  otp: Ref<boolean>
  placeholder: Ref<string>
  type: Ref<PinInputType>
  dir: Ref<Direction>
  disabled: Ref<boolean>
  isCompleted: ComputedRef<boolean>
  inputElements?: Ref<Set<HTMLInputElement>>
  onInputElementChange: (element: HTMLInputElement) => void
  isNumericMode: ComputedRef<boolean>
}

export const [injectPinInputRootContext, providePinInputRootContext] =
  createContext<PinInputRootContext>('PinInputRoot')
