import type { Ref } from 'vue'
import { createContext } from '../utils/createContext'

export interface DialogRootContext {
  open: Readonly<Ref<boolean>>
  modal: Ref<boolean>
  unmountOnHide: Ref<boolean>
  openModal: () => void
  onOpenChange: (value: boolean) => void
  onOpenToggle: () => void
  triggerElement: Ref<HTMLElement | undefined>
  contentElement: Ref<HTMLElement | undefined>
  contentId: string
  titleId: string
  descriptionId: string
}

export const [injectDialogRootContext, provideDialogRootContext] =
  createContext<DialogRootContext>('DialogRoot')
