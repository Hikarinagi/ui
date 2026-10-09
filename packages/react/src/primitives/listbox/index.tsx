'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type FocusEvent,
  type FormEvent,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type CompositionEvent as ReactCompositionEvent,
  type ReactNode,
  type Ref,
} from 'react'
import { flushSync } from 'react-dom'
import { Primitive, type PrimitiveProps } from '../../lib/primitive'
import { getFocusIntent } from '../roving-focus/utils'
import { VisuallyHiddenInput, useFormControl } from '../utils/hidden-input'
import { useBoundValue } from '../utils/bound-value'
import { useComposing } from '../utils/composing'
import {
  COLLECTION_ITEM,
  compare,
  createCollection,
  createEventHook,
  createTypeahead,
  findValuesBetween,
  valueComparator,
  type Collection,
  type CollectionEntry,
  type Comparator,
  type EventHook,
} from './utils'
import { useVModel } from './useVModel'
import { composeEventHandlers } from '../utils/compose-event-handlers'
import { useComposedRefs } from '../utils/compose-refs'
import { useDirection } from '../utils/direction'

export {
  COLLECTION_ITEM,
  compare,
  createCollection,
  createEventHook,
  createTypeahead,
  getNextMatch,
  valueComparator,
} from './utils'
export type { Collection, CollectionEntry, Comparator, EventHook, Typeahead } from './utils'

type DataAttributes = { [attribute: `data-${string}`]: string | undefined }
type Orientation = 'vertical' | 'horizontal'
type Direction = 'ltr' | 'rtl'

export interface ListboxVirtualFocus {
  event?: Event
  scroll: boolean
}

export interface ListboxRootContextValue {
  modelValue: unknown
  getModelValue: () => unknown
  setModelValue: (value: unknown) => void
  onValueChange: (value: unknown) => void
  multiple: boolean
  orientation: Orientation
  dir: Direction
  disabled: boolean
  highlightOnHover: boolean
  highlightedElement: HTMLElement | null
  getHighlightedElement: () => HTMLElement | null
  setHighlightedElement: (element: HTMLElement | null) => void
  isVirtual: { current: boolean }
  virtualFocusHook: EventHook<ListboxVirtualFocus>
  virtualKeydownHook: EventHook<KeyboardEvent>
  virtualHighlightHook: EventHook<unknown>
  by?: Comparator
  firstValue: { current: unknown }
  selectionBehavior: 'toggle' | 'replace'
  focusable: boolean
  getFocusable: () => boolean
  setFocusable: (focusable: boolean) => void
  collection: Collection<unknown>
  getItems: (includeDisabledItem?: boolean) => CollectionEntry<unknown>[]
  onLeave: (event: Event) => void
  onEnter: (event: Event) => void
  changeHighlight: (
    element: HTMLElement | null | undefined,
    scrollIntoView?: boolean,
    focus?: boolean,
  ) => void
  highlightItem: (value: unknown) => void
  highlightSelected: (event?: Event, scroll?: boolean) => Promise<void>
  onKeydownEnter: (event: KeyboardEvent) => void
  onKeydownNavigation: (event: KeyboardEvent) => void
  onKeydownTypeAhead: (event: KeyboardEvent) => void
  onCompositionStart: () => void
  onCompositionEnd: () => void
  highlightFirstItem: () => void
}

const ListboxRootContext = createContext<ListboxRootContextValue | null>(null)

export function useListboxRootContext(consumer = 'ListboxRoot') {
  const context = useContext(ListboxRootContext)
  if (!context) throw new Error(`\`${consumer}\` must be used within \`ListboxRoot\``)
  return context
}

export function useOptionalListboxRootContext() {
  return useContext(ListboxRootContext)
}

export interface ListboxHighlightScrollContextValue {
  suppressHighlightScroll: boolean
  onHighlightScrollRequest: (scroll?: () => void) => void
}

const ListboxHighlightScrollContext = createContext<ListboxHighlightScrollContextValue | null>(null)

export function ListboxHighlightScrollProvider({
  value,
  children,
}: {
  value: ListboxHighlightScrollContextValue
  children?: ReactNode
}) {
  return <ListboxHighlightScrollContext value={value}>{children}</ListboxHighlightScrollContext>
}

const noHighlightScroll: ListboxHighlightScrollContextValue = {
  suppressHighlightScroll: false,
  onHighlightScrollRequest: () => {},
}

function nextTick() {
  return Promise.resolve()
}

export interface ListboxRootProps
  extends
    PrimitiveProps,
    Omit<HTMLAttributes<HTMLElement>, 'dir' | 'defaultValue'>,
    DataAttributes {
  value?: unknown
  defaultValue?: unknown
  onValueChange?: (value: unknown) => void
  multiple?: boolean
  orientation?: Orientation
  dir?: Direction
  disabled?: boolean
  selectionBehavior?: 'toggle' | 'replace'
  highlightOnHover?: boolean
  by?: Comparator
  name?: string
  required?: boolean
  onHighlight?: (item: CollectionEntry<unknown> | undefined) => void
  onEntryFocus?: (event: CustomEvent) => void
  onLeave?: (event: Event) => void
  ref?: Ref<HTMLElement>
}

export function ListboxRoot({
  value: valueProp,
  defaultValue,
  onValueChange,
  multiple = false,
  orientation = 'vertical',
  dir: dirProp,
  disabled = false,
  selectionBehavior = 'toggle',
  highlightOnHover = false,
  by,
  name,
  required,
  onHighlight,
  onEntryFocus,
  onLeave,
  onPointerLeave,
  onBlur,
  ref,
  children,
  ...attrs
}: ListboxRootProps) {
  const dir = useDirection(dirProp)
  const highlightScroll = useContext(ListboxHighlightScrollContext)
  const [modelValue, setModel] = useVModel<unknown>(
    valueProp,
    defaultValue ?? (multiple ? [] : undefined),
    onValueChange,
  )
  const [highlightedElement, setHighlightedState] = useState<HTMLElement | null>(null)
  const [focusable, setFocusableState] = useState(true)
  const [collection] = useState(() => createCollection<unknown>())
  const [typeahead] = useState(() => createTypeahead())
  const [hooks] = useState(() => ({
    virtualFocusHook: createEventHook<ListboxVirtualFocus>(),
    virtualKeydownHook: createEventHook<KeyboardEvent>(),
    virtualHighlightHook: createEventHook<unknown>(),
  }))
  const element = useRef<HTMLElement | null>(null)
  const [rootElement, setRootElement] = useState<HTMLElement | null>(null)
  const composedRef = useComposedRefs(ref, element, setRootElement)
  const isFormControl = useFormControl(rootElement)
  const firstValue = useRef<unknown>(undefined)
  const isVirtual = useRef(false)
  const isUserAction = useRef(false)
  const isComposing = useRef(false)
  const previousElement = useRef<HTMLElement | null>(null)
  const highlightedRef = useRef<HTMLElement | null>(null)
  const focusableRef = useRef(true)
  const modelRef = useRef<unknown>(modelValue)
  modelRef.current = modelValue
  const latest = useRef({
    multiple,
    orientation,
    dir,
    selectionBehavior,
    by,
    highlightScroll,
    onHighlight,
    onEntryFocus,
    onLeave,
    setModel,
  })
  latest.current = {
    multiple,
    orientation,
    dir,
    selectionBehavior,
    by,
    highlightScroll,
    onHighlight,
    onEntryFocus,
    onLeave,
    setModel,
  }

  useEffect(() => () => typeahead.dispose(), [typeahead])

  const api = useMemo(() => {
    function setModelValue(value: unknown) {
      modelRef.current = value
      latest.current.setModel(value)
    }
    function setHighlightedElement(next: HTMLElement | null) {
      highlightedRef.current = next
      setHighlightedState(next)
    }
    function setFocusable(next: boolean) {
      focusableRef.current = next
      setFocusableState(next)
    }
    function userAction() {
      isUserAction.current = true
      setTimeout(() => {
        isUserAction.current = false
      }, 1)
    }
    function onValueChange(value: unknown) {
      const { multiple, selectionBehavior, by } = latest.current
      isUserAction.current = true
      const model = modelRef.current
      if (multiple) {
        const modelArray = Array.isArray(model) ? [...model] : []
        const index = modelArray.findIndex(item => compare(item, value, by))
        if (selectionBehavior === 'toggle') {
          if (index === -1) modelArray.push(value)
          else modelArray.splice(index, 1)
          setModelValue(modelArray)
        } else {
          setModelValue([value])
          firstValue.current = value
        }
      } else if (selectionBehavior === 'toggle') {
        if (compare(model, value, by)) setModelValue(undefined)
        else setModelValue(value)
      } else setModelValue(value)
      setTimeout(() => {
        isUserAction.current = false
      }, 1)
    }
    function getCollectionItem() {
      return collection
        .getItems()
        .map(item => item.ref)
        .filter(item => item.dataset.disabled !== '')
    }
    function changeHighlight(
      target: HTMLElement | null | undefined,
      scrollIntoView = true,
      focus?: boolean,
    ) {
      if (!target) return
      setHighlightedElement(target)
      const scroll = latest.current.highlightScroll
      const suppress = scroll?.suppressHighlightScroll ?? false
      if (focus ?? focusableRef.current) {
        if (suppress) target.focus({ preventScroll: true })
        else target.focus()
      }
      if (suppress)
        scroll?.onHighlightScrollRequest(
          scrollIntoView
            ? () => {
                const current = highlightedRef.current
                if (current?.isConnected) current.scrollIntoView({ block: 'nearest' })
              }
            : undefined,
        )
      else if (scrollIntoView) target.scrollIntoView({ block: 'nearest' })
      latest.current.onHighlight?.(collection.getItems().find(item => item.ref === target))
    }
    function highlightItem(value: unknown) {
      if (isVirtual.current) hooks.virtualHighlightHook.trigger(value)
      else {
        const item = collection
          .getItems()
          .find(entry => compare(entry.value, value, latest.current.by))
        if (item) {
          setHighlightedElement(item.ref)
          changeHighlight(item.ref)
        }
      }
    }
    function onKeydownEnter(event: KeyboardEvent) {
      const current = highlightedRef.current
      if (current && current.isConnected) {
        if (event.ctrlKey || event.metaKey || event.altKey) return
        event.preventDefault()
        event.stopPropagation()
        if (!isComposing.current) current.click()
      }
    }
    function handleMultipleReplace(event: KeyboardEvent, target: HTMLElement | undefined) {
      const { selectionBehavior, multiple } = latest.current
      if (
        isVirtual.current ||
        selectionBehavior !== 'replace' ||
        !multiple ||
        !Array.isArray(modelRef.current)
      )
        return
      const isMetaKey = event.altKey || event.ctrlKey || event.metaKey
      if (isMetaKey && !event.shiftKey) return
      if (event.shiftKey) {
        const items = collection.getItems().filter(item => item.ref.dataset.disabled !== '')
        let lastValue = items.find(item => item.ref === target)?.value
        if (event.key === 'End') lastValue = items.at(-1)?.value
        else if (event.key === 'Home') lastValue = items[0]?.value
        if (!lastValue || !firstValue.current) return
        setModelValue(
          findValuesBetween(
            items.map(item => item.value),
            firstValue.current,
            lastValue,
          ),
        )
      }
    }
    function onKeydownNavigation(event: KeyboardEvent) {
      const intent = getFocusIntent(event, latest.current.orientation, latest.current.dir)
      if (!intent) return
      let items = getCollectionItem()
      const current = highlightedRef.current
      if (current) {
        if (intent === 'last') items.reverse()
        else if (intent === 'prev' || intent === 'next') {
          if (intent === 'prev') items.reverse()
          const currentIndex = items.indexOf(current)
          items = items.slice(currentIndex + 1)
        }
        handleMultipleReplace(event, items[0])
      }
      if (items.length) {
        const index = !current && intent === 'prev' ? items.length - 1 : 0
        changeHighlight(items[index])
      }
      if (isVirtual.current) hooks.virtualKeydownHook.trigger(event)
    }
    function onKeydownTypeAhead(event: KeyboardEvent) {
      if (!focusableRef.current) return
      isUserAction.current = true
      if (isVirtual.current) hooks.virtualKeydownHook.trigger(event)
      else {
        const isMetaKey = event.altKey || event.ctrlKey || event.metaKey
        if (isMetaKey && event.key === 'a' && latest.current.multiple) {
          const items = collection.getItems()
          setModelValue(items.map(item => item.value))
          event.preventDefault()
          const lastItem = items.at(-1)
          if (lastItem) changeHighlight(lastItem.ref)
        } else if (!isMetaKey) {
          const found = typeahead.handle(event.key, collection.getItems())
          if (found) changeHighlight(found)
        }
      }
      setTimeout(() => {
        isUserAction.current = false
      }, 1)
    }
    function onCompositionStart() {
      isComposing.current = true
    }
    function onCompositionEnd() {
      void nextTick().then(() => {
        isComposing.current = false
      })
    }
    function highlightFirstItem() {
      void nextTick().then(() => {
        onKeydownNavigation(new KeyboardEvent('keydown', { key: 'PageUp' }))
      })
    }
    function onLeave(event: Event) {
      const current = highlightedRef.current
      if (current?.isConnected) previousElement.current = current
      setHighlightedElement(null)
      latest.current.onLeave?.(event)
    }
    function onEnter(event: Event) {
      const entryFocusEvent = new CustomEvent('listbox.entryFocus', {
        bubbles: false,
        cancelable: true,
      })
      event.currentTarget?.dispatchEvent(entryFocusEvent)
      latest.current.onEntryFocus?.(entryFocusEvent)
      if (entryFocusEvent.defaultPrevented) return
      if (previousElement.current) changeHighlight(previousElement.current)
      else changeHighlight(getCollectionItem()[0])
    }
    async function highlightSelected(event?: Event, scroll = true) {
      await nextTick()
      if (isVirtual.current) hooks.virtualFocusHook.trigger({ event, scroll })
      else {
        const items = getCollectionItem()
        const item = items.find(entry => entry.dataset.state === 'checked')
        const focus = scroll ? undefined : false
        if (item) changeHighlight(item, scroll, focus)
        else if (items.length) changeHighlight(items[0], scroll, focus)
      }
    }
    return {
      setModelValue,
      setHighlightedElement,
      setFocusable,
      userAction,
      onValueChange,
      changeHighlight,
      highlightItem,
      onKeydownEnter,
      onKeydownNavigation,
      onKeydownTypeAhead,
      onCompositionStart,
      onCompositionEnd,
      highlightFirstItem,
      onLeave,
      onEnter,
      highlightSelected,
      getItems: (includeDisabledItem?: boolean) => collection.getItems(includeDisabledItem),
      getModelValue: () => modelRef.current,
      getHighlightedElement: () => highlightedRef.current,
      getFocusable: () => focusableRef.current,
    }
  }, [collection, hooks, typeahead])

  const apiRef = useRef(api)
  apiRef.current = api
  const highlightedModel = useRef<{ value: unknown } | null>(null)
  useEffect(() => {
    if (isUserAction.current) return
    const previous = highlightedModel.current
    if (previous && Object.is(previous.value, modelValue)) return
    highlightedModel.current = { value: modelValue }
    const scroll = previous !== null
    void nextTick().then(() => apiRef.current.highlightSelected(undefined, scroll))
  }, [modelValue])

  const value = useMemo<ListboxRootContextValue>(
    () => ({
      ...api,
      ...hooks,
      modelValue,
      multiple,
      orientation,
      dir,
      disabled,
      highlightOnHover,
      highlightedElement,
      isVirtual,
      by,
      firstValue,
      selectionBehavior,
      focusable,
      collection,
    }),
    [
      api,
      hooks,
      modelValue,
      multiple,
      orientation,
      dir,
      disabled,
      highlightOnHover,
      highlightedElement,
      by,
      selectionBehavior,
      focusable,
      collection,
    ],
  )

  return (
    <ListboxRootContext value={value}>
      <ListboxHighlightScrollContext value={noHighlightScroll}>
        <Primitive
          dir={dir}
          data-disabled={disabled ? '' : undefined}
          {...attrs}
          ref={composedRef}
          onPointerLeave={composeEventHandlers(onPointerLeave, (event: PointerEvent<HTMLElement>) =>
            api.onLeave(event.nativeEvent),
          )}
          onBlur={composeEventHandlers(onBlur, (event: FocusEvent<HTMLElement>) => {
            const target = (event.relatedTarget || event.target) as Node | null
            const native = event.nativeEvent
            void nextTick().then(() => {
              if (highlightedRef.current && element.current && !element.current.contains(target))
                api.onLeave(native)
            })
          })}
        >
          {children}
          {isFormControl && name ? (
            <VisuallyHiddenInput
              name={name}
              value={modelValue}
              disabled={disabled}
              required={required}
            />
          ) : null}
        </Primitive>
      </ListboxHighlightScrollContext>
    </ListboxRootContext>
  )
}

const NAVIGATION_KEYS = ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Home', 'End']

export interface ListboxContentProps
  extends PrimitiveProps, HTMLAttributes<HTMLElement>, DataAttributes {
  ref?: Ref<HTMLElement>
}

export function ListboxContent({
  onMouseDown,
  onFocus,
  onKeyDown,
  ref,
  ...props
}: ListboxContentProps) {
  const context = useListboxRootContext('ListboxContent')
  const isClickFocus = useRef(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const setRoot = useCallback(
    (node: HTMLElement | null) => context.collection.setRoot(node),
    [context.collection],
  )
  const composedRef = useComposedRefs(ref, setRoot)

  useEffect(() => () => clearTimeout(timer.current), [])

  return (
    <Primitive
      {...props}
      ref={composedRef}
      role="listbox"
      tabIndex={context.focusable ? (context.highlightedElement ? -1 : 0) : -1}
      aria-orientation={context.orientation}
      aria-multiselectable={!!context.multiple}
      data-orientation={context.orientation}
      onMouseDown={composeEventHandlers(onMouseDown, (event: MouseEvent<HTMLElement>) => {
        if (event.button !== 0) return
        isClickFocus.current = true
        clearTimeout(timer.current)
        timer.current = setTimeout(() => {
          isClickFocus.current = false
        }, 10)
      })}
      onFocus={composeEventHandlers(onFocus, (event: FocusEvent<HTMLElement>) => {
        if (event.target !== event.currentTarget || isClickFocus.current) return
        context.onEnter(event.nativeEvent)
      })}
      onKeyDown={composeEventHandlers(onKeyDown, (event: ReactKeyboardEvent<HTMLElement>) => {
        const native = event.nativeEvent
        if (NAVIGATION_KEYS.includes(event.key)) {
          const crossAxis =
            (context.orientation === 'vertical' &&
              (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) ||
            (context.orientation === 'horizontal' &&
              (event.key === 'ArrowUp' || event.key === 'ArrowDown'))
          if (!crossAxis) {
            event.preventDefault()
            if (context.getFocusable()) context.onKeydownNavigation(native)
          }
        }
        if (event.key === 'Enter') context.onKeydownEnter(native)
        context.onKeydownTypeAhead(native)
      })}
    />
  )
}

interface ListboxItemContextValue {
  isSelected: boolean
}

const ListboxItemContext = createContext<ListboxItemContextValue | null>(null)

export function useListboxItemContext(consumer = 'ListboxItem') {
  const context = useContext(ListboxItemContext)
  if (!context) throw new Error(`\`${consumer}\` must be used within \`ListboxItem\``)
  return context
}

export type ListboxSelectEvent = CustomEvent<{ originalEvent: Event; value: unknown }>

export interface ListboxItemProps
  extends PrimitiveProps, Omit<HTMLAttributes<HTMLElement>, 'onSelect'>, DataAttributes {
  value: unknown
  disabled?: boolean
  onSelect?: (event: ListboxSelectEvent) => void
  ref?: Ref<HTMLElement>
}

export function ListboxItem({
  value,
  disabled: disabledProp,
  as = 'div',
  asChild,
  onSelect,
  onClick,
  onKeyDown,
  onPointerMove,
  ref,
  ...attrs
}: ListboxItemProps) {
  const context = useListboxRootContext('ListboxItem')
  const id = useId()
  const [element, setElement] = useState<HTMLElement | null>(null)
  const composedRef = useComposedRefs(ref, setElement)
  const isHighlighted = element != null && element === context.highlightedElement
  const isSelected = valueComparator(context.modelValue, value, context.by)
  const disabled = context.disabled || !!disabledProp
  const latest = useRef({ value, disabled, onSelect, element })
  latest.current = { value, disabled, onSelect, element }

  useLayoutEffect(
    () => (element ? context.collection.register(element, value) : undefined),
    [element, value, context.collection],
  )

  function handleSelect(event: Event) {
    const current = latest.current
    current.onSelect?.(event as ListboxSelectEvent)
    if (event.defaultPrevented) return
    if (!current.disabled) {
      context.onValueChange(current.value)
      context.changeHighlight(current.element)
    }
  }

  function handleSelectCustomEvent(originalEvent: Event) {
    const target = originalEvent.target as EventTarget
    const event = new CustomEvent('listbox.select', {
      bubbles: false,
      cancelable: true,
      detail: { originalEvent, value: latest.current.value },
    })
    target.addEventListener('listbox.select', handleSelect, { once: true })
    target.dispatchEvent(event)
  }

  const itemContext = useMemo(() => ({ isSelected }), [isSelected])

  return (
    <ListboxItemContext value={itemContext}>
      <Primitive
        id={id}
        {...attrs}
        {...{ [COLLECTION_ITEM]: '' }}
        {...({ disabled: disabled || undefined } as object)}
        ref={composedRef}
        role="option"
        tabIndex={context.focusable ? (isHighlighted ? 0 : -1) : -1}
        aria-selected={isSelected}
        as={as}
        asChild={asChild}
        data-disabled={disabled ? '' : undefined}
        data-highlighted={isHighlighted ? '' : undefined}
        data-state={isSelected ? 'checked' : 'unchecked'}
        onClick={composeEventHandlers(onClick, (event: MouseEvent<HTMLElement>) =>
          handleSelectCustomEvent(event.nativeEvent),
        )}
        onKeyDown={composeEventHandlers(onKeyDown, (event: ReactKeyboardEvent<HTMLElement>) => {
          if (event.key !== ' ') return
          event.preventDefault()
          handleSelectCustomEvent(event.nativeEvent)
        })}
        onPointerMove={composeEventHandlers(onPointerMove, () => {
          if (context.getHighlightedElement() === element) return
          if (context.highlightOnHover) context.changeHighlight(element, false, false)
        })}
      />
    </ListboxItemContext>
  )
}

interface ListboxGroupContextValue {
  id: string
}

const ListboxGroupContext = createContext<ListboxGroupContextValue>({ id: '' })

export interface ListboxGroupProps
  extends PrimitiveProps, HTMLAttributes<HTMLElement>, DataAttributes {
  ref?: Ref<HTMLElement>
}

export function ListboxGroup({ as, asChild, ...attrs }: ListboxGroupProps) {
  const id = useId()
  const context = useMemo(() => ({ id }), [id])
  return (
    <ListboxGroupContext value={context}>
      <Primitive role="group" as={as} asChild={asChild} aria-labelledby={id} {...attrs} />
    </ListboxGroupContext>
  )
}

export interface ListboxGroupLabelProps
  extends PrimitiveProps, HTMLAttributes<HTMLElement>, DataAttributes {
  ref?: Ref<HTMLElement>
}

export function ListboxGroupLabel({ as = 'div', asChild, ...attrs }: ListboxGroupLabelProps) {
  const group = useContext(ListboxGroupContext)
  return <Primitive as={as} asChild={asChild} {...attrs} id={group.id} />
}

export interface ListboxItemIndicatorProps
  extends PrimitiveProps, HTMLAttributes<HTMLElement>, DataAttributes {
  ref?: Ref<HTMLElement>
}

export function ListboxItemIndicator({
  as = 'span',
  asChild,
  ...attrs
}: ListboxItemIndicatorProps) {
  const item = useListboxItemContext('ListboxItemIndicator')
  if (!item.isSelected) return null
  return <Primitive aria-hidden="true" as={as} asChild={asChild} {...attrs} />
}

export interface ListboxFilterProps
  extends
    PrimitiveProps,
    Omit<
      InputHTMLAttributes<HTMLInputElement>,
      'value' | 'defaultValue' | 'disabled' | 'autoFocus' | 'children'
    >,
    DataAttributes {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  autoFocus?: boolean
  disabled?: boolean
  children?: ReactNode
  ref?: Ref<HTMLInputElement>
}

const FILTER_NAVIGATION_KEYS = ['ArrowDown', 'ArrowUp', 'Home', 'End']

export function ListboxFilter({
  value,
  defaultValue,
  onValueChange,
  autoFocus,
  disabled: disabledProp,
  as = 'input',
  asChild,
  onInput,
  onKeyDown,
  onCompositionStart,
  onCompositionUpdate,
  onCompositionEnd,
  children,
  ref,
  ...attrs
}: ListboxFilterProps) {
  const root = useListboxRootContext('ListboxFilter')
  const [model, setModel] = useVModel<string>(value, defaultValue ?? '', onValueChange)
  const element = useRef<HTMLInputElement | null>(null)
  const composedRef = useComposedRefs(ref, element)
  const disabled = !!disabledProp || root.disabled
  const bound = useBoundValue(element, model)
  const latest = useRef({ autoFocus, root })
  latest.current = { autoFocus, root }
  const composing = useComposing(event => {
    const { root } = latest.current
    flushSync(() => setModel((event.target as HTMLInputElement).value))
    root.onCompositionEnd()
    root.highlightFirstItem()
  })
  const setFocusable = root.setFocusable

  useEffect(() => {
    setFocusable(false)
    const timer = setTimeout(() => {
      if (latest.current.autoFocus) element.current?.focus()
    }, 1)
    return () => {
      clearTimeout(timer)
      setFocusable(true)
    }
  }, [setFocusable])

  return (
    <Primitive
      as={as}
      asChild={asChild}
      {...bound}
      {...({ disabled: disabled || undefined } as object)}
      data-disabled={disabled ? '' : undefined}
      aria-disabled={disabled}
      aria-activedescendant={root.highlightedElement?.id}
      {...({ type: 'text' } as object)}
      {...(attrs as HTMLAttributes<HTMLElement>)}
      {...(asChild || as !== 'input' ? { children } : {})}
      ref={composedRef as Ref<HTMLElement>}
      onKeyDown={(event: ReactKeyboardEvent<HTMLElement>) => {
        if (FILTER_NAVIGATION_KEYS.includes(event.key) && !composing.isComposing) {
          event.preventDefault()
          root.onKeydownNavigation(event.nativeEvent)
        }
        if (event.key === 'Enter' && !composing.isComposing) root.onKeydownEnter(event.nativeEvent)
        onKeyDown?.(event as ReactKeyboardEvent<HTMLInputElement>)
      }}
      onInput={(event: FormEvent<HTMLElement>) => {
        if (!composing.shouldDeferInput) {
          setModel((event.target as HTMLInputElement).value)
          root.highlightFirstItem()
        }
        onInput?.(event as unknown as Parameters<NonNullable<typeof onInput>>[0])
      }}
      onCompositionStart={(event: ReactCompositionEvent<HTMLElement>) => {
        root.onCompositionStart()
        composing.handleCompositionStart()
        onCompositionStart?.(event as ReactCompositionEvent<HTMLInputElement>)
      }}
      onCompositionUpdate={(event: ReactCompositionEvent<HTMLElement>) => {
        composing.handleCompositionUpdate(event.nativeEvent)
        onCompositionUpdate?.(event as ReactCompositionEvent<HTMLInputElement>)
      }}
      onCompositionEnd={(event: ReactCompositionEvent<HTMLElement>) => {
        composing.handleCompositionEnd(event.nativeEvent)
        onCompositionEnd?.(event as ReactCompositionEvent<HTMLInputElement>)
      }}
    />
  )
}

export { ListboxVirtualizer } from './virtualizer'
export type { ListboxVirtualizerProps, ListboxVirtualizerSlotProps } from './virtualizer'
