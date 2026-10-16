import { handleAndDispatchCustomEvent } from '../dismissable-layer'
import { findValuesBetween, type ListboxSelectionBehavior } from '../listbox'
import type { FocusIntent } from '../roving-focus'

export type TreeValue = Record<string, any>

export interface FlattenedItem<T> {
  _id: string
  index: number
  value: T
  level: number
  hasChildren: boolean
  parentItem?: T
  bind: {
    value: T
    level: number
    'aria-setsize': number
    'aria-posinset': number
  }
}

export interface TreeAccessors<T> {
  getKey: (value: T) => string
  getChildren: (value: T) => T[] | undefined
}

export const TREE_SELECT = 'tree.select'
export const TREE_TOGGLE = 'tree.toggle'

export const TREE_KEY_TO_INTENT: Record<string, FocusIntent> = {
  ArrowLeft: 'prev',
  ArrowUp: 'prev',
  ArrowRight: 'next',
  ArrowDown: 'next',
  PageUp: 'first',
  Home: 'first',
  PageDown: 'last',
  End: 'last',
}

export function defaultTreeChildren<T extends TreeValue>(value: T) {
  return value.children as T[] | undefined
}

export function flatten<U, T extends { children?: any[] }>(items: T[]): U[] {
  return items.reduce((acc: any[], item: T) => {
    acc.push(item)
    if (item.children) acc.push(...flatten(item.children))
    return acc
  }, [])
}

export function flattenTree<T>(
  items: T[],
  accessors: TreeAccessors<T>,
  expanded: string[],
  level = 1,
  parentItem?: T,
): FlattenedItem<T>[] {
  return items.reduce((acc: FlattenedItem<T>[], item: T, index: number) => {
    const key = accessors.getKey(item)
    const children = accessors.getChildren(item)
    acc.push({
      _id: key,
      value: item,
      index,
      level,
      parentItem,
      hasChildren: !!children,
      bind: {
        value: item,
        level,
        'aria-setsize': items.length,
        'aria-posinset': index + 1,
      },
    })
    if (children && expanded.includes(key))
      acc.push(...flattenTree(children, accessors, expanded, level + 1, item))
    return acc
  }, [])
}

export function treeSelectedKeys<T>(
  model: unknown,
  multiple: boolean,
  getKey: (value: T) => string,
) {
  if (multiple && Array.isArray(model)) return model.map(item => getKey(item as T))
  return [getKey((model ?? {}) as T)]
}

export interface TreeSelectionOptions<T> extends TreeAccessors<T> {
  multiple: boolean
  selectionBehavior: ListboxSelectionBehavior
  propagateSelect: boolean
  bubbleSelect: boolean
  flattened: FlattenedItem<T>[]
}

function bubbleSelection<T>(
  item: FlattenedItem<T>,
  model: T[],
  options: TreeSelectionOptions<T>,
): T[] {
  const { getKey, getChildren, flattened } = options
  if (item.parentItem == null || !options.multiple) return model
  const parentItem = flattened.find(
    entry => item.parentItem != null && getKey(entry.value) === getKey(item.parentItem),
  )
  if (parentItem == null) return model
  const all = getChildren(parentItem.value)?.every(child =>
    model.find(value => getKey(value) === getKey(child)),
  )
  const next = all
    ? [...model, parentItem.value]
    : model.filter(value => getKey(value) !== getKey(parentItem.value))
  return bubbleSelection(parentItem, next, options)
}

export function nextTreeSelection<T>(
  model: unknown,
  value: T,
  options: TreeSelectionOptions<T>,
): { value: unknown; anchor: boolean } {
  const { getKey, getChildren, multiple, selectionBehavior } = options
  const condition = (base: unknown) => getKey((base ?? {}) as T) === getKey(value)
  const exist = multiple && Array.isArray(model) ? model.findIndex(condition) !== -1 : undefined
  let next: unknown
  let anchor = false
  if (multiple && Array.isArray(model)) {
    if (selectionBehavior === 'replace') {
      next = [value]
      anchor = true
    } else {
      const index = model.findIndex(item => condition(item))
      next = index !== -1 ? model.filter((_, i) => i !== index) : [...model, value]
    }
  } else if (selectionBehavior === 'replace') next = { ...value }
  else if (!Array.isArray(model) && condition(model)) next = undefined
  else next = { ...value }

  if (options.bubbleSelect && multiple && Array.isArray(next)) {
    const item = options.flattened.find(entry => getKey(entry.value) === getKey(value))
    if (item != null) next = bubbleSelection(item, next as T[], options)
  }

  if (options.propagateSelect && multiple && Array.isArray(next)) {
    const children = flatten<T, any>((getChildren(value) ?? []) as any[])
    next = exist
      ? (next as T[]).filter(
          item => !children.some(child => getKey((item ?? {}) as T) === getKey(child)),
        )
      : [...(next as T[]), ...children]
  }

  return { value: next, anchor }
}

export function treeRangeValues(
  intent: FocusIntent | undefined,
  current: Element | null,
  entries: { ref: HTMLElement; value?: unknown }[],
  options: unknown[],
  state: { firstValue: unknown; multiple: boolean; model: unknown },
): unknown[] | null | undefined {
  if (!state.firstValue || !state.multiple || !Array.isArray(state.model)) return
  const lastValue = entries
    .filter(item => item.ref.dataset.disabled !== '')
    .find(item => item.ref === current)?.value
  if (!lastValue) return
  switch (intent) {
    case 'prev':
    case 'next':
      return findValuesBetween(options, state.firstValue, lastValue)
    case 'first':
      return findValuesBetween(options, state.firstValue, options[0])
    case 'last':
      return findValuesBetween(options, state.firstValue, options.at(-1))
  }
  return null
}

export function toggleTreeExpanded(expanded: string[], key: string) {
  return expanded.includes(key) ? expanded.filter(item => item !== key) : [...expanded, key]
}

export function treeIndeterminate<T>(input: {
  value: T
  model: unknown
  isSelected: boolean
  hasChildren: boolean
  bubbleSelect: boolean
  propagateSelect: boolean
  getKey: (value: T) => string
  getChildren: (value: T) => T[] | undefined
}) {
  const { model, getKey } = input
  if (!input.hasChildren || !Array.isArray(model)) return undefined
  const found = (child: T) => model.find(item => getKey(item as T) === getKey(child))
  if (input.bubbleSelect) {
    const children = flatten<T, any>((input.getChildren(input.value) || []) as any[])
    return children.some(found) && !children.every(found)
  }
  if (input.propagateSelect && input.isSelected) {
    const children = flatten<T, any>((input.getChildren(input.value) || []) as any[])
    return !children.every(found)
  }
  return undefined
}

function indent(element: HTMLElement) {
  return Number(element.getAttribute('data-indent'))
}

export function treeChildTarget(collection: HTMLElement[], current: Element | null, level: number) {
  const index = collection.indexOf(current as HTMLElement)
  return collection.slice(index).find(element => indent(element) === level + 1)
}

export function treeParentTarget(
  collection: HTMLElement[],
  current: Element | null,
  level: number,
) {
  const index = collection.indexOf(current as HTMLElement)
  return collection
    .slice(0, index)
    .reverse()
    .find(element => indent(element) === level - 1)
}

export interface TreeItemEventDetail<T> {
  originalEvent: Event
  value?: T
  isExpanded: boolean
  isSelected: boolean
}

export type TreeItemSelectEvent<T> = CustomEvent<TreeItemEventDetail<T>>
export type TreeItemToggleEvent<T> = CustomEvent<TreeItemEventDetail<T>>

export function dispatchTreeItemEvent<T>(
  name: typeof TREE_SELECT | typeof TREE_TOGGLE,
  handler: (event: CustomEvent<TreeItemEventDetail<T>>) => void,
  detail: TreeItemEventDetail<T>,
) {
  handleAndDispatchCustomEvent<CustomEvent<TreeItemEventDetail<T>>>(name, handler, detail)
}
