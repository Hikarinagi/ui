import type { Ref } from 'vue'
import type { Orientation } from '../../../../shared/src/primitives/roving-focus'
import { createContext } from '../utils/createContext'
import type { Direction } from '../utils/useDirection'

export interface RovingFocusGroupContext {
  loop: Ref<boolean>
  dir: Ref<Direction>
  orientation: Ref<Orientation | undefined>
  currentTabStopId: Ref<string | null | undefined>
  onItemFocus: (tabStopId: string) => void
  onItemShiftTab: () => void
  onFocusableItemAdd: () => void
  onFocusableItemRemove: () => void
}

export const [injectRovingFocusGroupContext, provideRovingFocusGroupContext] =
  createContext<RovingFocusGroupContext>('RovingFocusGroup')
