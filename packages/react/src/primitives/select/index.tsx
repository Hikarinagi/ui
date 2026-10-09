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
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type Ref,
  type SelectHTMLAttributes,
  type TouchEvent,
} from 'react'
import { hideOthers } from 'aria-hidden'
import { usePortalContainer } from '../../lib/config'
import { Primitive, type PrimitiveProps } from '../../lib/primitive'
import { useBodyScrollLock } from '../body-scroll-lock'
import { PrimitiveVisuallyHidden } from '../visually-hidden'
import { PopperContent, PopperRoot, PopperVirtualAnchor, type PopperContentProps } from '../popper'
import {
  guardLayer,
  type FocusOutsideEvent,
  type PointerDownOutsideEvent,
} from '../utils/dismissable'
import {
  COLLECTION_ITEM,
  compare,
  createCollection,
  createTypeahead,
  valueComparator,
  type Collection,
  type Comparator,
} from '../listbox/utils'
import { useVModel } from '../listbox/useVModel'
import { DismissableLayer } from '../dismissable-layer'
import { FocusScope } from '../focus-scope'
import { Portal as HnPortal } from '../portal'
import { Presence } from '../presence'
import { useCallbackRef } from '../utils/callback-ref'
import { composeEventHandlers } from '../utils/compose-event-handlers'
import { useComposedRefs } from '../utils/compose-refs'
import { useDirection } from '../utils/direction'
import { useFocusGuards } from '../utils/focus-guards'

export type { FocusOutsideEvent, PointerDownOutsideEvent } from '../utils/dismissable'

type DataAttributes = { [attribute: `data-${string}`]: string | undefined }
type Direction = 'ltr' | 'rtl'

const OPEN_KEYS = [' ', 'Enter', 'ArrowUp', 'ArrowDown']
const SELECTION_KEYS = [' ', 'Enter']
const CONTENT_MARGIN = 10
const AUTOFOCUS_ON_UNMOUNT = 'focusScope.autoFocusOnUnmount'

function nextTick() {
  return Promise.resolve()
}

function isNullish(value: unknown) {
  return value === null || value === undefined
}

export function shouldShowPlaceholder(value: unknown) {
  return (
    value === undefined ||
    value === null ||
    value === '' ||
    (Array.isArray(value) && value.length === 0)
  )
}

function focusFirst(candidates: HTMLElement[]) {
  const previouslyFocused = document.activeElement
  for (const candidate of candidates) {
    if (candidate === previouslyFocused) return
    candidate.focus()
    if (document.activeElement !== previouslyFocused) return
  }
}

export interface SelectOptionRecord {
  value: unknown
  disabled?: boolean
  textContent: string
}

export interface SelectRootContextValue {
  triggerElement: HTMLElement | null
  getTriggerElement: () => HTMLElement | null
  onTriggerChange: (element: HTMLElement | null) => void
  contentId: string
  modelValue: unknown
  getModelValue: () => unknown
  onValueChange: (value: unknown) => void
  by?: Comparator
  open: boolean
  getOpen: () => boolean
  onOpenChange: (open: boolean) => void
  multiple: boolean
  required: boolean
  disabled: boolean
  dir: Direction
  triggerPointerDownPosRef: { current: { x: number; y: number } | null }
  isEmptyModelValue: boolean
  optionsSet: SelectOptionRecord[]
  onOptionAdd: (option: SelectOptionRecord) => void
  onOptionRemove: (option: SelectOptionRecord) => void
  collection: Collection<{ textValue: string }>
}

const SelectRootContext = createContext<SelectRootContextValue | null>(null)

export function useSelectRootContext(consumer = 'SelectRoot') {
  const context = useContext(SelectRootContext)
  if (!context) throw new Error(`\`${consumer}\` must be used within \`SelectRoot\``)
  return context
}

export function useOptionalSelectRootContext() {
  return useContext(SelectRootContext)
}

export interface SelectRootProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  value?: unknown
  defaultValue?: unknown
  onValueChange?: (value: unknown) => void
  nullableValue?: string
  by?: Comparator
  dir?: Direction
  multiple?: boolean
  autocomplete?: string
  disabled?: boolean
  name?: string
  required?: boolean
  children?: ReactNode
}

export function SelectRoot({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  value: valueProp,
  defaultValue,
  onValueChange,
  nullableValue = '',
  by,
  dir: dirProp,
  multiple = false,
  autocomplete,
  disabled = false,
  name,
  required = false,
  children,
}: SelectRootProps) {
  const dir = useDirection(dirProp)
  const [modelValue, setModel] = useVModel<unknown>(
    valueProp,
    defaultValue ?? (multiple ? [] : undefined),
    onValueChange,
  )
  const [openValue, setOpen] = useVModel<boolean>(openProp, defaultOpen, onOpenChange)
  const open = !!openValue
  const [triggerElement, setTriggerElement] = useState<HTMLElement | null>(null)
  const [optionsSet, setOptionsSet] = useState<SelectOptionRecord[]>([])
  const [collection] = useState(() => createCollection<{ textValue: string }>())
  const contentId = useId()
  const triggerPointerDownPosRef = useRef<{ x: number; y: number } | null>({ x: 0, y: 0 })
  const modelRef = useRef(modelValue)
  modelRef.current = modelValue
  const openRef = useRef(open)
  openRef.current = open
  const triggerRef = useRef(triggerElement)
  triggerRef.current = triggerElement
  const latest = useRef({ multiple, by, setModel, setOpen })
  latest.current = { multiple, by, setModel, setOpen }

  const isEmptyModelValue =
    multiple && Array.isArray(modelValue) ? modelValue.length === 0 : isNullish(modelValue)
  const isFormControl = triggerElement ? !!triggerElement.closest('form') : true

  const api = useMemo(() => {
    function setModelValue(next: unknown) {
      modelRef.current = next
      latest.current.setModel(next)
    }
    return {
      onTriggerChange: (element: HTMLElement | null) => {
        triggerRef.current = element
        setTriggerElement(element)
      },
      getTriggerElement: () => triggerRef.current,
      getModelValue: () => modelRef.current,
      getOpen: () => openRef.current,
      onValueChange(value: unknown) {
        if (latest.current.multiple) {
          const array = Array.isArray(modelRef.current) ? [...modelRef.current] : []
          const index = array.findIndex(item => compare(item, value, latest.current.by))
          if (index === -1) array.push(value)
          else array.splice(index, 1)
          setModelValue([...array])
        } else setModelValue(value)
      },
      onOpenChange(value: boolean) {
        openRef.current = value
        latest.current.setOpen(value)
      },
      onOptionAdd(option: SelectOptionRecord) {
        setOptionsSet(current => [
          ...current.filter(
            existing => !valueComparator(option.value, existing.value, latest.current.by),
          ),
          option,
        ])
      },
      onOptionRemove(option: SelectOptionRecord) {
        setOptionsSet(current =>
          current.filter(
            existing => !valueComparator(option.value, existing.value, latest.current.by),
          ),
        )
      },
    }
  }, [])

  const value = useMemo<SelectRootContextValue>(
    () => ({
      ...api,
      triggerElement,
      contentId,
      modelValue,
      by,
      open,
      multiple,
      required,
      disabled,
      dir,
      triggerPointerDownPosRef,
      isEmptyModelValue,
      optionsSet,
      collection,
    }),
    [
      api,
      triggerElement,
      contentId,
      modelValue,
      by,
      open,
      multiple,
      required,
      disabled,
      dir,
      isEmptyModelValue,
      optionsSet,
      collection,
    ],
  )

  const nativeSelectKey = optionsSet.map(option => String(option.value)).join(';')

  return (
    <PopperRoot>
      <SelectRootContext value={value}>
        {children}
        {isFormControl && name ? (
          <BubbleSelect
            key={nativeSelectKey}
            aria-hidden="true"
            tabIndex={-1}
            multiple={multiple}
            required={required}
            name={name}
            autoComplete={autocomplete}
            disabled={disabled}
            value={modelValue}
          >
            {isNullish(modelValue) ? <option value={nullableValue} /> : null}
            {optionsSet.map(option => (
              <option
                key={String(option.value ?? '')}
                value={option.value as string}
                disabled={option.disabled}
              >
                {option.textContent}
              </option>
            ))}
          </BubbleSelect>
        ) : null}
      </SelectRootContext>
    </PopperRoot>
  )
}

interface BubbleSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'value'> {
  value?: unknown
}

function nativeValue(value: unknown) {
  return value == null ? '' : String(value)
}

function BubbleSelect({ value, children, ...props }: BubbleSelectProps) {
  const context = useSelectRootContext('BubbleSelect')
  const element = useRef<HTMLSelectElement>(null)
  const previous = useRef(value)

  useLayoutEffect(() => {
    if (element.current) element.current.value = nativeValue(value)
  }, [])

  useEffect(() => {
    const prev = previous.current
    previous.current = value
    const select = element.current
    if (value === prev || !select) return
    const descriptor = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, 'value')
    descriptor?.set?.call(select, nativeValue(value))
    select.dispatchEvent(new Event('change', { bubbles: true }))
  }, [value])

  return (
    <PrimitiveVisuallyHidden asChild>
      <select
        ref={element}
        {...props}
        onInput={event => context.onValueChange((event.target as HTMLSelectElement).value)}
      >
        {children}
      </select>
    </PrimitiveVisuallyHidden>
  )
}

export interface SelectTriggerProps
  extends PrimitiveProps, Omit<HTMLAttributes<HTMLElement>, 'dir'>, DataAttributes {
  disabled?: boolean
  reference?: HTMLElement | null
  ref?: Ref<HTMLElement>
}

export function SelectTrigger({
  disabled: disabledProp,
  reference,
  as = 'button',
  asChild,
  onClick,
  onPointerDown,
  onMouseDown,
  onPointerUp,
  onKeyDown,
  ref,
  ...attrs
}: SelectTriggerProps) {
  const context = useSelectRootContext('SelectTrigger')
  const isDisabled = context.disabled || !!disabledProp
  const [element, setElement] = useState<HTMLElement | null>(null)
  const composedRef = useComposedRefs(ref, setElement)
  const [typeahead] = useState(() => createTypeahead())
  const openedFromPointerDown = useRef(false)
  const anchor = useRef<HTMLElement | null>(null)
  anchor.current = reference ?? element

  useEffect(() => () => typeahead.dispose(), [typeahead])
  useLayoutEffect(() => {
    if (element) context.onTriggerChange(element)
  }, [element, context.onTriggerChange])

  useLayoutEffect(() => {
    if (element && !('disabled' in element)) element.setAttribute('disabled', String(isDisabled))
  })

  function handleOpen() {
    if (!isDisabled) {
      context.onOpenChange(true)
      typeahead.reset()
    }
  }

  function handlePointerOpen(event: ReactPointerEvent<HTMLElement>) {
    handleOpen()
    context.triggerPointerDownPosRef.current = {
      x: Math.round(event.pageX),
      y: Math.round(event.pageY),
    }
  }

  function isPlainLeftClick(event: { button: number; ctrlKey: boolean }) {
    return event.button === 0 && event.ctrlKey === false
  }

  return (
    <>
      <PopperVirtualAnchor anchor={anchor} />
      <Primitive
        {...attrs}
        ref={composedRef}
        role="combobox"
        {...({ type: as === 'button' ? 'button' : undefined } as object)}
        aria-controls={context.open ? context.contentId : undefined}
        aria-expanded={context.open || false}
        aria-required={context.required}
        aria-autocomplete="none"
        {...({ disabled: isDisabled || undefined } as object)}
        dir={context.dir}
        data-state={context.open ? 'open' : 'closed'}
        data-disabled={isDisabled ? '' : undefined}
        data-placeholder={shouldShowPlaceholder(context.modelValue) ? '' : undefined}
        as={as}
        asChild={asChild}
        onClick={composeEventHandlers(onClick, (event: ReactMouseEvent<HTMLElement>) => {
          if (!openedFromPointerDown.current) event.currentTarget.focus()
          openedFromPointerDown.current = false
        })}
        onPointerDown={composeEventHandlers(
          onPointerDown,
          (event: ReactPointerEvent<HTMLElement>) => {
            if (event.pointerType === 'touch') {
              event.preventDefault()
              return
            }
            const target = event.target as HTMLElement
            if (target.hasPointerCapture(event.pointerId))
              target.releasePointerCapture(event.pointerId)
            if (isPlainLeftClick(event)) {
              handlePointerOpen(event)
              openedFromPointerDown.current = true
            }
          },
        )}
        onMouseDown={composeEventHandlers(onMouseDown, (event: ReactMouseEvent<HTMLElement>) => {
          if (isPlainLeftClick(event)) event.preventDefault()
        })}
        onPointerUp={composeEventHandlers(onPointerUp, (event: ReactPointerEvent<HTMLElement>) => {
          event.preventDefault()
          if (event.pointerType === 'touch') handlePointerOpen(event)
        })}
        onKeyDown={composeEventHandlers(onKeyDown, (event: ReactKeyboardEvent<HTMLElement>) => {
          const isTypingAhead = typeahead.search !== ''
          const isModifierKey = event.ctrlKey || event.altKey || event.metaKey
          if (!isModifierKey && event.key.length === 1 && isTypingAhead && event.key === ' ') return
          typeahead.handle(event.key, context.collection.getItems())
          if (OPEN_KEYS.includes(event.key)) {
            handleOpen()
            event.preventDefault()
          }
        })}
      />
    </>
  )
}

export interface SelectPortalProps {
  to?: Element | DocumentFragment | null
  children?: ReactNode
}

export function SelectPortal({ to, children }: SelectPortalProps) {
  const configured = usePortalContainer()
  return (
    <HnPortal asChild container={to ?? configured}>
      {children}
    </HnPortal>
  )
}

export interface SelectContentContextValue {
  content: HTMLElement | null
  onItemLeave?: () => void
  itemRefCallback: (node: HTMLElement, value: unknown, disabled?: boolean) => void
  itemTextRefCallback: (node: HTMLElement, value: unknown, disabled?: boolean) => void
  focusSelectedItem?: () => void
  isPositioned: boolean
  searchRef?: { readonly search: string }
}

const defaultContentContext: SelectContentContextValue = {
  content: null,
  itemRefCallback: () => {},
  itemTextRefCallback: () => {},
  isPositioned: false,
}

const SelectContentContext = createContext<SelectContentContextValue>(defaultContentContext)

export function useSelectContentContext() {
  return useContext(SelectContentContext)
}

export interface SelectContentProps extends Omit<
  PopperContentProps,
  'ref' | 'onEscapeKeyDown' | 'dir'
> {
  forceMount?: boolean
  position?: 'popper'
  bodyLock?: boolean
  dir?: Direction
  disableOutsidePointerEvents?: boolean
  onCloseAutoFocus?: (event: Event) => void
  onEscapeKeyDown?: (event: KeyboardEvent) => void
  onPointerDownOutside?: (event: PointerDownOutsideEvent) => void
  ref?: Ref<HTMLElement>
}

export function SelectContent({ forceMount, children, ...props }: SelectContentProps) {
  const context = useSelectRootContext('SelectContent')
  const [fragment, setFragment] = useState<DocumentFragment>()
  const present = !!forceMount || context.open
  const [renderPresence, setRenderPresence] = useState(present)
  const [contentMounted, setContentMounted] = useState(false)

  useLayoutEffect(() => setFragment(new DocumentFragment()), [])

  const firstRender = useRef(true)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    const timer = setTimeout(() => setRenderPresence(present))
    return () => clearTimeout(timer)
  }, [present])

  if (present || renderPresence || contentMounted)
    return (
      <Presence present={present}>
        <SelectContentImpl {...props} onMountedChange={setContentMounted}>
          {children}
        </SelectContentImpl>
      </Presence>
    )
  if (!fragment) return null
  return (
    <div>
      <HnPortal container={fragment}>
        <SelectContentContext value={defaultContentContext}>{children}</SelectContentContext>
      </HnPortal>
    </div>
  )
}

interface SelectContentImplProps extends Omit<SelectContentProps, 'forceMount'> {
  onMountedChange: (mounted: boolean) => void
}

function SelectContentImpl({
  onMountedChange,
  position = 'popper',
  bodyLock = true,
  align = 'start',
  collisionPadding = CONTENT_MARGIN,
  disableOutsidePointerEvents = true,
  onCloseAutoFocus,
  onEscapeKeyDown,
  onPointerDownOutside,
  onKeyDown,
  onContextMenu,
  style,
  ref,
  ...props
}: SelectContentImplProps) {
  const root = useSelectRootContext('SelectContentImpl')
  const [content, setContent] = useState<HTMLElement | null>(null)
  const contentRef = useRef<HTMLElement | null>(null)
  const composedRef = useComposedRefs(ref, contentRef, setContent)
  const [typeahead] = useState(() => createTypeahead())
  const [isPositioned, setIsPositioned] = useState(false)
  const selectedItem = useRef<HTMLElement | null>(null)
  const firstValidItemFound = useRef(false)
  const firstSelectedItemInArrayFound = useRef(false)
  const closeAutoFocus = useCallbackRef(onCloseAutoFocus)
  useFocusGuards()
  useBodyScrollLock(bodyLock)

  useLayoutEffect(() => {
    onMountedChange(true)
    return () => onMountedChange(false)
  }, [onMountedChange])

  useEffect(() => () => typeahead.dispose(), [typeahead])

  useEffect(() => {
    if (!content) return
    let isInsideClosedPopover = false
    try {
      isInsideClosedPopover = !!content.closest('[popover]:not(:popover-open)')
    } catch {}
    if (isInsideClosedPopover) return
    return hideOthers(content)
  }, [content])

  const setRoot = root.collection.setRoot
  useLayoutEffect(() => {
    setRoot(content)
  }, [content, setRoot])

  const focusSelectedItem = useCallback(() => {
    if (selectedItem.current && contentRef.current)
      focusFirst([selectedItem.current, contentRef.current])
  }, [])

  useEffect(() => {
    if (isPositioned) focusSelectedItem()
  }, [isPositioned, focusSelectedItem])

  useEffect(() => {
    if (!content) return
    let pointerMoveDelta = { x: 0, y: 0 }
    const position = root.triggerPointerDownPosRef
    const handlePointerMove = (event: PointerEvent) => {
      pointerMoveDelta = {
        x: Math.abs(Math.round(event.pageX) - (position.current?.x ?? 0)),
        y: Math.abs(Math.round(event.pageY) - (position.current?.y ?? 0)),
      }
    }
    const handlePointerUp = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      if (pointerMoveDelta.x <= 10 && pointerMoveDelta.y <= 10) event.preventDefault()
      else if (!content.contains(event.target as Node)) root.onOpenChange(false)
      document.removeEventListener('pointermove', handlePointerMove)
      position.current = null
    }
    if (position.current !== null) {
      document.addEventListener('pointermove', handlePointerMove)
      document.addEventListener('pointerup', handlePointerUp, { capture: true, once: true })
    }
    return () => {
      document.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('pointerup', handlePointerUp, { capture: true })
    }
  }, [content, root.triggerPointerDownPosRef, root.onOpenChange])

  useLayoutEffect(() => {
    const container = contentRef.current
    const previouslyFocusedElement = document.activeElement as HTMLElement | null
    return () => {
      if (!container) return
      const event = new CustomEvent(AUTOFOCUS_ON_UNMOUNT, { bubbles: false, cancelable: true })
      const handler = (unmount: Event) => {
        if (unmount !== event) return
        closeAutoFocus(unmount)
        if (unmount.defaultPrevented) return
        root.getTriggerElement()?.focus({ preventScroll: true })
        unmount.preventDefault()
      }
      container.addEventListener(AUTOFOCUS_ON_UNMOUNT, handler)
      container.dispatchEvent(event)
      setTimeout(() => {
        if (!event.defaultPrevented) previouslyFocusedElement?.focus({ preventScroll: true })
        container.removeEventListener(AUTOFOCUS_ON_UNMOUNT, handler)
      }, 0)
    }
  }, [])

  function handleKeyDown(event: ReactKeyboardEvent<HTMLElement>) {
    const isModifierKey = event.ctrlKey || event.altKey || event.metaKey
    if (event.key === 'Tab') event.preventDefault()
    if (!isModifierKey && event.key.length === 1)
      typeahead.handle(event.key, root.collection.getItems())
    if (['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) {
      let candidateNodes = root.collection.getItems().map(item => item.ref)
      if (['ArrowUp', 'End'].includes(event.key)) candidateNodes = candidateNodes.slice().reverse()
      if (['ArrowUp', 'ArrowDown'].includes(event.key)) {
        const currentIndex = candidateNodes.indexOf(event.target as HTMLElement)
        candidateNodes = candidateNodes.slice(currentIndex + 1)
      }
      setTimeout(() => focusFirst(candidateNodes))
      event.preventDefault()
    }
  }

  const contentContext = useMemo<SelectContentContextValue>(
    () => ({
      content,
      onItemLeave: () => contentRef.current?.focus(),
      itemRefCallback: (node, value, disabled) => {
        const isFirstValidItem = !firstValidItemFound.current && !disabled
        const isSelectedItem = valueComparator(root.getModelValue(), value, root.by)
        if (root.multiple) {
          if (firstSelectedItemInArrayFound.current) return
          if (isSelectedItem || isFirstValidItem) {
            selectedItem.current = node
            if (isSelectedItem) firstSelectedItemInArrayFound.current = true
          }
        } else if (isSelectedItem || isFirstValidItem) selectedItem.current = node
        if (isFirstValidItem) firstValidItemFound.current = true
      },
      itemTextRefCallback: () => {},
      focusSelectedItem,
      isPositioned,
      searchRef: typeahead,
    }),
    [content, root, focusSelectedItem, isPositioned, typeahead],
  )

  const getLayer = () => contentRef.current

  return (
    <SelectContentContext value={contentContext}>
      <FocusScope
        asChild
        onMountAutoFocus={event => event.preventDefault()}
        onUnmountAutoFocus={event => event.preventDefault()}
      >
        <DismissableLayer
          asChild
          disableOutsidePointerEvents={disableOutsidePointerEvents}
          onFocusOutside={guardLayer<FocusOutsideEvent>(getLayer, event => event.preventDefault())}
          onDismiss={() => root.onOpenChange(false)}
          onEscapeKeyDown={onEscapeKeyDown}
          onPointerDownOutside={guardLayer(getLayer, onPointerDownOutside)}
          onInteractOutside={guardLayer(getLayer)}
        >
          <PopperContent
            align={align}
            collisionPadding={collisionPadding}
            {...props}
            dir={root.dir}
            id={root.contentId}
            role="listbox"
            data-state={root.open ? 'open' : 'closed'}
            data-dismissable-layer=""
            {...({
              position,
              bodylock: String(bodyLock),
              disableoutsidepointerevents: String(disableOutsidePointerEvents),
            } as object)}
            ref={composedRef}
            style={
              {
                ...style,
                boxSizing: 'border-box',
                '--radix-select-content-transform-origin': 'var(--radix-popper-transform-origin)',
                '--radix-select-content-available-width': 'var(--radix-popper-available-width)',
                '--radix-select-content-available-height': 'var(--radix-popper-available-height)',
                '--radix-select-trigger-width': 'var(--radix-popper-anchor-width)',
                '--radix-select-trigger-height': 'var(--radix-popper-anchor-height)',
                display: 'flex',
                flexDirection: 'column',
                outline: 'none',
              } as PopperContentProps['style']
            }
            onContextMenu={composeEventHandlers(onContextMenu, event => event.preventDefault())}
            onPlaced={() => setIsPositioned(true)}
            onKeyDown={composeEventHandlers(onKeyDown, handleKeyDown)}
          />
        </DismissableLayer>
      </FocusScope>
    </SelectContentContext>
  )
}

interface SelectItemContextValue {
  value: unknown
  disabled: boolean
  textId: string
  isSelected: boolean
  onItemTextChange: (node: HTMLElement | null) => void
}

const SelectItemContext = createContext<SelectItemContextValue | null>(null)

export function useSelectItemContext(consumer = 'SelectItem') {
  const context = useContext(SelectItemContext)
  if (!context) throw new Error(`\`${consumer}\` must be used within \`SelectItem\``)
  return context
}

export type SelectItemSelectEvent = CustomEvent<{ originalEvent: Event; value: unknown }>

export interface SelectItemProps
  extends PrimitiveProps, Omit<HTMLAttributes<HTMLElement>, 'onSelect'>, DataAttributes {
  value: unknown
  disabled?: boolean
  textValue?: string
  onSelect?: (event: SelectItemSelectEvent) => void
  ref?: Ref<HTMLElement>
}

export function SelectItem({
  value,
  disabled = false,
  textValue: textValueProp,
  as,
  asChild,
  onSelect,
  onFocus,
  onBlur,
  onPointerUp,
  onPointerDown,
  onTouchEnd,
  onPointerMove,
  onPointerLeave,
  onKeyDown,
  ref,
  ...attrs
}: SelectItemProps) {
  if (value === '')
    throw new Error(
      'A <SelectItem /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder.',
    )
  const root = useSelectRootContext('SelectItem')
  const content = useSelectContentContext()
  const [element, setElement] = useState<HTMLElement | null>(null)
  const composedRef = useComposedRefs(ref, setElement)
  const isSelected = valueComparator(root.modelValue, value, root.by)
  const [isFocused, setIsFocused] = useState(false)
  const textValue = useRef(textValueProp ?? '')
  const [collectionValue, setCollectionValue] = useState(() => ({ textValue: textValue.current }))
  const textId = useId()
  const latest = useRef({ value, disabled, onSelect })
  latest.current = { value, disabled, onSelect }

  useLayoutEffect(() => {
    if (element) content.itemRefCallback(element, value, disabled)
  }, [element])

  useLayoutEffect(
    () => (element ? root.collection.register(element, collectionValue) : undefined),
    [element, collectionValue, root.collection],
  )

  async function handleSelect(event: Event) {
    await nextTick()
    latest.current.onSelect?.(event as SelectItemSelectEvent)
    if (event.defaultPrevented) return
    if (!latest.current.disabled) {
      root.onValueChange(latest.current.value)
      if (!root.multiple) root.onOpenChange(false)
    }
  }

  function handleSelectCustomEvent(originalEvent: Event) {
    if (originalEvent.defaultPrevented) return
    const target = originalEvent.target as EventTarget
    const event = new CustomEvent('select.select', {
      bubbles: false,
      cancelable: true,
      detail: { originalEvent, value: latest.current.value },
    })
    target.addEventListener('select.select', handleSelect, { once: true })
    target.dispatchEvent(event)
  }

  const itemContext = useMemo<SelectItemContextValue>(
    () => ({
      value,
      disabled,
      textId,
      isSelected,
      onItemTextChange: node => {
        textValue.current = ((textValue.current || node?.textContent) ?? '').trim()
        setCollectionValue({ textValue: textValue.current })
      },
    }),
    [value, disabled, textId, isSelected],
  )

  return (
    <SelectItemContext value={itemContext}>
      <Primitive
        {...attrs}
        {...{ [COLLECTION_ITEM]: '' }}
        ref={composedRef}
        role="option"
        aria-labelledby={textId}
        data-highlighted={isFocused ? '' : undefined}
        aria-selected={isSelected}
        data-state={isSelected ? 'checked' : 'unchecked'}
        aria-disabled={disabled || undefined}
        data-disabled={disabled ? '' : undefined}
        tabIndex={disabled ? undefined : -1}
        as={as}
        asChild={asChild}
        onFocus={composeEventHandlers(onFocus, event => {
          if (event.target === event.currentTarget) setIsFocused(true)
        })}
        onBlur={composeEventHandlers(onBlur, event => {
          if (event.target === event.currentTarget) setIsFocused(false)
        })}
        onPointerUp={composeEventHandlers(onPointerUp, (event: ReactPointerEvent<HTMLElement>) =>
          handleSelectCustomEvent(event.nativeEvent),
        )}
        onPointerDown={composeEventHandlers(
          onPointerDown,
          (event: ReactPointerEvent<HTMLElement>) => {
            event.currentTarget.focus({ preventScroll: true })
          },
        )}
        onTouchEnd={composeEventHandlers(onTouchEnd, (event: TouchEvent<HTMLElement>) => {
          event.preventDefault()
          event.stopPropagation()
        })}
        onPointerMove={composeEventHandlers(
          onPointerMove,
          async (event: ReactPointerEvent<HTMLElement>) => {
            await nextTick()
            if (event.defaultPrevented) return
            if (disabled) content.onItemLeave?.()
            else (event.currentTarget as HTMLElement | null)?.focus({ preventScroll: true })
          },
        )}
        onPointerLeave={composeEventHandlers(
          onPointerLeave,
          async (event: ReactPointerEvent<HTMLElement>) => {
            await nextTick()
            if (event.defaultPrevented) return
            if (event.currentTarget === document.activeElement) content.onItemLeave?.()
          },
        )}
        onKeyDown={composeEventHandlers(
          onKeyDown,
          async (event: ReactKeyboardEvent<HTMLElement>) => {
            await nextTick()
            if (event.defaultPrevented) return
            const isTypingAhead = !!content.searchRef && content.searchRef.search !== ''
            if (isTypingAhead && event.key === ' ') return
            if (SELECTION_KEYS.includes(event.key)) handleSelectCustomEvent(event.nativeEvent)
            if (event.key === ' ') event.preventDefault()
          },
        )}
      />
    </SelectItemContext>
  )
}

export interface SelectItemTextProps
  extends PrimitiveProps, HTMLAttributes<HTMLElement>, DataAttributes {
  ref?: Ref<HTMLElement>
}

export function SelectItemText({ as = 'span', asChild, ref, ...attrs }: SelectItemTextProps) {
  const root = useSelectRootContext('SelectItemText')
  const content = useSelectContentContext()
  const item = useSelectItemContext('SelectItemText')
  const [element, setElement] = useState<HTMLElement | null>(null)
  const composedRef = useComposedRefs(ref, setElement)
  const option = useRef<SelectOptionRecord | null>(null)

  useLayoutEffect(() => {
    if (!element) return
    item.onItemTextChange(element)
    content.itemTextRefCallback(element, item.value, item.disabled)
    const record = {
      value: item.value,
      disabled: item.disabled,
      textContent: element.textContent ?? String(item.value ?? ''),
    }
    option.current = record
    root.onOptionAdd(record)
  }, [element])

  useEffect(
    () => () => {
      if (option.current) root.onOptionRemove(option.current)
    },
    [],
  )

  return <Primitive id={item.textId} as={as} asChild={asChild} {...attrs} ref={composedRef} />
}

export interface SelectItemIndicatorProps
  extends PrimitiveProps, HTMLAttributes<HTMLElement>, DataAttributes {
  ref?: Ref<HTMLElement>
}

export function SelectItemIndicator({ as = 'span', asChild, ...attrs }: SelectItemIndicatorProps) {
  const item = useSelectItemContext('SelectItemIndicator')
  if (!item.isSelected) return null
  return <Primitive aria-hidden="true" as={as} asChild={asChild} {...attrs} />
}

const SelectGroupContext = createContext<{ id: string }>({ id: '' })

export interface SelectGroupProps
  extends PrimitiveProps, HTMLAttributes<HTMLElement>, DataAttributes {
  ref?: Ref<HTMLElement>
}

export function SelectGroup({ as, asChild, ...attrs }: SelectGroupProps) {
  const id = useId()
  const context = useMemo(() => ({ id }), [id])
  return (
    <SelectGroupContext value={context}>
      <Primitive role="group" as={as} asChild={asChild} {...attrs} aria-labelledby={id} />
    </SelectGroupContext>
  )
}

export interface SelectLabelProps
  extends PrimitiveProps, HTMLAttributes<HTMLElement>, DataAttributes {
  ref?: Ref<HTMLElement>
}

export function SelectLabel({ as = 'div', asChild, ...attrs }: SelectLabelProps) {
  const group = useContext(SelectGroupContext)
  return <Primitive as={as} asChild={asChild} {...attrs} id={group.id} />
}
