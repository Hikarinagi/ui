import type { Ref } from 'vue'
import type {
  Comparator,
  EventHook,
  ListboxSelectionBehavior,
} from '../../../../shared/src/primitives/listbox'
import type { Orientation } from '../../../../shared/src/primitives/roving-focus'
import { createContext } from '../utils/createContext'
import type { Direction } from '../utils/useDirection'

export interface ListboxRootContext<T = unknown> {
  modelValue: Ref<T | T[] | undefined>
  onValueChange: (value: T) => void
  multiple: Ref<boolean>
  orientation: Ref<Orientation>
  dir: Ref<Direction>
  disabled: Ref<boolean>
  highlightOnHover: Ref<boolean>
  highlightedElement: Ref<HTMLElement | null>
  isVirtual: Ref<boolean>
  virtualFocusHook: EventHook<{ event?: Event; scroll: boolean }>
  virtualKeydownHook: EventHook<KeyboardEvent>
  virtualHighlightHook: EventHook<T>
  by?: Comparator<T>
  firstValue?: Ref<T | undefined>
  selectionBehavior?: Ref<ListboxSelectionBehavior>
  focusable: Ref<boolean>
  onLeave: (event: Event) => void
  onEnter: (event: Event) => void
  changeHighlight: (element: HTMLElement, scrollIntoView?: boolean, focus?: boolean) => void
  onKeydownNavigation: (event: KeyboardEvent) => void
  onKeydownEnter: (event: KeyboardEvent) => void
  onKeydownTypeAhead: (event: KeyboardEvent) => void
  onCompositionStart: () => void
  onCompositionEnd: () => void
  highlightFirstItem: () => void
}

export const [injectListboxRootContext, provideListboxRootContext] =
  createContext<ListboxRootContext>('ListboxRoot')

export interface ListboxHighlightScrollContext {
  suppressHighlightScroll: Readonly<Ref<boolean>>
  onHighlightScrollRequest: (scroll: (() => void) | undefined) => void
}

export const [injectListboxHighlightScrollContext, provideListboxHighlightScrollContext] =
  createContext<ListboxHighlightScrollContext>('ListboxHighlightScroll')

export interface ListboxItemContext {
  isSelected: Ref<boolean>
}

export const [injectListboxItemContext, provideListboxItemContext] =
  createContext<ListboxItemContext>('ListboxItem')

export interface ListboxGroupContext {
  id: string
}

export const [injectListboxGroupContext, provideListboxGroupContext] =
  createContext<ListboxGroupContext>('ListboxGroup')
