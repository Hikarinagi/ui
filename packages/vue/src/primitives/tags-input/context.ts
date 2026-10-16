import type { ComputedRef, Ref } from 'vue'
import type { AcceptableInputValue } from '../../../../shared/src/primitives/tags-input'
import { createContext } from '../utils/createContext'
import type { Direction } from '../utils/useDirection'

export interface TagsInputRootContext<T = AcceptableInputValue> {
  modelValue: Ref<Array<T>>
  onAddValue: (payload: string) => boolean
  onRemoveValue: (index: number) => void
  onInputKeydown: (event: KeyboardEvent) => void
  selectedElement: Ref<HTMLElement | undefined>
  isInvalidInput: Ref<boolean>
  addOnPaste: Ref<boolean>
  addOnTab: Ref<boolean>
  addOnBlur: Ref<boolean>
  disabled: Ref<boolean>
  delimiter: Ref<string | RegExp>
  dir: Ref<Direction>
  max: Ref<number>
  id: Ref<string | undefined> | undefined
  displayValue: (value: T) => string
}

export const [injectTagsInputRootContext, provideTagsInputRootContext] =
  createContext<TagsInputRootContext>('TagsInputRoot')

export interface TagsInputItemContext {
  value: Ref<AcceptableInputValue>
  displayValue: ComputedRef<string>
  isSelected: Ref<boolean>
  disabled?: Ref<boolean>
  textId: string
}

export const [injectTagsInputItemContext, provideTagsInputItemContext] =
  createContext<TagsInputItemContext>('TagsInputItem')
