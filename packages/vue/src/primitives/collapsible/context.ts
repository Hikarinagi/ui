import type { Ref } from 'vue'
import { createContext } from '../utils/createContext'

export interface CollapsibleRootContext {
  contentId: string
  disabled?: Ref<boolean>
  open: Ref<boolean>
  unmountOnHide: Ref<boolean>
  onOpenToggle: () => void
}

export const [injectCollapsibleRootContext, provideCollapsibleRootContext] =
  createContext<CollapsibleRootContext>('CollapsibleRoot')
