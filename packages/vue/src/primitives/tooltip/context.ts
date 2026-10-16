import type { ComputedRef, Ref } from 'vue'
import { createContext } from '../utils/createContext'

export const TOOLTIP_OPEN = 'tooltip.open'

export interface TooltipProviderContext {
  isOpenDelayed: Ref<boolean>
  delayDuration: Ref<number>
  onOpen: () => void
  onClose: () => void
  isPointerInTransitRef: Ref<boolean>
  disableHoverableContent: Ref<boolean>
  disableClosingTrigger: Ref<boolean>
  disabled: Ref<boolean>
  ignoreNonKeyboardFocus: Ref<boolean>
  content: Ref<Record<string, unknown> | undefined>
}

export const [injectTooltipProviderContext, provideTooltipProviderContext] =
  createContext<TooltipProviderContext>('TooltipProvider')

export interface TooltipRootContext {
  contentId: string
  open: Ref<boolean>
  stateAttribute: ComputedRef<'closed' | 'delayed-open' | 'instant-open'>
  trigger: Ref<HTMLElement | undefined>
  onTriggerChange: (element: HTMLElement | undefined) => void
  onTriggerEnter: () => void
  onTriggerLeave: () => void
  onOpen: () => void
  onClose: () => void
  disableHoverableContent: Ref<boolean>
  disableClosingTrigger: Ref<boolean>
  disabled: Ref<boolean>
  ignoreNonKeyboardFocus: Ref<boolean>
}

export const [injectTooltipRootContext, provideTooltipRootContext] =
  createContext<TooltipRootContext>('TooltipRoot')
