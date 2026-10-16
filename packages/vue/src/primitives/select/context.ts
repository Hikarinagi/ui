import type { Ref } from 'vue'
import type { Comparator } from '../../../../shared/src/primitives/listbox'
import { createContext } from '../utils/createContext'
import type { Direction } from '../utils/useDirection'

export interface SelectOptionRecord {
  value: unknown
  disabled?: boolean
  textContent: string
}

export interface SelectRootContext {
  triggerElement: Ref<HTMLElement | undefined>
  onTriggerChange: (node: HTMLElement | undefined) => void
  valueElement: Ref<HTMLElement | undefined>
  onValueElementChange: (node: HTMLElement) => void
  contentId: string
  modelValue: Ref<unknown>
  onValueChange: (value: unknown) => void
  by?: Comparator
  open: Ref<boolean>
  multiple: Ref<boolean>
  required?: Ref<boolean>
  onOpenChange: (open: boolean) => void
  dir: Ref<Direction>
  triggerPointerDownPosRef: Ref<{ x: number; y: number } | null>
  disabled?: Ref<boolean>
  isEmptyModelValue: Ref<boolean>
  optionsSet: Ref<Set<SelectOptionRecord>>
  onOptionAdd: (option: SelectOptionRecord) => void
  onOptionRemove: (option: SelectOptionRecord) => void
}

export interface SelectContentContext {
  content?: Ref<HTMLElement | undefined>
  viewport?: Ref<HTMLElement | undefined>
  onViewportChange: (node: HTMLElement | undefined) => void
  itemRefCallback: (node: HTMLElement | undefined, value: unknown, disabled?: boolean) => void
  selectedItem?: Ref<HTMLElement | undefined>
  onItemLeave?: () => void
  itemTextRefCallback: (node: HTMLElement | undefined, value: unknown, disabled?: boolean) => void
  focusSelectedItem?: () => void
  selectedItemText?: Ref<HTMLElement | undefined>
  position?: 'item-aligned' | 'popper'
  isPositioned?: Ref<boolean>
  searchRef?: { readonly search: string }
}

export interface SelectItemContext {
  value: unknown
  disabled: Ref<boolean>
  textId: string
  isSelected: Ref<boolean>
  onItemTextChange: (node: HTMLElement | undefined) => void
}

export const SelectContentDefaultContextValue: SelectContentContext = {
  onViewportChange: () => {},
  itemTextRefCallback: () => {},
  itemRefCallback: () => {},
}

export const [injectSelectRootContext, provideSelectRootContext] =
  createContext<SelectRootContext>('SelectRoot')

export const [injectSelectContentContext, provideSelectContentContext] =
  createContext<SelectContentContext>('SelectContent')

export const [injectSelectItemContext, provideSelectItemContext] =
  createContext<SelectItemContext>('SelectItem')

export const [injectSelectGroupContext, provideSelectGroupContext] = createContext<{
  id: string
}>('SelectGroup')
