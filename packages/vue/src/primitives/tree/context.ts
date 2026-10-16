import type { Ref } from 'vue'
import type { EventHook } from '../../../../shared/src/primitives/listbox'
import type { FocusIntent } from '../../../../shared/src/primitives/roving-focus'
import type { FlattenedItem } from '../../../../shared/src/primitives/tree'
import { createContext } from '../utils/createContext'
import type { Direction } from '../utils/useDirection'

export interface TreeRootContext<T = Record<string, any>> {
  modelValue: Ref<T | T[]>
  selectedKeys: Ref<string[]>
  onSelect: (value: T) => void
  expanded: Ref<string[]>
  onToggle: (value: T) => void
  items: Ref<T[] | undefined>
  expandedItems: Ref<FlattenedItem<T>[]>
  getKey: (value: T) => string
  getChildren: (value: T) => T[] | undefined
  multiple: Ref<boolean>
  disabled: Ref<boolean>
  dir: Ref<Direction>
  propagateSelect: Ref<boolean>
  bubbleSelect: Ref<boolean>
  isVirtual: Ref<boolean>
  virtualKeydownHook: EventHook<KeyboardEvent>
  handleMultipleReplace: (
    intent: FocusIntent | undefined,
    currentElement: Element | null,
    getItems: () => { ref: HTMLElement; value?: unknown }[],
    options: unknown[],
  ) => void
}

export const [injectTreeRootContext, provideTreeRootContext] =
  createContext<TreeRootContext<any>>('TreeRoot')
