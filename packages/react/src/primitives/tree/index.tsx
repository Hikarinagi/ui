'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type Ref,
} from 'react'
import { Primitive, type PrimitiveProps } from '../../lib/primitive'
import { RovingFocusGroup, RovingFocusItem } from '../roving-focus'
import { getActiveElement } from '../roving-focus/utils'
import {
  createCollection,
  createEventHook,
  createTypeahead,
  findValuesBetween,
  type Collection,
  type EventHook,
} from '../listbox/utils'
import { useVModel } from '../listbox/useVModel'
import { flatten } from './utils'
import { useComposedRefs } from '../utils/compose-refs'
import { useDirection } from '../utils/direction'

export { flatten } from './utils'

type DataAttributes = { [attribute: `data-${string}`]: string | undefined }
type Direction = 'ltr' | 'rtl'
type FocusIntent = 'first' | 'last' | 'prev' | 'next'
type TreeValue = Record<string, any>

const MAP_KEY_TO_FOCUS_INTENT: Record<string, FocusIntent> = {
  ArrowLeft: 'prev',
  ArrowUp: 'prev',
  ArrowRight: 'next',
  ArrowDown: 'next',
  PageUp: 'first',
  Home: 'first',
  PageDown: 'last',
  End: 'last',
}

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

export interface TreeRootContextValue<T = any> {
  modelValue: unknown
  selectedKeys: string[]
  onSelect: (value: T) => void
  expanded: string[]
  onToggle: (value: T) => void
  items: T[]
  expandedItems: FlattenedItem<T>[]
  getKey: (value: T) => string
  getChildren: (value: T) => T[] | undefined
  multiple: boolean
  disabled: boolean
  dir: Direction
  propagateSelect: boolean
  bubbleSelect: boolean
  isVirtual: { current: boolean }
  virtualKeydownHook: EventHook<KeyboardEvent>
  collection: Collection<T>
  handleMultipleReplace: (
    intent: FocusIntent,
    currentElement: Element | null,
    getItems: () => { ref: HTMLElement; value?: unknown }[],
    options: unknown[],
  ) => void
}

const TreeRootContext = createContext<TreeRootContextValue | null>(null)

export function useTreeRootContext<T = any>(consumer = 'TreeRoot') {
  const context = useContext(TreeRootContext)
  if (!context) throw new Error(`\`${consumer}\` must be used within \`TreeRoot\``)
  return context as TreeRootContextValue<T>
}

function usePassiveModel<T>(
  prop: T | undefined,
  defaultValue: T | undefined,
  onChange?: (value: T) => void,
) {
  const [internal, setInternal] = useState<T | undefined>(() =>
    prop !== undefined ? prop : defaultValue,
  )
  const [previous, setPrevious] = useState(prop)
  let value = internal
  if (!Object.is(previous, prop)) {
    setPrevious(prop)
    setInternal(prop)
    value = prop
  }
  const current = useRef(value)
  current.current = value
  const change = useRef(onChange)
  change.current = onChange
  const setValue = useCallback((next: T | undefined) => {
    const same = Object.is(next, current.current)
    current.current = next
    setInternal(next)
    if (!same) change.current?.(next as T)
  }, [])
  return [value, setValue, current] as const
}

export interface TreeRootSlotProps<T> {
  flattenItems: FlattenedItem<T>[]
  modelValue: unknown
  expanded: string[]
}

export interface TreeRootProps<T extends TreeValue = TreeValue>
  extends
    PrimitiveProps,
    Omit<HTMLAttributes<HTMLElement>, 'dir' | 'defaultValue' | 'children'>,
    DataAttributes {
  value?: unknown
  defaultValue?: unknown
  onValueChange?: (value: any) => void
  items?: T[]
  expanded?: string[]
  defaultExpanded?: string[]
  onExpandedChange?: (value: string[]) => void
  getKey: (value: T) => string
  getChildren?: (value: T) => T[] | undefined
  selectionBehavior?: 'toggle' | 'replace'
  multiple?: boolean
  dir?: Direction
  disabled?: boolean
  propagateSelect?: boolean
  bubbleSelect?: boolean
  children?: ReactNode | ((props: TreeRootSlotProps<T>) => ReactNode)
  ref?: Ref<HTMLElement>
}

const defaultGetChildren = (value: TreeValue) => value.children as TreeValue[] | undefined

export function TreeRoot<T extends TreeValue = TreeValue>({
  value: valueProp,
  defaultValue,
  onValueChange,
  items,
  expanded: expandedProp,
  defaultExpanded,
  onExpandedChange,
  getKey,
  getChildren = defaultGetChildren as (value: T) => T[] | undefined,
  selectionBehavior = 'toggle',
  multiple = false,
  dir: dirProp,
  disabled = false,
  propagateSelect = false,
  bubbleSelect = false,
  as = 'ul',
  asChild,
  onKeyDown,
  children,
  ref,
  ...attrs
}: TreeRootProps<T>) {
  const dir = useDirection(dirProp) as Direction
  const [modelValue, setModelValue, modelRef] = usePassiveModel<unknown>(
    valueProp,
    defaultValue ?? (multiple ? [] : undefined),
    onValueChange,
  )
  const [expanded = [], setExpanded] = useVModel<string[]>(
    expandedProp,
    defaultExpanded ?? [],
    onExpandedChange,
  )
  const [collection] = useState(() => createCollection<T>())
  const [typeahead] = useState(() => createTypeahead())
  const [virtualKeydownHook] = useState(() => createEventHook<KeyboardEvent>())
  const isVirtual = useRef(false)
  const firstValue = useRef<unknown>(undefined)
  const setRoot = useCallback((node: HTMLElement | null) => collection.setRoot(node), [collection])
  const composedRef = useComposedRefs(ref, setRoot)

  useEffect(() => () => typeahead.dispose(), [typeahead])

  const selectedKeys = useMemo(() => {
    if (multiple && Array.isArray(modelValue)) return modelValue.map(item => getKey(item as T))
    return [getKey((modelValue ?? {}) as T)]
  }, [multiple, modelValue, getKey])

  const expandedItems = useMemo(() => {
    function flattenItems(list: T[], level = 1, parentItem?: T): FlattenedItem<T>[] {
      return list.reduce((acc: FlattenedItem<T>[], item: T, index: number) => {
        const key = getKey(item)
        const children = getChildren(item)
        const isExpanded = expanded.includes(key)
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
            'aria-setsize': list.length,
            'aria-posinset': index + 1,
          },
        })
        if (children && isExpanded) acc.push(...flattenItems(children, level + 1, item))
        return acc
      }, [])
    }
    return flattenItems(items ?? [])
  }, [items, expanded, getKey, getChildren])

  const latest = useRef({
    multiple,
    selectionBehavior,
    propagateSelect,
    bubbleSelect,
    getKey,
    getChildren,
    expanded,
    expandedItems,
    setExpanded,
  })
  latest.current = {
    multiple,
    selectionBehavior,
    propagateSelect,
    bubbleSelect,
    getKey,
    getChildren,
    expanded,
    expandedItems,
    setExpanded,
  }

  const api = useMemo(() => {
    function onSelectItem(value: T, condition: (existing: unknown) => boolean) {
      const { multiple, selectionBehavior } = latest.current
      const model = modelRef.current
      if (multiple && Array.isArray(model)) {
        if (selectionBehavior === 'replace') {
          setModelValue([value])
          firstValue.current = value
        } else {
          const index = model.findIndex(item => condition(item))
          if (index !== -1) setModelValue(model.filter((_, i) => i !== index))
          else setModelValue([...model, value])
        }
      } else if (selectionBehavior === 'replace') setModelValue({ ...value })
      else if (!Array.isArray(model) && condition(model)) setModelValue(undefined)
      else setModelValue({ ...value })
    }
    function handleMultipleReplace(
      intent: FocusIntent,
      currentElement: Element | null,
      getItems: () => { ref: HTMLElement; value?: unknown }[],
      options: unknown[],
    ) {
      if (!firstValue.current || !latest.current.multiple || !Array.isArray(modelRef.current))
        return
      const items = getItems().filter(item => item.ref.dataset.disabled !== '')
      const lastValue = items.find(item => item.ref === currentElement)?.value
      if (!lastValue) return
      let value: unknown[] | null = null
      switch (intent) {
        case 'prev':
        case 'next':
          value = findValuesBetween(options, firstValue.current, lastValue)
          break
        case 'first':
          value = findValuesBetween(options, firstValue.current, options[0])
          break
        case 'last':
          value = findValuesBetween(options, firstValue.current, options.at(-1))
          break
      }
      setModelValue(value)
    }
    function handleBubbleSelect(item: FlattenedItem<T>) {
      const { getKey, getChildren, multiple, expandedItems } = latest.current
      if (item.parentItem != null && Array.isArray(modelRef.current) && multiple) {
        const parentItem = expandedItems.find(
          entry => item.parentItem != null && getKey(entry.value) === getKey(item.parentItem),
        )
        if (parentItem != null) {
          const all = getChildren(parentItem.value)?.every(child =>
            (modelRef.current as T[]).find(value => getKey(value) === getKey(child)),
          )
          const model = modelRef.current as T[]
          if (all) setModelValue([...model, parentItem.value])
          else setModelValue(model.filter(value => getKey(value) !== getKey(parentItem.value)))
          handleBubbleSelect(parentItem)
        }
      }
    }
    function onSelect(value: T) {
      const { getKey, getChildren, multiple, bubbleSelect, propagateSelect, expandedItems } =
        latest.current
      const condition = (base: unknown) => getKey((base ?? {}) as T) === getKey(value)
      const model = modelRef.current
      const exist = multiple && Array.isArray(model) ? model.findIndex(condition) !== -1 : undefined
      onSelectItem(value, condition)
      if (bubbleSelect && multiple && Array.isArray(modelRef.current)) {
        const item = expandedItems.find(entry => getKey(entry.value) === getKey(value))
        if (item != null) handleBubbleSelect(item)
      }
      if (propagateSelect && multiple && Array.isArray(modelRef.current)) {
        const children = flatten<T, any>((getChildren(value) ?? []) as any[])
        const current = modelRef.current as T[]
        if (exist)
          setModelValue(
            [...current].filter(
              item => !children.some(child => getKey((item ?? {}) as T) === getKey(child)),
            ),
          )
        else setModelValue([...current, ...children])
      }
    }
    function onToggle(value: T) {
      const { getKey, getChildren, expanded, setExpanded } = latest.current
      const children = value ? getChildren(value) : undefined
      if (!children) return
      const key = getKey(value) ?? value
      if (expanded.includes(key)) setExpanded(expanded.filter(item => item !== key))
      else setExpanded([...expanded, key])
    }
    return { onSelect, onToggle, handleMultipleReplace }
  }, [modelRef, setModelValue])

  function handleKeydown(event: ReactKeyboardEvent<HTMLElement>) {
    if (isVirtual.current) virtualKeydownHook.trigger(event.nativeEvent)
    else typeahead.handle(event.key, collection.getItems())
  }

  function handleKeydownNavigation(event: ReactKeyboardEvent<HTMLElement>) {
    if (isVirtual.current) return
    const intent = MAP_KEY_TO_FOCUS_INTENT[event.key]!
    void Promise.resolve().then(() =>
      api.handleMultipleReplace(
        intent,
        getActiveElement(),
        () => collection.getItems(),
        latest.current.expandedItems.map(item => item.value),
      ),
    )
  }

  const context = useMemo<TreeRootContextValue<T>>(
    () => ({
      modelValue,
      selectedKeys,
      onSelect: api.onSelect,
      expanded,
      onToggle: api.onToggle,
      items: items ?? [],
      expandedItems,
      getKey,
      getChildren,
      multiple,
      disabled,
      dir,
      propagateSelect,
      bubbleSelect,
      isVirtual,
      virtualKeydownHook,
      collection,
      handleMultipleReplace: api.handleMultipleReplace,
    }),
    [
      modelValue,
      selectedKeys,
      api,
      expanded,
      items,
      expandedItems,
      getKey,
      getChildren,
      multiple,
      disabled,
      dir,
      propagateSelect,
      bubbleSelect,
      virtualKeydownHook,
      collection,
    ],
  )

  return (
    <TreeRootContext value={context as TreeRootContextValue}>
      <RovingFocusGroup {...attrs} asChild orientation="vertical" dir={dir}>
        <Primitive
          ref={composedRef}
          role="tree"
          as={as}
          asChild={asChild}
          aria-multiselectable={multiple ? true : undefined}
          onKeyDown={event => {
            onKeyDown?.(event)
            handleKeydown(event)
            if ((event.key === 'ArrowUp' || event.key === 'ArrowDown') && event.shiftKey)
              handleKeydownNavigation(event)
          }}
        >
          {typeof children === 'function'
            ? children({ flattenItems: expandedItems, modelValue, expanded })
            : children}
        </Primitive>
      </RovingFocusGroup>
    </TreeRootContext>
  )
}

export interface TreeItemEventDetail<T> {
  originalEvent: Event
  value?: T
  isExpanded: boolean
  isSelected: boolean
}

export type TreeItemSelectEvent<T> = CustomEvent<TreeItemEventDetail<T>>
export type TreeItemToggleEvent<T> = CustomEvent<TreeItemEventDetail<T>>

export interface TreeItemSlotProps {
  isExpanded: boolean
  isSelected: boolean
  isIndeterminate: boolean | undefined
  isDisabled: boolean
  handleToggle: () => void
  handleSelect: () => void
}

export interface TreeItemProps<T extends TreeValue = TreeValue>
  extends
    PrimitiveProps,
    Omit<HTMLAttributes<HTMLElement>, 'onSelect' | 'onToggle' | 'children'>,
    DataAttributes {
  value: T
  level: number
  disabled?: boolean
  onSelect?: (event: TreeItemSelectEvent<T>) => void
  onToggle?: (event: TreeItemToggleEvent<T>) => void
  children?: ReactNode | ((props: TreeItemSlotProps) => ReactNode)
  ref?: Ref<HTMLElement>
}

const TREE_SELECT = 'tree.select'
const TREE_TOGGLE = 'tree.toggle'

export function TreeItem<T extends TreeValue = TreeValue>({
  value,
  level,
  disabled,
  as = 'li',
  asChild,
  onSelect,
  onToggle,
  onKeyDown,
  onClick,
  children,
  ref,
  ...attrs
}: TreeItemProps<T>) {
  const context = useTreeRootContext<T>('TreeItem')
  const [element, setElement] = useState<HTMLElement | null>(null)
  const composedRef = useComposedRefs(ref, setElement)
  const key = context.getKey(value)
  const hasChildren = !!context.getChildren(value)
  const isExpanded = context.expanded.includes(key)
  const isSelected = context.selectedKeys.includes(key)
  const isDisabled = context.disabled || !!disabled
  const isIndeterminate = useMemo(() => {
    const model = context.modelValue
    if (context.bubbleSelect && hasChildren && Array.isArray(model)) {
      const children = flatten<T, any>((context.getChildren(value) || []) as any[])
      const found = (child: T) =>
        model.find(item => context.getKey(item as T) === context.getKey(child))
      return children.some(found) && !children.every(found)
    }
    if (context.propagateSelect && isSelected && hasChildren && Array.isArray(model)) {
      const children = flatten<T, any>((context.getChildren(value) || []) as any[])
      return !children.every(child =>
        model.find(item => context.getKey(item as T) === context.getKey(child)),
      )
    }
    return undefined
  }, [context, hasChildren, isSelected, value])
  const latest = useRef({
    isDisabled,
    isExpanded,
    isSelected,
    hasChildren,
    value,
    onSelect,
    onToggle,
  })
  latest.current = { isDisabled, isExpanded, isSelected, hasChildren, value, onSelect, onToggle }

  useLayoutEffect(
    () => (element ? context.collection.register(element, value) : undefined),
    [element, value, context.collection],
  )

  function handleSelect(event: Event) {
    const current = latest.current
    if (current.isDisabled) return
    current.onSelect?.(event as TreeItemSelectEvent<T>)
    if (event.defaultPrevented) return
    context.onSelect(current.value)
  }

  function handleToggle(event: Event) {
    const current = latest.current
    if (current.isDisabled) return
    current.onToggle?.(event as TreeItemToggleEvent<T>)
    if (event.defaultPrevented) return
    context.onToggle(current.value)
  }

  function dispatch(name: string, handler: (event: Event) => void, originalEvent?: Event) {
    if (!originalEvent) return
    const current = latest.current
    const target = originalEvent.target as EventTarget
    const event = new CustomEvent(name, {
      bubbles: false,
      cancelable: true,
      detail: {
        originalEvent,
        value: current.value,
        isExpanded: current.isExpanded,
        isSelected: current.isSelected,
      },
    })
    target.addEventListener(name, handler, { once: true })
    target.dispatchEvent(event)
  }

  function handleKeydownRight(event: Event) {
    if (latest.current.isDisabled || !latest.current.hasChildren) return
    if (latest.current.isExpanded) {
      const collection = context.collection.getItems().map(item => item.ref)
      const currentIndex = collection.indexOf(getActiveElement() as HTMLElement)
      const list = [...collection].slice(currentIndex)
      const nextElement = list.find(item => Number(item.getAttribute('data-indent')) === level + 1)
      nextElement?.focus()
    } else dispatch(TREE_TOGGLE, handleToggle, event)
  }

  function handleKeydownLeft(event: Event) {
    if (latest.current.isDisabled) return
    if (latest.current.isExpanded) dispatch(TREE_TOGGLE, handleToggle, event)
    else {
      const collection = context.collection.getItems().map(item => item.ref)
      const currentIndex = collection.indexOf(getActiveElement() as HTMLElement)
      const list = [...collection].slice(0, currentIndex).reverse()
      const parentElement = list.find(
        item => Number(item.getAttribute('data-indent')) === level - 1,
      )
      parentElement?.focus()
    }
  }

  const slotProps: TreeItemSlotProps = {
    isExpanded,
    isSelected,
    isIndeterminate,
    isDisabled,
    handleToggle: () => context.onToggle(value),
    handleSelect: () => context.onSelect(value),
  }

  return (
    <RovingFocusItem asChild focusable={!isDisabled} allowShiftKey>
      <Primitive
        {...attrs}
        ref={composedRef}
        role="treeitem"
        as={as}
        asChild={asChild}
        aria-selected={isSelected}
        aria-expanded={hasChildren ? isExpanded : undefined}
        aria-level={level}
        aria-disabled={isDisabled ? true : undefined}
        data-indent={String(level)}
        data-selected={isSelected ? '' : undefined}
        data-expanded={isExpanded ? '' : undefined}
        data-disabled={isDisabled ? '' : undefined}
        onKeyDown={(event: ReactKeyboardEvent<HTMLElement>) => {
          onKeyDown?.(event)
          const native = event.nativeEvent
          if (
            (event.key === 'Enter' || event.key === ' ') &&
            event.target === event.currentTarget
          ) {
            event.preventDefault()
            dispatch(TREE_SELECT, handleSelect, native)
          }
          if (event.key === 'ArrowRight') {
            event.preventDefault()
            if (context.dir === 'ltr') handleKeydownRight(native)
            else handleKeydownLeft(native)
          }
          if (event.key === 'ArrowLeft') {
            event.preventDefault()
            if (context.dir === 'ltr') handleKeydownLeft(native)
            else handleKeydownRight(native)
          }
        }}
        onClick={(event: MouseEvent<HTMLElement>) => {
          event.stopPropagation()
          onClick?.(event)
          dispatch(TREE_SELECT, handleSelect, event.nativeEvent)
          dispatch(TREE_TOGGLE, handleToggle, event.nativeEvent)
        }}
      >
        {typeof children === 'function' ? children(slotProps) : children}
      </Primitive>
    </RovingFocusItem>
  )
}
