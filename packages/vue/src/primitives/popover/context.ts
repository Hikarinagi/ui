import type { Ref } from 'vue'
import { createContext } from '../utils/createContext'

export interface PopoverRootContext {
  triggerElement: Ref<HTMLElement | undefined>
  contentId: string
  triggerId: string
  open: Ref<boolean>
  modal: Ref<boolean>
  onOpenChange: (value: boolean) => void
  onOpenToggle: () => void
  hasCustomAnchor: Ref<boolean>
}

export const [injectPopoverRootContext, providePopoverRootContext] =
  createContext<PopoverRootContext>('PopoverRoot')
