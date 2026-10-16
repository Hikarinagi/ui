import type { Ref } from 'vue'
import type { Direction } from '../utils/useDirection'
import { createContext } from '../utils/createContext'

export type Orientation = 'horizontal' | 'vertical'

export interface NavigationMenuContext {
  isRootMenu: boolean
  modelValue: Ref<string>
  previousValue: Ref<string>
  baseId: string
  disableClickTrigger: Ref<boolean>
  disableHoverTrigger: Ref<boolean>
  dir: Ref<Direction>
  unmountOnHide: Ref<boolean>
  orientation: Orientation
  rootNavigationMenu: Ref<HTMLElement | undefined>
  indicatorTrack: Ref<HTMLElement | undefined>
  activeTrigger: Ref<HTMLElement | undefined>
  onIndicatorTrackChange: (track: HTMLElement | undefined) => void
  viewport: Ref<HTMLElement | undefined>
  onViewportChange: (viewport: HTMLElement | undefined) => void
  onTriggerEnter: (value: string) => void
  onTriggerLeave: () => void
  onContentEnter: (value?: string) => void
  onContentLeave: () => void
  onItemSelect: (value: string) => void
  onItemDismiss: () => void
}

export interface NavigationMenuItemContext {
  value: string
  contentId: string
  triggerRef: Ref<HTMLElement | undefined>
  focusProxyRef: Ref<HTMLElement | undefined>
  wasEscapeCloseRef: Ref<boolean>
  onEntryKeyDown: (side?: 'start' | 'end') => void
  onFocusProxyEnter: (side?: 'start' | 'end') => void
  onContentFocusOutside: () => void
  onRootContentClose: () => void
}

export const [injectNavigationMenuContext, provideNavigationMenuContext] =
  createContext<NavigationMenuContext>(
    ['NavigationMenuRoot', 'NavigationMenuSub'],
    'NavigationMenuContext',
  )

export const [injectNavigationMenuItemContext, provideNavigationMenuItemContext] =
  createContext<NavigationMenuItemContext>('NavigationMenuItem')
