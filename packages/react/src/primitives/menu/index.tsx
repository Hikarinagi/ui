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
  type FocusEvent as ReactFocusEvent,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type Ref,
  type RefObject,
} from 'react'
import { Portal as RadixPortal } from 'radix-ui'
import {
  DismissableLayer,
  FocusGuards,
  FocusScope,
  Presence,
  useCallbackRef,
  useComposedRefs,
  useControllableState,
} from 'radix-ui/internal'
import { hideOthers } from 'aria-hidden'
import { Primitive, type PrimitiveProps } from '../../lib/primitive'
import { usePortalContainer } from '../../lib/config'
import { useBodyScrollLock } from '../body-scroll-lock'
import {
  PopperArrow,
  PopperContent,
  PopperRoot,
  usePopperDirection,
  type PopperArrowProps,
  type PopperContentProps,
} from '../popper'
import {
  guardLayer,
  type FocusOutsideEvent,
  type PointerDownOutsideEvent,
} from '../utils/dismissable'
import {
  CONTENT_ATTR,
  ENABLED_ITEM_SELECTOR,
  ENTRY_FOCUS,
  FIRST_LAST_KEYS,
  ITEM_DATA_ATTR,
  ITEM_SELECT,
  ITEM_SELECTOR,
  LAST_KEYS,
  SELECTION_KEYS,
  SUB_CLOSE_KEYS,
  SUB_OPEN_KEYS,
  arrowNavigation,
  focusElement,
  focusFirst,
  getActiveElement,
  getCheckedState,
  getNextMatch,
  getOpenState,
  isIndeterminate,
  isMouseEvent,
  isPointerInGraceArea,
  type CheckedState,
  type Direction,
  type GraceIntent,
  type Side,
} from './utils'

export type { FocusOutsideEvent, PointerDownOutsideEvent } from '../utils/dismissable'
export type { CheckedState, Direction } from './utils'

type DataAttributes = { [attribute: `data-${string}`]: string | undefined }

export interface MenuReference {
  getBoundingClientRect: () => Pick<
    DOMRect,
    'x' | 'y' | 'width' | 'height' | 'top' | 'right' | 'bottom' | 'left'
  >
  contextElement?: Element
}

type MenuAnchorValue = MenuReference | HTMLElement | null

const AUTOFOCUS_ON_UNMOUNT = 'focusScope.autoFocusOnUnmount'

export function useSnapshot<T>(key: unknown, read: () => T) {
  const state = useRef<{ key: unknown; value: T } | null>(null)
  if (!state.current || !Object.is(state.current.key, key)) state.current = { key, value: read() }
  return state.current.value
}

function nextTick(callback: () => void) {
  void Promise.resolve().then(callback)
}

interface MenuContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
  content: HTMLElement | null
  onContentChange: (content: HTMLElement | null) => void
  anchor: MenuAnchorValue
  onAnchorChange: (anchor: MenuAnchorValue) => void
}

interface MenuRootContextValue {
  onClose: () => void
  dir: Direction
  isUsingKeyboard: RefObject<boolean>
  modal: boolean
}

interface MenuSubContextValue {
  triggerId: RefObject<string>
  contentId: RefObject<string>
  trigger: HTMLElement | null
  onTriggerChange: (trigger: HTMLElement | null) => void
}

interface CollectionEntry {
  ref: HTMLElement
  value: { textValue?: string }
}

interface ActiveSubmenu {
  onOpenChange: (open: boolean) => void
  trigger: () => HTMLElement | null
}

interface MenuContentContextValue {
  onItemEnter: (event: ReactPointerEvent) => boolean
  onItemLeave: (event: ReactPointerEvent) => boolean
  onTriggerLeave: (event: ReactPointerEvent) => boolean
  highlighted: HTMLElement | null | undefined
  highlightedRef: RefObject<HTMLElement | null | undefined>
  onHighlightedChange: (element: HTMLElement | null | undefined) => void
  activeSubmenu: RefObject<ActiveSubmenu | undefined>
  pointerGraceTimer: RefObject<number>
  onPointerGraceIntentChange: (intent: GraceIntent | null) => void
  register: (element: HTMLElement, value: CollectionEntry['value']) => () => void
}

const MenuContext = createContext<MenuContextValue | null>(null)
const MenuRootContext = createContext<MenuRootContextValue | null>(null)
const MenuSubContext = createContext<MenuSubContextValue | null>(null)
const MenuContentContext = createContext<MenuContentContextValue | null>(null)
const MenuGroupContext = createContext<{ id: string }>({ id: '' })
const MenuRadioGroupContext = createContext<{
  value: string
  onValueChange: (value: string) => void
} | null>(null)
const MenuItemIndicatorContext = createContext<{ checked: CheckedState }>({ checked: false })

function required<T>(value: T | null, consumer: string, provider: string): T {
  if (!value) throw new Error(`\`${consumer}\` must be used within \`${provider}\``)
  return value
}

export function useMenuContext(consumer = 'MenuContent') {
  return required(useContext(MenuContext), consumer, 'MenuRoot')
}

export function useMenuRootContext(consumer = 'MenuContent') {
  return required(useContext(MenuRootContext), consumer, 'MenuRoot')
}

function useMenuSubContext(consumer: string) {
  return required(useContext(MenuSubContext), consumer, 'MenuSub')
}

function useMenuContentContext(consumer: string) {
  return required(useContext(MenuContentContext), consumer, 'MenuContent')
}

function useIsUsingKeyboard() {
  const isUsingKeyboard = useRef(false)
  useEffect(() => {
    const onKeyDown = () => {
      isUsingKeyboard.current = true
    }
    const onPointer = () => {
      isUsingKeyboard.current = false
    }
    const options = { capture: true, passive: true }
    window.addEventListener('keydown', onKeyDown, options)
    window.addEventListener('pointerdown', onPointer, options)
    window.addEventListener('pointermove', onPointer, options)
    return () => {
      window.removeEventListener('keydown', onKeyDown, options)
      window.removeEventListener('pointerdown', onPointer, options)
      window.removeEventListener('pointermove', onPointer, options)
    }
  }, [])
  return isUsingKeyboard
}

function useMenuContextValue(open: boolean, onOpenChange: (open: boolean) => void) {
  const [content, setContent] = useState<HTMLElement | null>(null)
  const [anchor, setAnchor] = useState<MenuAnchorValue>(null)
  return useMemo<MenuContextValue>(
    () => ({
      open,
      onOpenChange,
      content,
      onContentChange: setContent,
      anchor,
      onAnchorChange: setAnchor,
    }),
    [open, onOpenChange, content, anchor],
  )
}

export interface MenuRootProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  dir?: Direction
  modal?: boolean
  children?: ReactNode
}

export function MenuRoot({
  open = false,
  onOpenChange,
  dir: dirProp,
  modal = true,
  children,
}: MenuRootProps) {
  const dir = usePopperDirection(dirProp)
  const isUsingKeyboard = useIsUsingKeyboard()
  const handleOpenChange = useCallbackRef((value: boolean) => onOpenChange?.(value))
  const menu = useMenuContextValue(open, handleOpenChange)
  const root = useMemo<MenuRootContextValue>(
    () => ({ onClose: () => handleOpenChange(false), dir, isUsingKeyboard, modal }),
    [handleOpenChange, dir, isUsingKeyboard, modal],
  )

  return (
    <PopperRoot>
      <MenuRootContext value={root}>
        <MenuContext value={menu}>{children}</MenuContext>
      </MenuRootContext>
    </PopperRoot>
  )
}

export interface MenuSubProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children?: ReactNode
}

export function MenuSub({ open: openProp, defaultOpen, onOpenChange, children }: MenuSubProps) {
  const parent = useMenuContext('MenuSub')
  const [open = false, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange,
    caller: 'MenuSub',
  })
  const handleOpenChange = useCallbackRef((value: boolean) => setOpen(value))
  const menu = useMenuContextValue(open, handleOpenChange)
  const triggerId = useRef('')
  const contentId = useRef('')
  const [trigger, setTrigger] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (!parent.open) handleOpenChange(false)
    return () => handleOpenChange(false)
  }, [parent.open, handleOpenChange])

  const sub = useMemo<MenuSubContextValue>(
    () => ({ triggerId, contentId, trigger, onTriggerChange: setTrigger }),
    [trigger],
  )

  return (
    <PopperRoot>
      <MenuContext value={menu}>
        <MenuSubContext value={sub}>{children}</MenuSubContext>
      </MenuContext>
    </PopperRoot>
  )
}

export function useMenuAnchor(reference?: MenuReference | null) {
  const { onAnchorChange } = useMenuContext('MenuAnchor')
  const [element, setElement] = useState<HTMLElement | null>(null)
  useLayoutEffect(() => {
    onAnchorChange(reference ?? element)
  }, [reference, element, onAnchorChange])
  return setElement
}

export interface MenuAnchorProps
  extends PrimitiveProps, HTMLAttributes<HTMLElement>, DataAttributes {
  reference?: MenuReference
  ref?: Ref<HTMLElement>
}

export function MenuAnchor({ reference, ref, ...props }: MenuAnchorProps) {
  const anchor = useMenuAnchor(reference)
  const composedRef = useComposedRefs(ref, anchor)
  return <Primitive {...props} ref={composedRef} />
}

export interface MenuPortalProps {
  to?: Element | DocumentFragment | null
  children?: ReactNode
}

export function MenuPortal({ to, children }: MenuPortalProps) {
  const container = usePortalContainer()
  return (
    <RadixPortal.Root asChild container={to ?? container}>
      {children}
    </RadixPortal.Root>
  )
}

export interface MenuContentImplProps
  extends Omit<PopperContentProps, 'ref' | 'dir' | 'onEscapeKeyDown'>, DataAttributes {
  loop?: boolean
  reference?: MenuReference
  trapFocus?: boolean
  disableOutsidePointerEvents?: boolean
  disableOutsideScroll?: boolean
  onEscapeKeyDown?: (event: KeyboardEvent) => void
  onPointerDownOutside?: (event: PointerDownOutsideEvent) => void
  onFocusOutside?: (event: FocusOutsideEvent) => void
  onInteractOutside?: (event: PointerDownOutsideEvent | FocusOutsideEvent) => void
  onOpenAutoFocus?: (event: Event) => void
  onCloseAutoFocus?: (event: Event) => void
  onEntryFocus?: (event: Event) => void
  onDismiss?: () => void
  ref?: Ref<HTMLElement>
}

export type MenuContentProps = Omit<
  MenuContentImplProps,
  | 'trapFocus'
  | 'disableOutsidePointerEvents'
  | 'disableOutsideScroll'
  | 'onDismiss'
  | 'onEntryFocus'
> & {
  forceMount?: boolean
  onEntryFocus?: (event: Event) => void
}

export function MenuContent({ forceMount, ...props }: MenuContentProps) {
  const menu = useMenuContext('MenuContent')
  const root = useMenuRootContext('MenuContent')
  return (
    <Presence.Root present={!!forceMount || menu.open}>
      {root.modal ? <MenuRootContentModal {...props} /> : <MenuRootContentNonModal {...props} />}
    </Presence.Root>
  )
}

function useHideOthers(element: HTMLElement | null) {
  useEffect(() => {
    if (!element) return
    let isInsideClosedPopover = false
    try {
      isInsideClosedPopover = !!element.closest('[popover]:not(:popover-open)')
    } catch {}
    if (isInsideClosedPopover) return
    return hideOthers(element)
  }, [element])
}

function MenuRootContentModal({ ref, onFocusOutside, ...props }: MenuContentProps) {
  const menu = useMenuContext('MenuRootContentModal')
  const [element, setElement] = useState<HTMLElement | null>(null)
  const composedRef = useComposedRefs(ref, setElement)
  useHideOthers(element)

  return (
    <MenuContentImpl
      {...props}
      ref={composedRef}
      trapFocus={menu.open}
      disableOutsidePointerEvents={menu.open}
      disableOutsideScroll
      onDismiss={() => menu.onOpenChange(false)}
      onFocusOutside={event => {
        onFocusOutside?.(event)
        event.preventDefault()
      }}
    />
  )
}

function MenuRootContentNonModal(props: MenuContentProps) {
  const menu = useMenuContext('MenuRootContentNonModal')
  return (
    <MenuContentImpl
      {...props}
      trapFocus={false}
      disableOutsidePointerEvents={false}
      disableOutsideScroll={false}
      onDismiss={() => menu.onOpenChange(false)}
    />
  )
}

function MenuContentImpl({
  loop = false,
  reference,
  trapFocus = false,
  disableOutsidePointerEvents = false,
  disableOutsideScroll: _disableOutsideScroll,
  onEscapeKeyDown,
  onPointerDownOutside,
  onFocusOutside,
  onInteractOutside,
  onOpenAutoFocus,
  onCloseAutoFocus,
  onEntryFocus,
  onDismiss,
  onKeyDown,
  onPointerMove,
  onMouseDown,
  onMouseUp,
  onFocus,
  style,
  ref,
  ...props
}: MenuContentImplProps) {
  const menu = useMenuContext('MenuContentImpl')
  const root = useMenuRootContext('MenuContentImpl')
  const [content, setContent] = useState<HTMLElement | null>(null)
  const contentRef = useRef<HTMLElement | null>(null)
  const composedRef = useComposedRefs(ref, contentRef, setContent)
  const [lockScroll] = useState(disableOutsidePointerEvents)
  FocusGuards.useFocusGuards()
  useBodyScrollLock(lockScroll)

  const search = useRef('')
  const searchTimer = useRef(0)
  const pointerGraceTimer = useRef(0)
  const pointerGraceIntent = useRef<GraceIntent | null>(null)
  const pointerDir = useRef<Side>('right')
  const lastPointerX = useRef(0)
  const isClickFocus = useRef(false)
  const items = useRef(new Map<HTMLElement, CollectionEntry['value']>())
  const activeSubmenu = useRef<ActiveSubmenu | undefined>(undefined)
  const [highlighted, setHighlighted] = useState<HTMLElement | null | undefined>(undefined)
  const highlightedRef = useRef<HTMLElement | null | undefined>(undefined)
  const closeAutoFocus = useCallbackRef(onCloseAutoFocus)
  const { onContentChange } = menu

  const onHighlightedChange = useCallback((element: HTMLElement | null | undefined) => {
    highlightedRef.current = element
    setHighlighted(element)
  }, [])

  const register = useCallback((element: HTMLElement, value: CollectionEntry['value']) => {
    items.current.set(element, value)
    return () => {
      items.current.delete(element)
    }
  }, [])

  const getItems = useCallback((): CollectionEntry[] => {
    const node = contentRef.current
    if (!node) return []
    const ordered = Array.from(node.querySelectorAll(ITEM_SELECTOR))
    const order = new Map(ordered.map((element, index) => [element, index]))
    return [...items.current.entries()]
      .map(([element, value]) => ({ ref: element, value }))
      .sort((a, b) => (order.get(a.ref) ?? -1) - (order.get(b.ref) ?? -1))
      .filter(item => item.ref.dataset.disabled !== '')
  }, [])

  useEffect(() => {
    const active = activeSubmenu.current
    if (active && (highlighted === undefined || highlighted !== active.trigger())) {
      if (highlighted === undefined) return
      active.onOpenChange(false)
      activeSubmenu.current = undefined
    }
  }, [highlighted])

  useLayoutEffect(() => {
    onContentChange(content)
    return () => onContentChange(null)
  }, [content, onContentChange])

  useEffect(
    () => () => {
      window.clearTimeout(searchTimer.current)
    },
    [],
  )

  const previouslyFocused = useRef<HTMLElement | null>(null)

  useLayoutEffect(() => {
    previouslyFocused.current = getActiveElement() as HTMLElement | null
  }, [])

  useEffect(() => {
    const container = contentRef.current
    return () => {
      if (!container) return
      const event = new CustomEvent(AUTOFOCUS_ON_UNMOUNT, { bubbles: false, cancelable: true })
      const handler = (unmount: Event) => closeAutoFocus(unmount)
      container.addEventListener(AUTOFOCUS_ON_UNMOUNT, handler)
      container.dispatchEvent(event)
      container.setAttribute('data-focus-scope-unmounting', '')
      setTimeout(() => {
        if (!event.defaultPrevented)
          focusElement(previouslyFocused.current ?? document.body, { select: true })
        container.removeEventListener(AUTOFOCUS_ON_UNMOUNT, handler)
        container.removeAttribute('data-focus-scope-unmounting')
      }, 0)
    }
  }, [closeAutoFocus])

  function isPointerMovingToSubmenu(event: ReactPointerEvent) {
    const isMovingTowards = pointerDir.current === pointerGraceIntent.current?.side
    return isMovingTowards && isPointerInGraceArea(event, pointerGraceIntent.current?.area)
  }

  function handleTypeaheadSearch(key: string, collection: CollectionEntry[]) {
    search.current += key
    window.clearTimeout(searchTimer.current)
    searchTimer.current = window.setTimeout(() => {
      search.current = ''
    }, 1000)
    const currentItem = getActiveElement()
    const withText = collection.map(item => ({
      ...item,
      textValue: item.value?.textValue ?? item.ref.textContent?.trim() ?? '',
    }))
    const currentMatch = withText.find(item => item.ref === currentItem)
    const nextMatch = getNextMatch(
      withText.map(item => item.textValue),
      search.current,
      currentMatch?.textValue,
    )
    withText.find(item => item.textValue === nextMatch)?.ref.focus()
  }

  function handleKeyDown(event: ReactKeyboardEvent<HTMLElement>) {
    if (event.defaultPrevented) return
    const target = event.target as HTMLElement
    if (!event.currentTarget.contains(target)) return
    const isKeyDownInside = target.closest(`[${CONTENT_ATTR}]`) === event.currentTarget
    const isKeyDownInTextField = ['input', 'textarea'].includes(target.tagName.toLowerCase())
    const isModifierKey = event.ctrlKey || event.altKey || event.metaKey
    const isCharacterKey = event.key.length === 1
    const element = arrowNavigation(
      event,
      getActiveElement() as HTMLElement | null,
      contentRef.current,
      {
        loop,
        arrowKeyOptions: 'vertical',
        dir: root.dir,
        focus: true,
        attributeName: ENABLED_ITEM_SELECTOR,
      },
    )
    if (element) return element.focus()
    if (event.code === 'Space') return
    const collection = getItems()
    if (isKeyDownInside) {
      if (event.key === 'Tab' && root.modal) event.preventDefault()
      if (!isModifierKey && isCharacterKey && !isKeyDownInTextField)
        handleTypeaheadSearch(event.key, collection)
    }
    if (event.target !== contentRef.current) return
    if (!FIRST_LAST_KEYS.includes(event.key)) return
    event.preventDefault()
    const candidates = collection.map(item => item.ref)
    if (LAST_KEYS.includes(event.key)) candidates.reverse()
    focusFirst(candidates)
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLElement>) {
    if (!isMouseEvent(event)) return
    const target = event.target as HTMLElement
    const pointerXHasChanged = lastPointerX.current !== event.clientX
    if (event.currentTarget.contains(target) && pointerXHasChanged) {
      pointerDir.current = event.clientX > lastPointerX.current ? 'right' : 'left'
      lastPointerX.current = event.clientX
    }
  }

  function handleRovingFocus(event: ReactFocusEvent<HTMLElement>) {
    if (event.target !== event.currentTarget) return
    if (!isClickFocus.current) {
      const entryFocusEvent = new CustomEvent(ENTRY_FOCUS, { bubbles: false, cancelable: true })
      event.currentTarget.dispatchEvent(entryFocusEvent)
      onEntryFocus?.(entryFocusEvent)
      if (!root.isUsingKeyboard.current) entryFocusEvent.preventDefault()
      if (!entryFocusEvent.defaultPrevented) {
        const candidates = getItems().map(item => item.ref)
        const activeItem = candidates.find(item => item.getAttribute('data-active') === '')
        const highlightedItem = candidates.find(
          item => item.getAttribute('data-highlighted') === '',
        )
        focusFirst(
          [activeItem, highlightedItem, ...candidates].filter(
            (item): item is HTMLElement => !!item,
          ),
        )
      }
    }
    isClickFocus.current = false
  }

  const contentContext: MenuContentContextValue = {
    onItemEnter: event => isPointerMovingToSubmenu(event),
    onItemLeave: event => {
      if (isPointerMovingToSubmenu(event)) return true
      const isInputFocused = ['INPUT', 'TEXTAREA'].includes(getActiveElement()?.tagName || '')
      if (!isInputFocused) contentRef.current?.focus()
      return false
    },
    onTriggerLeave: event => isPointerMovingToSubmenu(event),
    highlighted,
    highlightedRef,
    onHighlightedChange,
    activeSubmenu,
    pointerGraceTimer,
    onPointerGraceIntentChange: intent => {
      pointerGraceIntent.current = intent
    },
    register,
  }

  const getLayer = () => contentRef.current
  const anchor = (reference ?? menu.anchor ?? undefined) as PopperContentProps['reference']

  return (
    <MenuContentContext value={contentContext}>
      <FocusScope.Root
        asChild
        trapped={trapFocus}
        onMountAutoFocus={event => {
          onOpenAutoFocus?.(event)
          if (event.defaultPrevented) return
          event.preventDefault()
          contentRef.current?.focus({ preventScroll: true })
        }}
        onUnmountAutoFocus={event => event.preventDefault()}
      >
        <DismissableLayer.Root
          asChild
          disableOutsidePointerEvents={disableOutsidePointerEvents}
          onEscapeKeyDown={onEscapeKeyDown}
          onPointerDownOutside={guardLayer(getLayer, onPointerDownOutside)}
          onFocusOutside={guardLayer(getLayer, onFocusOutside)}
          onInteractOutside={guardLayer(getLayer, onInteractOutside)}
          onDismiss={() => onDismiss?.()}
        >
          <PopperContent
            role="menu"
            aria-orientation="vertical"
            {...props}
            reference={anchor}
            tabIndex={-1}
            data-orientation="vertical"
            {...{ [CONTENT_ATTR]: '' }}
            data-state={getOpenState(menu.open)}
            data-dismissable-layer=""
            dir={root.dir}
            style={{ ...style, outline: 'none' }}
            ref={composedRef}
            onKeyDown={event => {
              handleKeyDown(event)
              onKeyDown?.(event)
            }}
            onPointerMove={event => {
              onPointerMove?.(event)
              handlePointerMove(event)
            }}
            onMouseDown={(event: ReactMouseEvent<HTMLDivElement>) => {
              onMouseDown?.(event)
              if (event.currentTarget.contains(event.target as Node)) isClickFocus.current = true
            }}
            onMouseUp={(event: ReactMouseEvent<HTMLDivElement>) => {
              onMouseUp?.(event)
              setTimeout(() => {
                isClickFocus.current = false
              }, 1)
            }}
            onFocus={event => {
              onFocus?.(event)
              handleRovingFocus(event)
            }}
          />
        </DismissableLayer.Root>
      </FocusScope.Root>
    </MenuContentContext>
  )
}

export interface MenuItemImplProps
  extends PrimitiveProps, Omit<HTMLAttributes<HTMLElement>, 'onSelect'>, DataAttributes {
  disabled?: boolean
  textValue?: string
  ref?: Ref<HTMLElement>
}

function MenuItemImpl({
  disabled,
  textValue,
  as,
  asChild,
  onPointerMove,
  onPointerLeave,
  onFocus,
  onBlur,
  ref,
  ...props
}: MenuItemImplProps) {
  const content = useMenuContentContext('MenuItem')
  const [element, setElement] = useState<HTMLElement | null>(null)
  const elementRef = useRef<HTMLElement | null>(null)
  const composedRef = useComposedRefs(ref, elementRef, setElement)
  const [isFocused, setIsFocused] = useState(false)
  const isHighlighted = isFocused || (element != null && content.highlighted === element)
  const { register } = content

  useLayoutEffect(
    () => (element ? register(element, { textValue }) : undefined),
    [element, textValue, register],
  )

  return (
    <Primitive
      role="menuitem"
      tabIndex={-1}
      {...props}
      {...{ [ITEM_DATA_ATTR]: '' }}
      as={as}
      asChild={asChild}
      aria-disabled={disabled || undefined}
      data-disabled={disabled ? '' : undefined}
      data-highlighted={isHighlighted ? '' : undefined}
      ref={composedRef}
      onPointerMove={(event: ReactPointerEvent<HTMLElement>) => {
        onPointerMove?.(event)
        if (event.defaultPrevented || !isMouseEvent(event)) return
        if (disabled) content.onItemLeave(event)
        else if (!content.onItemEnter(event)) {
          const item = event.currentTarget
          content.onHighlightedChange(item)
          const isInputFocused = ['INPUT', 'TEXTAREA'].includes(getActiveElement()?.tagName || '')
          if (!isInputFocused) item.focus({ preventScroll: true })
        }
      }}
      onPointerLeave={(event: ReactPointerEvent<HTMLElement>) => {
        onPointerLeave?.(event)
        nextTick(() => {
          if (event.defaultPrevented || !isMouseEvent(event)) return
          if (content.highlightedRef.current !== elementRef.current) return
          const isMovingToSubmenu = content.onItemLeave(event)
          if (!isMovingToSubmenu && content.highlightedRef.current === elementRef.current)
            content.onHighlightedChange(undefined)
        })
      }}
      onFocus={(event: ReactFocusEvent<HTMLElement>) => {
        onFocus?.(event)
        if (event.target !== event.currentTarget) return
        const item = event.currentTarget
        nextTick(() => {
          if (event.defaultPrevented || disabled) return
          setIsFocused(true)
          content.onHighlightedChange(event.nativeEvent.currentTarget ? item : null)
        })
      }}
      onBlur={(event: ReactFocusEvent<HTMLElement>) => {
        onBlur?.(event)
        if (event.target !== event.currentTarget) return
        nextTick(() => {
          if (event.defaultPrevented) return
          setIsFocused(false)
        })
      }}
    />
  )
}

export interface MenuItemProps extends MenuItemImplProps {
  onSelect?: (event: Event) => void
}

export function MenuItem({
  disabled,
  onSelect,
  onClick,
  onPointerDown,
  onPointerUp,
  onKeyDown,
  ref,
  ...props
}: MenuItemProps) {
  const root = useMenuRootContext('MenuItem')
  const element = useRef<HTMLElement | null>(null)
  const composedRef = useComposedRefs(ref, element)
  const isPointerDown = useRef(false)

  function handleSelect() {
    const menuItem = element.current
    if (disabled || !menuItem) return
    const itemSelectEvent = new CustomEvent(ITEM_SELECT, { bubbles: true, cancelable: true })
    onSelect?.(itemSelectEvent)
    nextTick(() => {
      if (itemSelectEvent.defaultPrevented) isPointerDown.current = false
      else root.onClose()
    })
  }

  return (
    <MenuItemImpl
      {...props}
      disabled={disabled}
      ref={composedRef}
      onClick={event => {
        handleSelect()
        onClick?.(event)
      }}
      onPointerDown={event => {
        isPointerDown.current = true
        onPointerDown?.(event)
      }}
      onPointerUp={event => {
        const item = event.currentTarget
        nextTick(() => {
          if (event.defaultPrevented) return
          if (!isPointerDown.current && event.nativeEvent.currentTarget) item.click()
        })
        onPointerUp?.(event)
      }}
      onKeyDown={event => {
        if (!disabled && SELECTION_KEYS.includes(event.key)) {
          event.currentTarget.click()
          event.preventDefault()
        }
        onKeyDown?.(event)
      }}
    />
  )
}

export interface MenuCheckboxItemProps extends Omit<MenuItemProps, 'children'> {
  checked?: CheckedState
  onCheckedChange?: (checked: boolean) => void
  children?: ReactNode
}

export function MenuCheckboxItem({
  checked = false,
  onCheckedChange,
  onSelect,
  ...props
}: MenuCheckboxItemProps) {
  return (
    <MenuItemIndicatorContext value={{ checked }}>
      <MenuItem
        role="menuitemcheckbox"
        {...props}
        aria-checked={isIndeterminate(checked) ? 'mixed' : checked}
        data-state={getCheckedState(checked)}
        onSelect={event => {
          onSelect?.(event)
          onCheckedChange?.(isIndeterminate(checked) ? true : !checked)
        }}
      />
    </MenuItemIndicatorContext>
  )
}

export interface MenuGroupProps
  extends PrimitiveProps, HTMLAttributes<HTMLElement>, DataAttributes {
  ref?: Ref<HTMLElement>
}

export function MenuGroup(props: MenuGroupProps) {
  const id = useId()
  return (
    <MenuGroupContext value={{ id }}>
      <Primitive role="group" aria-labelledby={id} {...props} />
    </MenuGroupContext>
  )
}

export interface MenuRadioGroupProps extends Omit<MenuGroupProps, 'defaultValue'> {
  value?: string
  onValueChange?: (value: string) => void
}

export function MenuRadioGroup({ value = '', onValueChange, ...props }: MenuRadioGroupProps) {
  const handleValueChange = useCallbackRef((next: string) => onValueChange?.(next))
  const context = useMemo(
    () => ({ value, onValueChange: handleValueChange }),
    [value, handleValueChange],
  )
  return (
    <MenuRadioGroupContext value={context}>
      <MenuGroup {...props} />
    </MenuRadioGroupContext>
  )
}

export interface MenuRadioItemProps extends MenuItemProps {
  value: string
}

export function MenuRadioItem({ value, onSelect, ...props }: MenuRadioItemProps) {
  const group = required(useContext(MenuRadioGroupContext), 'MenuRadioItem', 'MenuRadioGroup')
  const checked = group.value === value
  return (
    <MenuItemIndicatorContext value={{ checked }}>
      <MenuItem
        role="menuitemradio"
        {...props}
        aria-checked={checked}
        data-state={getCheckedState(checked)}
        onSelect={event => {
          onSelect?.(event)
          group.onValueChange(value)
        }}
      />
    </MenuItemIndicatorContext>
  )
}

export interface MenuItemIndicatorProps
  extends PrimitiveProps, HTMLAttributes<HTMLElement>, DataAttributes {
  forceMount?: boolean
  ref?: Ref<HTMLElement>
}

export function MenuItemIndicator({ forceMount, as = 'span', ...props }: MenuItemIndicatorProps) {
  const { checked } = useContext(MenuItemIndicatorContext)
  return (
    <Presence.Root present={!!forceMount || isIndeterminate(checked) || checked === true}>
      <Primitive as={as} data-state={getCheckedState(checked)} {...props} />
    </Presence.Root>
  )
}

export interface MenuLabelProps
  extends PrimitiveProps, HTMLAttributes<HTMLElement>, DataAttributes {
  ref?: Ref<HTMLElement>
}

export function MenuLabel({ as = 'div', ...props }: MenuLabelProps) {
  const group = useContext(MenuGroupContext)
  return <Primitive as={as} id={group.id || undefined} {...props} />
}

export interface MenuSeparatorProps
  extends PrimitiveProps, HTMLAttributes<HTMLElement>, DataAttributes {
  ref?: Ref<HTMLElement>
}

export function MenuSeparator(props: MenuSeparatorProps) {
  return <Primitive role="separator" aria-orientation="horizontal" {...props} />
}

export interface MenuSubTriggerProps extends MenuItemImplProps {}

export function MenuSubTrigger({
  disabled,
  onClick,
  onPointerMove,
  onPointerLeave,
  onKeyDown,
  ref,
  ...props
}: MenuSubTriggerProps) {
  const menu = useMenuContext('MenuSubTrigger')
  const root = useMenuRootContext('MenuSubTrigger')
  const sub = useMenuSubContext('MenuSubTrigger')
  const content = useMenuContentContext('MenuSubTrigger')
  const id = useId()
  if (!sub.triggerId.current) sub.triggerId.current = id
  const openTimer = useRef<number | null>(null)
  const anchor = useMenuAnchor()
  const composedRef = useComposedRefs(ref, anchor, sub.onTriggerChange)
  const triggerRef = useRef(sub.trigger)
  triggerRef.current = sub.trigger
  const [focusRequest, setFocusRequest] = useState(0)
  const handledFocusRequest = useRef(0)
  const opened = useRef(menu.open)
  const { activeSubmenu } = content

  useEffect(() => {
    if (opened.current === menu.open) return
    opened.current = menu.open
    if (menu.open)
      activeSubmenu.current = {
        onOpenChange: menu.onOpenChange,
        trigger: () => triggerRef.current,
      }
    else if (activeSubmenu.current?.trigger() === triggerRef.current)
      activeSubmenu.current = undefined
  }, [menu.open, menu.onOpenChange, activeSubmenu])

  useEffect(() => {
    if (focusRequest === handledFocusRequest.current || !menu.content) return
    handledFocusRequest.current = focusRequest
    menu.content.focus()
  }, [focusRequest, menu.content])

  function clearOpenTimer() {
    if (openTimer.current) window.clearTimeout(openTimer.current)
    openTimer.current = null
  }

  useEffect(() => clearOpenTimer, [])

  const openSubmenu = useCallbackRef(() => menu.onOpenChange(true))

  return (
    <MenuItemImpl
      disabled={disabled}
      {...props}
      id={sub.triggerId.current}
      ref={composedRef}
      aria-haspopup="menu"
      aria-expanded={menu.open}
      aria-controls={sub.contentId.current}
      data-state={getOpenState(menu.open)}
      onClick={event => {
        if (!disabled && !event.defaultPrevented) {
          event.currentTarget.focus()
          if (!menu.open) menu.onOpenChange(true)
        }
        onClick?.(event)
      }}
      onPointerMove={event => {
        if (isMouseEvent(event) && !content.onItemEnter(event)) {
          if (!disabled && !menu.open && !openTimer.current) {
            content.onPointerGraceIntentChange(null)
            openTimer.current = window.setTimeout(() => {
              openSubmenu()
              clearOpenTimer()
            }, 100)
          }
        }
        onPointerMove?.(event)
      }}
      onPointerLeave={event => {
        if (isMouseEvent(event)) {
          clearOpenTimer()
          const contentRect = menu.content?.getBoundingClientRect()
          if (contentRect?.width) {
            const side = menu.content?.dataset.side as Side
            const rightSide = side === 'right'
            const bleed = rightSide ? -5 : +5
            const contentNearEdge = contentRect[rightSide ? 'left' : 'right']
            const contentFarEdge = contentRect[rightSide ? 'right' : 'left']
            content.onPointerGraceIntentChange({
              area: [
                { x: event.clientX + bleed, y: event.clientY },
                { x: contentNearEdge, y: contentRect.top },
                { x: contentFarEdge, y: contentRect.top },
                { x: contentFarEdge, y: contentRect.bottom },
                { x: contentNearEdge, y: contentRect.bottom },
              ],
              side,
            })
            window.clearTimeout(content.pointerGraceTimer.current)
            content.pointerGraceTimer.current = window.setTimeout(
              () => content.onPointerGraceIntentChange(null),
              300,
            )
          } else if (!content.onTriggerLeave(event)) content.onPointerGraceIntentChange(null)
        }
        onPointerLeave?.(event)
      }}
      onKeyDown={event => {
        if (!disabled && SUB_OPEN_KEYS[root.dir].includes(event.key)) {
          menu.onOpenChange(true)
          setFocusRequest(request => request + 1)
          event.preventDefault()
        }
        onKeyDown?.(event)
      }}
    />
  )
}

export type MenuSubContentProps = Omit<
  MenuContentImplProps,
  | 'trapFocus'
  | 'disableOutsidePointerEvents'
  | 'disableOutsideScroll'
  | 'side'
  | 'align'
  | 'onDismiss'
> & {
  forceMount?: boolean
}

export function MenuSubContent({
  forceMount,
  prioritizePosition = true,
  onOpenAutoFocus,
  onCloseAutoFocus,
  onFocusOutside,
  onEscapeKeyDown,
  onKeyDown,
  ref,
  ...props
}: MenuSubContentProps) {
  const menu = useMenuContext('MenuSubContent')
  const root = useMenuRootContext('MenuSubContent')
  const sub = useMenuSubContext('MenuSubContent')
  const element = useRef<HTMLElement | null>(null)
  const composedRef = useComposedRefs(ref, element)
  const id = useId()
  if (!sub.contentId.current) sub.contentId.current = id

  return (
    <Presence.Root present={!!forceMount || menu.open}>
      <MenuContentImpl
        {...props}
        prioritizePosition={prioritizePosition}
        id={sub.contentId.current}
        ref={composedRef}
        aria-labelledby={sub.triggerId.current}
        align="start"
        side={root.dir === 'rtl' ? 'left' : 'right'}
        disableOutsidePointerEvents={false}
        disableOutsideScroll={false}
        trapFocus={false}
        onDismiss={() => menu.onOpenChange(false)}
        onOpenAutoFocus={event => {
          onOpenAutoFocus?.(event)
          event.preventDefault()
          if (root.isUsingKeyboard.current) element.current?.focus()
        }}
        onCloseAutoFocus={event => {
          onCloseAutoFocus?.(event)
          event.preventDefault()
        }}
        onFocusOutside={event => {
          onFocusOutside?.(event)
          if (event.defaultPrevented) return
          if (event.target !== sub.trigger) menu.onOpenChange(false)
        }}
        onEscapeKeyDown={event => {
          onEscapeKeyDown?.(event)
          root.onClose()
          event.preventDefault()
        }}
        onKeyDown={event => {
          const isKeyDownInside = event.currentTarget.contains(event.target as HTMLElement)
          const isCloseKey = SUB_CLOSE_KEYS[root.dir].includes(event.key)
          if (isKeyDownInside && isCloseKey) {
            menu.onOpenChange(false)
            sub.trigger?.focus()
            event.preventDefault()
          }
          onKeyDown?.(event)
        }}
      />
    </Presence.Root>
  )
}

export interface MenuArrowProps extends PopperArrowProps {}

export function MenuArrow(props: MenuArrowProps) {
  return <PopperArrow {...props} />
}
