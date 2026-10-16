import type { Ref } from 'vue'
import type { CheckedState, GraceIntent } from '../../../../shared/src/primitives/menu'
import { createContext } from '../utils/createContext'
import type { Direction } from '../utils/useDirection'

export interface MenuContext {
  open: Ref<boolean>
  onOpenChange: (open: boolean) => void
  content: Ref<HTMLElement | undefined>
  onContentChange: (content: HTMLElement | undefined) => void
}

export const [injectMenuContext, provideMenuContext] = createContext<MenuContext>(
  ['MenuRoot', 'MenuSub'],
  'MenuContext',
)

export interface MenuRootContext {
  onClose: () => void
  dir: Ref<Direction>
  isUsingKeyboardRef: Ref<boolean>
  modal: Ref<boolean>
}

export const [injectMenuRootContext, provideMenuRootContext] =
  createContext<MenuRootContext>('MenuRoot')

export interface MenuContentContext {
  onItemEnter: (event: PointerEvent) => boolean
  onItemLeave: (event: PointerEvent) => boolean
  onTriggerLeave: (event: PointerEvent) => boolean
  searchRef: Ref<string>
  pointerGraceTimerRef: Ref<number>
  onPointerGraceIntentChange: (intent: GraceIntent | null) => void
  highlightedElement: Ref<HTMLElement | undefined>
  onKeydownNavigation: (event: KeyboardEvent) => void
  onKeydownEnter: (event: KeyboardEvent) => void
  filterElement: Ref<HTMLElement | undefined>
  onFilterElementChange: (element: HTMLElement | undefined) => void
  activeSubmenuContext: Ref<
    { onOpenChange: (open: boolean) => void; trigger: Ref<HTMLElement | undefined> } | undefined
  >
}

export const [injectMenuContentContext, provideMenuContentContext] =
  createContext<MenuContentContext>('MenuContent')

export interface MenuSubContext {
  contentId: string
  triggerId: string
  trigger: Ref<HTMLElement | undefined>
  onTriggerChange: (trigger: HTMLElement | undefined) => void
}

export const [injectMenuSubContext, provideMenuSubContext] =
  createContext<MenuSubContext>('MenuSub')

export const [injectMenuGroupContext, provideMenuGroupContext] = createContext<{ id: string }>(
  'MenuGroup',
)

export interface MenuRadioGroupContext {
  modelValue: Ref<unknown>
  onValueChange: (payload: unknown) => void
}

export const [injectMenuRadioGroupContext, provideMenuRadioGroupContext] =
  createContext<MenuRadioGroupContext>('MenuRadioGroup')

export const [injectMenuItemIndicatorContext, provideMenuItemIndicatorContext] = createContext<{
  modelValue: Ref<CheckedState>
}>(['MenuCheckboxItem', 'MenuRadioItem'], 'MenuItemIndicatorContext')
