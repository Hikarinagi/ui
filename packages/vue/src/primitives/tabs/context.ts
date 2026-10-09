import type { Ref } from 'vue'
import type { Orientation } from '../../../../shared/src/primitives/roving-focus'
import type { TabsActivationMode, TabsValue } from '../../../../shared/src/primitives/tabs'
import { createContext } from '../utils/createContext'
import type { Direction } from '../utils/useDirection'

export interface TabsRootContext {
  modelValue: Ref<TabsValue | undefined>
  changeModelValue: (value: TabsValue) => void
  orientation: Ref<Orientation>
  dir: Ref<Direction>
  unmountOnHide: Ref<boolean>
  activationMode: TabsActivationMode
  baseId: string
  tabsList: Ref<HTMLElement | undefined>
  contentIds: Ref<Set<TabsValue>>
  registerContent: (value: TabsValue) => void
  unregisterContent: (value: TabsValue) => void
}

export const [injectTabsRootContext, provideTabsRootContext] =
  createContext<TabsRootContext>('TabsRoot')
