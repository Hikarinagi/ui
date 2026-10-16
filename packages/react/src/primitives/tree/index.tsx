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
  type Collection,
  type EventHook,
} from '../listbox/utils'
import { useVModel } from '../listbox/useVModel'
import {
  dispatchTreeItemEvent,
  flattenTree,
  nextTreeSelection,
  toggleTreeExpanded,
  treeChildTarget,
  treeIndeterminate,
  treeParentTarget,
  treeRangeValues,
  treeSelectedKeys,
  TREE_KEY_TO_INTENT,
  TREE_SELECT,
  TREE_TOGGLE,
  type FlattenedItem,
  type TreeItemEventDetail,
  type TreeItemSelectEvent,
  type TreeItemToggleEvent,
} from '../../../../shared/src/primitives/tree'
import { useComposedRefs } from '../utils/compose-refs'
import { useDirection } from '../utils/direction'

export { flatten } from '../../../../shared/src/primitives/tree'
export type { FlattenedItem, TreeItemEventDetail, TreeItemSelectEvent, TreeItemToggleEvent }

type DataAttributes = { [attribute: `data-${string}`]: string | undefined }
type Direction = 'ltr' | 'rtl'
type FocusIntent = 'first' | 'last' | 'prev' | 'next'
type TreeValue = Record<string, any>

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
    intent: FocusIntent | undefined,
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

  const selectedKeys = useMemo(
    () => treeSelectedKeys(modelValue, multiple, getKey),
    [multiple, modelValue, getKey],
  )

  const expandedItems = useMemo(
    () => flattenTree(items ?? [], { getKey, getChildren }, expanded),
    [items, expanded, getKey, getChildren],
  )

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
    function handleMultipleReplace(
      intent: FocusIntent | undefined,
      currentElement: Element | null,
      getItems: () => { ref: HTMLElement; value?: unknown }[],
      options: unknown[],
    ) {
      const value = treeRangeValues(intent, currentElement, getItems(), options, {
        firstValue: firstValue.current,
        multiple: latest.current.multiple,
        model: modelRef.current,
      })
      if (value !== undefined) setModelValue(value)
    }
    function onSelect(value: T) {
      const next = nextTreeSelection(modelRef.current, value, {
        ...latest.current,
        flattened: latest.current.expandedItems,
      })
      if (next.anchor) firstValue.current = value
      setModelValue(next.value)
    }
    function onToggle(value: T) {
      const { getKey, getChildren, expanded, setExpanded } = latest.current
      const children = value ? getChildren(value) : undefined
      if (!children) return
      setExpanded(toggleTreeExpanded(expanded, getKey(value) ?? value))
    }
    return { onSelect, onToggle, handleMultipleReplace }
  }, [modelRef, setModelValue])

  function handleKeydown(event: ReactKeyboardEvent<HTMLElement>) {
    if (isVirtual.current) virtualKeydownHook.trigger(event.nativeEvent)
    else typeahead.handle(event.key, collection.getItems())
  }

  function handleKeydownNavigation(event: ReactKeyboardEvent<HTMLElement>) {
    if (isVirtual.current) return
    const intent = TREE_KEY_TO_INTENT[event.key]
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
  const isIndeterminate = useMemo(
    () =>
      treeIndeterminate({
        value,
        model: context.modelValue,
        isSelected,
        hasChildren,
        bubbleSelect: context.bubbleSelect,
        propagateSelect: context.propagateSelect,
        getKey: context.getKey,
        getChildren: context.getChildren,
      }),
    [context, hasChildren, isSelected, value],
  )
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

  function handleSelect(event: TreeItemSelectEvent<T>) {
    const current = latest.current
    if (current.isDisabled) return
    current.onSelect?.(event)
    if (event.defaultPrevented) return
    context.onSelect(current.value)
  }

  function handleToggle(event: TreeItemToggleEvent<T>) {
    const current = latest.current
    if (current.isDisabled) return
    current.onToggle?.(event)
    if (event.defaultPrevented) return
    context.onToggle(current.value)
  }

  function dispatch(
    name: typeof TREE_SELECT | typeof TREE_TOGGLE,
    handler: (event: CustomEvent<TreeItemEventDetail<T>>) => void,
    originalEvent?: Event,
  ) {
    if (!originalEvent) return
    const current = latest.current
    dispatchTreeItemEvent(name, handler, {
      originalEvent,
      value: current.value,
      isExpanded: current.isExpanded,
      isSelected: current.isSelected,
    })
  }

  function collection() {
    return context.collection.getItems().map(item => item.ref)
  }

  function handleKeydownRight(event: Event) {
    if (latest.current.isDisabled || !latest.current.hasChildren) return
    if (latest.current.isExpanded) treeChildTarget(collection(), getActiveElement(), level)?.focus()
    else dispatch(TREE_TOGGLE, handleToggle, event)
  }

  function handleKeydownLeft(event: Event) {
    if (latest.current.isDisabled) return
    if (latest.current.isExpanded) dispatch(TREE_TOGGLE, handleToggle, event)
    else treeParentTarget(collection(), getActiveElement(), level)?.focus()
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
