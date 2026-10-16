import type { Ref } from 'vue'
import type { ComboboxFilterState } from '../../../../shared/src/primitives/combobox'
import { createContext } from '../utils/createContext'

export type ComboboxContentPosition = 'inline' | 'popper'

export interface ComboboxRootContext {
  modelValue: Ref<unknown>
  multiple: Ref<boolean>
  disabled: Ref<boolean>
  open: Ref<boolean>
  onOpenChange: (open: boolean) => void
  onContentPositionChange: (content: symbol, position: ComboboxContentPosition) => void
  onContentPlaced: (content: symbol) => void
  onContentUnmount: (content: symbol) => void
  contentId: string
  isUserInputted: Ref<boolean>
  isVirtual: Ref<boolean>
  inputElement: Ref<HTMLInputElement | undefined>
  highlightedElement: Ref<HTMLElement | undefined>
  onInputElementChange: (element: HTMLInputElement) => void
  triggerElement: Ref<HTMLElement | undefined>
  onTriggerElementChange: (element: HTMLElement) => void
  parentElement: Ref<HTMLElement | undefined>
  resetSearchTermOnSelect: Ref<boolean>
  onResetSearchTerm: (listener: () => void) => { off: () => void }
  allItems: Ref<Map<string, string>>
  allGroups: Ref<Map<string, Set<string>>>
  filterSearch: Ref<string>
  filterState: Ref<ComboboxFilterState>
  ignoreFilter: Ref<boolean>
  openOnFocus: Ref<boolean>
  openOnClick: Ref<boolean>
  resetModelValueOnClear: Ref<boolean>
}

export const [injectComboboxRootContext, provideComboboxRootContext] =
  createContext<ComboboxRootContext>('ComboboxRoot')

export const [injectComboboxContentContext, provideComboboxContentContext] = createContext<{
  position: Ref<ComboboxContentPosition>
}>('ComboboxContent')

export const [injectComboboxGroupContext, provideComboboxGroupContext] = createContext<{
  id: string
  labelId: string
}>('ComboboxGroup')
