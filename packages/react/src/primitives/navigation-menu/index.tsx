'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent as ReactFocusEvent,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
  type RefObject,
} from 'react'
import { flushSync } from 'react-dom'
import { Primitive, type PrimitiveProps } from '../../lib/primitive'
import { PrimitiveVisuallyHidden } from '../visually-hidden'
import { arrowNavigation } from '../../../../shared/src/primitives/arrow-navigation'
import { getActiveElement } from '../../../../shared/src/primitives/focus-scope'
import {
  EVENT_ROOT_CONTENT_DISMISS,
  LINK_SELECT,
  focusFirst,
  getOpenState,
  getTabbableCandidates,
  makeContentId,
  makeTriggerId,
  removeFromTabOrder,
  whenMouse,
} from './utils'
import { DismissableLayer } from '../dismissable-layer'
import { Portal as HnPortal } from '../portal'
import { Presence } from '../presence'
import { useComposedRefs } from '../utils/compose-refs'
import { useControllableState } from '../utils/controllable-state'
import { useDirection } from '../utils/direction'
import { useLayoutEffect } from '../utils/layout-effect'

type DataAttributes = { [attribute: `data-${string}`]: string | undefined }
type Orientation = 'horizontal' | 'vertical'
type Handler<E> = ((event: E) => void) | undefined

const ITEM_ATTRIBUTE = 'data-radix-collection-item'

function chain<E>(first: Handler<E>, second: (event: E) => void) {
  return (event: E) => {
    first?.(event)
    second(event)
  }
}

function useAutoReset(afterMs: number) {
  const value = useRef(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])
  return {
    get: () => value.current,
    set: (next: boolean) => {
      value.current = next
      clearTimeout(timer.current)
      timer.current = setTimeout(() => {
        value.current = false
      }, afterMs)
    },
  }
}

interface NavigationMenuContextValue {
  isRootMenu: boolean
  modelValue: string
  previousValue: string
  baseId: string
  disableClickTrigger: boolean
  disableHoverTrigger: boolean
  dir: 'ltr' | 'rtl'
  unmountOnHide: boolean
  orientation: Orientation
  rootNavigationMenu: RefObject<HTMLElement | null>
  activeTrigger: RefObject<HTMLElement | null>
  viewport: HTMLElement | null
  onViewportChange: (element: HTMLElement | null) => void
  onTriggerEnter: (value: string) => void
  onTriggerLeave: () => void
  onContentEnter: () => void
  onContentLeave: () => void
  onItemSelect: (value: string) => void
  onItemDismiss: () => void
  registerItem: (element: HTMLElement) => () => void
  getItems: (includeDisabled?: boolean) => HTMLElement[]
}

const NavigationMenuContext = createContext<NavigationMenuContextValue | null>(null)

function useNavigationMenuContext(consumer: string) {
  const context = useContext(NavigationMenuContext)
  if (!context) throw new Error(`\`${consumer}\` must be used within \`NavigationMenuRoot\``)
  return context
}

export function useNavigationMenuModelValue() {
  return useNavigationMenuContext('NavigationMenuRoot').modelValue
}

function useCollectionItem(element: HTMLElement | null) {
  const context = useNavigationMenuContext('NavigationMenuCollectionItem')
  const { registerItem } = context
  useLayoutEffect(() => {
    if (!element) return
    return registerItem(element)
  }, [element, registerItem])
}

export interface NavigationMenuRootProps
  extends
    PrimitiveProps,
    Omit<HTMLAttributes<HTMLElement>, 'defaultValue' | 'dir' | 'children'>,
    DataAttributes {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  dir?: 'ltr' | 'rtl'
  orientation?: Orientation
  delayDuration?: number
  skipDelayDuration?: number
  disableClickTrigger?: boolean
  disableHoverTrigger?: boolean
  disablePointerLeaveClose?: boolean
  unmountOnHide?: boolean
  children?: ReactNode | ((props: { modelValue: string }) => ReactNode)
  ref?: Ref<HTMLElement>
}

export function NavigationMenuRoot({
  value,
  defaultValue,
  onValueChange,
  dir: dirProp,
  orientation = 'horizontal',
  delayDuration = 200,
  skipDelayDuration = 300,
  disableClickTrigger = false,
  disableHoverTrigger = false,
  disablePointerLeaveClose,
  unmountOnHide = true,
  as = 'nav',
  asChild,
  children,
  ref,
  ...attrs
}: NavigationMenuRootProps) {
  const dir = useDirection(dirProp)
  const [modelValue = '', setModelValue] = useControllableState<string>({
    prop: value,
    defaultProp: defaultValue ?? '',
    onChange: onValueChange,
    caller: 'NavigationMenuRoot',
  })
  const [previousValue, setPreviousValue] = useState('')
  const baseId = `radix-navigation-menu-${useId()}`
  const rootNavigationMenu = useRef<HTMLElement | null>(null)
  const composedRef = useComposedRefs(ref, rootNavigationMenu)
  const activeTrigger = useRef<HTMLElement | null>(null)
  const [viewport, setViewport] = useState<HTMLElement | null>(null)
  const items = useRef(new Set<HTMLElement>())
  const model = useRef(modelValue)
  model.current = modelValue
  const latest = useRef({ delayDuration, skipDelayDuration, disablePointerLeaveClose })
  latest.current = { delayDuration, skipDelayDuration, disablePointerLeaveClose }
  const skipNextClose = useRef(false)
  const delaySkipped = useRef(false)
  const delaySkippedTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(
    () => () => {
      clearTimeout(delaySkippedTimer.current)
      clearTimeout(debounceTimer.current)
    },
    [],
  )

  const select = useCallback(
    (next: string) => {
      setPreviousValue(model.current)
      setModelValue(next)
    },
    [setModelValue],
  )

  const skipDelay = useCallback(() => {
    delaySkipped.current = true
    clearTimeout(delaySkippedTimer.current)
    delaySkippedTimer.current = setTimeout(() => {
      delaySkipped.current = false
    }, latest.current.skipDelayDuration)
  }, [])

  const debounced = useCallback(
    (next?: string) => {
      const run = () => {
        if (typeof next !== 'string') return
        if (next === '' && skipNextClose.current) {
          skipNextClose.current = false
          return
        }
        select(next)
        if (next === '') skipDelay()
      }
      clearTimeout(debounceTimer.current)
      const delay =
        model.current !== '' || delaySkipped.current ? 150 : latest.current.delayDuration
      if (delay <= 0) {
        run()
        return
      }
      debounceTimer.current = setTimeout(run, delay)
    },
    [select, skipDelay],
  )

  const getItems = useCallback((includeDisabled = false) => {
    const root = rootNavigationMenu.current
    if (!root) return []
    const ordered = Array.from(root.querySelectorAll(`[${ITEM_ATTRIBUTE}]`))
    const order = new Map(ordered.map((node, index) => [node, index]))
    const list = Array.from(items.current).sort(
      (a, b) => (order.get(a) ?? -1) - (order.get(b) ?? -1),
    )
    return includeDisabled ? list : list.filter(item => item.dataset.disabled !== '')
  }, [])

  const registerItem = useCallback((element: HTMLElement) => {
    items.current.add(element)
    return () => {
      items.current.delete(element)
    }
  }, [])

  const onItemDismiss = useCallback(() => select(''), [select])

  useLayoutEffect(() => {
    if (!modelValue) return
    activeTrigger.current =
      getItems().find(item => item.id.includes(modelValue)) ?? (null as HTMLElement | null)
  })

  useEffect(() => {
    const root = rootNavigationMenu.current
    if (!root) return
    root.addEventListener(EVENT_ROOT_CONTENT_DISMISS, onItemDismiss)
    return () => root.removeEventListener(EVENT_ROOT_CONTENT_DISMISS, onItemDismiss)
  }, [onItemDismiss])

  const context: NavigationMenuContextValue = {
    isRootMenu: true,
    modelValue,
    previousValue,
    baseId,
    disableClickTrigger,
    disableHoverTrigger,
    dir,
    unmountOnHide,
    orientation,
    rootNavigationMenu,
    activeTrigger,
    viewport,
    onViewportChange: setViewport,
    onTriggerEnter: next => {
      if (model.current !== '') {
        skipNextClose.current = true
        select(next)
      } else debounced(next)
    },
    onTriggerLeave: () => {
      skipNextClose.current = false
      debounced('')
    },
    onContentEnter: () => debounced(),
    onContentLeave: () => {
      if (!latest.current.disablePointerLeaveClose) {
        skipNextClose.current = false
        debounced('')
      }
    },
    onItemSelect: select,
    onItemDismiss,
    registerItem,
    getItems,
  }

  return (
    <NavigationMenuContext value={context}>
      <Primitive
        {...attrs}
        ref={composedRef}
        as={as}
        asChild={asChild}
        data-orientation={orientation}
        dir={dir}
        data-radix-navigation-menu=""
      >
        {typeof children === 'function' ? children({ modelValue }) : children}
      </Primitive>
    </NavigationMenuContext>
  )
}

export interface NavigationMenuListProps
  extends PrimitiveProps, HTMLAttributes<HTMLElement>, DataAttributes {
  ref?: Ref<HTMLElement>
}

export function NavigationMenuList({ as = 'ul', asChild, ref, ...attrs }: NavigationMenuListProps) {
  const menu = useNavigationMenuContext('NavigationMenuList')
  return (
    <Primitive ref={ref} style={{ position: 'relative' }}>
      <Primitive {...attrs} asChild={asChild} as={as} data-orientation={menu.orientation} />
    </Primitive>
  )
}

interface NavigationMenuItemContextValue {
  value: string
  contentId: string
  triggerRef: RefObject<HTMLElement | null>
  focusProxyRef: RefObject<HTMLElement | null>
  wasEscapeCloseRef: RefObject<boolean>
  onEntryKeyDown: (side?: 'start' | 'end') => void
  onFocusProxyEnter: (side?: 'start' | 'end') => void
  onContentFocusOutside: () => void
  onRootContentClose: () => void
}

const NavigationMenuItemContext = createContext<NavigationMenuItemContextValue | null>(null)

function useNavigationMenuItemContext(consumer: string) {
  const context = useContext(NavigationMenuItemContext)
  if (!context) throw new Error(`\`${consumer}\` must be used within \`NavigationMenuItem\``)
  return context
}

const ITEM_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End', ' ']

export interface NavigationMenuItemProps
  extends PrimitiveProps, HTMLAttributes<HTMLElement>, DataAttributes {
  value?: string
  ref?: Ref<HTMLElement>
}

export function NavigationMenuItem({
  value: valueProp,
  as = 'li',
  asChild,
  onKeyDown,
  ...attrs
}: NavigationMenuItemProps) {
  const menu = useNavigationMenuContext('NavigationMenuItem')
  const generated = useId()
  const value = valueProp || `radix-${generated}`
  const triggerRef = useRef<HTMLElement | null>(null)
  const focusProxyRef = useRef<HTMLElement | null>(null)
  const wasEscapeCloseRef = useRef(false)
  const contentId = makeContentId(menu.baseId, value)
  const restoreContentTabOrder = useRef<() => void>(() => {})

  function handleContentEntry(side: 'start' | 'end' = 'start') {
    const element = document.getElementById(contentId)
    if (element) {
      restoreContentTabOrder.current()
      const candidates = getTabbableCandidates(element)
      if (candidates.length) focusFirst(side === 'start' ? candidates : candidates.reverse())
    }
  }

  function handleContentExit() {
    const element = document.getElementById(contentId)
    if (element) {
      const candidates = getTabbableCandidates(element)
      if (candidates.length) restoreContentTabOrder.current = removeFromTabOrder(candidates)
    }
  }

  function handleClose() {
    menu.onItemDismiss()
    triggerRef.current?.focus()
  }

  function handleKeyDown(event: ReactKeyboardEvent<HTMLElement>) {
    if (!ITEM_KEYS.includes(event.key)) return
    if (!event.currentTarget.contains(event.target as Node)) return
    const currentFocus = getActiveElement() as HTMLElement | null
    if (event.keyCode === 32 || event.key === 'Enter') {
      if (menu.modelValue === value) {
        handleClose()
        event.preventDefault()
        return
      }
      ;(event.target as HTMLElement).click()
      event.preventDefault()
      return
    }
    const itemsArray = menu
      .getItems()
      .filter(item => item.parentElement?.hasAttribute('data-menu-item'))
    if (!currentFocus || !itemsArray.includes(currentFocus)) return
    const next = arrowNavigation(event.nativeEvent, currentFocus, undefined, {
      itemsArray,
      loop: false,
    })
    next?.focus()
    event.preventDefault()
    event.stopPropagation()
  }

  return (
    <NavigationMenuItemContext
      value={{
        value,
        contentId,
        triggerRef,
        focusProxyRef,
        wasEscapeCloseRef,
        onEntryKeyDown: handleContentEntry,
        onFocusProxyEnter: handleContentEntry,
        onContentFocusOutside: handleContentExit,
        onRootContentClose: handleContentExit,
      }}
    >
      <Primitive
        asChild={asChild}
        as={as}
        data-menu-item=""
        {...attrs}
        onKeyDown={chain(handleKeyDown, event => onKeyDown?.(event))}
      />
    </NavigationMenuItemContext>
  )
}

export interface NavigationMenuTriggerProps
  extends PrimitiveProps, HTMLAttributes<HTMLElement>, DataAttributes {
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  ref?: Ref<HTMLElement>
}

export function NavigationMenuTrigger({
  disabled,
  as = 'button',
  asChild,
  ref,
  onPointerEnter,
  onPointerMove,
  onPointerLeave,
  onClick,
  onKeyDown,
  ...attrs
}: NavigationMenuTriggerProps) {
  const menu = useNavigationMenuContext('NavigationMenuTrigger')
  const item = useNavigationMenuItemContext('NavigationMenuTrigger')
  const [element, setElement] = useState<HTMLElement | null>(null)
  const triggerElement = useRef<HTMLElement | null>(null)
  const composedRef = useComposedRefs(ref, triggerElement, setElement)
  const [triggerId, setTriggerId] = useState('')
  const [contentId, setContentId] = useState('')
  const hasPointerMoveOpened = useAutoReset(300)
  const wasClickClose = useRef(false)
  const open = item.value === menu.modelValue
  useCollectionItem(element)

  useLayoutEffect(() => {
    item.triggerRef.current = triggerElement.current
    setTriggerId(makeTriggerId(menu.baseId, item.value))
    setContentId(makeContentId(menu.baseId, item.value))
  }, [])

  function handlePointerEnter() {
    if (menu.disableHoverTrigger) return
    wasClickClose.current = false
    item.wasEscapeCloseRef.current = false
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLElement>) {
    if (menu.disableHoverTrigger) return
    if (event.pointerType === 'mouse') {
      if (
        disabled ||
        wasClickClose.current ||
        item.wasEscapeCloseRef.current ||
        hasPointerMoveOpened.get()
      )
        return
      menu.onTriggerEnter(item.value)
      hasPointerMoveOpened.set(true)
    }
  }

  function handlePointerLeave(event: ReactPointerEvent<HTMLElement>) {
    if (menu.disableHoverTrigger) return
    if (event.pointerType === 'mouse') {
      if (disabled) return
      menu.onTriggerLeave()
      hasPointerMoveOpened.set(false)
    }
  }

  function handleClick(event: ReactMouseEvent<HTMLElement>) {
    const native = event.nativeEvent as MouseEvent & { pointerType?: string }
    if ((!('pointerType' in native) || native.pointerType === 'mouse') && menu.disableClickTrigger)
      return
    if (hasPointerMoveOpened.get()) return
    if (open) menu.onItemSelect('')
    else menu.onItemSelect(item.value)
    wasClickClose.current = open
  }

  function handleKeyDown(event: ReactKeyboardEvent<HTMLElement>) {
    const verticalEntryKey = menu.dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight'
    const entryKey = { horizontal: 'ArrowDown', vertical: verticalEntryKey }[menu.orientation]
    if (open && event.key === entryKey) {
      item.onEntryKeyDown()
      event.preventDefault()
      event.stopPropagation()
    }
  }

  function setFocusProxyRef(node: HTMLElement | null) {
    if (!node) return
    item.focusProxyRef.current = node
  }

  function handleVisuallyHiddenFocus(event: ReactFocusEvent<HTMLElement>) {
    const content = document.getElementById(item.contentId)
    const prevFocusedElement = event.relatedTarget as Node | null
    const wasTriggerFocused = prevFocusedElement === triggerElement.current
    const wasFocusFromContent = content?.contains(prevFocusedElement)
    if (wasTriggerFocused || !wasFocusFromContent)
      item.onFocusProxyEnter(wasTriggerFocused ? 'start' : 'end')
  }

  return (
    <>
      <Primitive
        id={triggerId}
        ref={composedRef}
        {...({ disabled } as HTMLAttributes<HTMLElement>)}
        data-disabled={disabled ? '' : undefined}
        data-state={getOpenState(open)}
        data-navigation-menu-trigger=""
        aria-expanded={open}
        aria-controls={contentId}
        asChild={asChild}
        as={as}
        {...{ [ITEM_ATTRIBUTE]: '' }}
        {...attrs}
        onPointerEnter={chain(onPointerEnter, handlePointerEnter)}
        onPointerMove={chain(onPointerMove, handlePointerMove)}
        onPointerLeave={chain(onPointerLeave, handlePointerLeave)}
        onClick={chain(onClick, handleClick)}
        onKeyDown={chain(onKeyDown, handleKeyDown)}
      />
      {open ? (
        <>
          <PrimitiveVisuallyHidden
            ref={setFocusProxyRef}
            aria-hidden="true"
            tabIndex={0}
            onFocus={handleVisuallyHiddenFocus}
          />
          <span aria-owns={contentId} />
        </>
      ) : null}
    </>
  )
}

function NavigationPresence({
  present,
  forceMount,
  children,
}: {
  present: boolean
  forceMount: boolean
  children: (present: boolean) => ReactElement
}) {
  return (
    <Presence present={present}>
      {forceMount ? ({ present: isPresent }) => children(isPresent) : children(true)}
    </Presence>
  )
}

type PointerDownOutsideEvent = CustomEvent<{ originalEvent: PointerEvent }>
type FocusOutsideEvent = CustomEvent<{ originalEvent: FocusEvent }>

interface NavigationMenuContentEvents {
  onEscapeKeyDown?: (event: KeyboardEvent) => void
  onPointerDownOutside?: (event: PointerDownOutsideEvent) => void
  onFocusOutside?: (event: FocusOutsideEvent) => void
  onInteractOutside?: (event: PointerDownOutsideEvent | FocusOutsideEvent) => void
  onDismiss?: () => void
}

export interface NavigationMenuContentProps
  extends
    PrimitiveProps,
    NavigationMenuContentEvents,
    Omit<HTMLAttributes<HTMLElement>, keyof NavigationMenuContentEvents>,
    DataAttributes {
  forceMount?: boolean
  disableOutsidePointerEvents?: boolean
  ref?: Ref<HTMLElement>
}

export function NavigationMenuContent({ forceMount, ...props }: NavigationMenuContentProps) {
  const menu = useNavigationMenuContext('NavigationMenuContent')
  const item = useNavigationMenuItemContext('NavigationMenuContent')
  const open = item.value === menu.modelValue
  const isLastActiveValue =
    menu.viewport && !menu.modelValue && menu.previousValue
      ? menu.previousValue === item.value
      : false
  const presence = (
    <NavigationPresence
      present={!!forceMount || open || isLastActiveValue}
      forceMount={!menu.unmountOnHide}
    >
      {present => (
        <NavigationMenuContentImpl
          data-state={getOpenState(open)}
          {...props}
          style={{ pointerEvents: !open && menu.isRootMenu ? 'none' : undefined, ...props.style }}
          hidden={!present}
          onContentPointerEnter={() => menu.onContentEnter()}
          onContentPointerLeave={whenMouse(() => menu.onContentLeave())}
        />
      )}
    </NavigationPresence>
  )
  return menu.viewport ? (
    <HnPortal asChild container={menu.viewport}>
      {presence}
    </HnPortal>
  ) : (
    presence
  )
}

interface NavigationMenuContentImplProps extends NavigationMenuContentProps {
  onContentPointerEnter: (event: PointerEvent) => void
  onContentPointerLeave: (event: PointerEvent) => void
}

function NavigationMenuContentImpl({
  disableOutsidePointerEvents,
  onEscapeKeyDown,
  onPointerDownOutside,
  onFocusOutside,
  onInteractOutside,
  onDismiss,
  onContentPointerEnter,
  onContentPointerLeave,
  onKeyDown,
  ref,
  ...attrs
}: NavigationMenuContentImplProps) {
  const menu = useNavigationMenuContext('NavigationMenuContentImpl')
  const item = useNavigationMenuItemContext('NavigationMenuContentImpl')
  const [element, setElement] = useState<HTMLElement | null>(null)
  const composedRef = useComposedRefs(ref, setElement)
  const triggerId = makeTriggerId(menu.baseId, item.value)
  const contentId = makeContentId(menu.baseId, item.value)
  const prevMotionAttribute = useRef<string | null>(null)
  const listeners = useRef({ onContentPointerEnter, onContentPointerLeave })
  listeners.current = { onContentPointerEnter, onContentPointerLeave }

  const motionAttribute = (() => {
    const values = menu.getItems().map(node => node.id.split('trigger-')[1])
    if (menu.dir === 'rtl') values.reverse()
    const index = values.indexOf(menu.modelValue)
    const prevIndex = values.indexOf(menu.previousValue)
    const isSelected = item.value === menu.modelValue
    const wasSelected = prevIndex === values.indexOf(item.value)
    if (!isSelected && !wasSelected) return prevMotionAttribute.current
    const attribute = (() => {
      if (index !== prevIndex) {
        if (isSelected && prevIndex !== -1) return index > prevIndex ? 'from-end' : 'from-start'
        if (wasSelected && index !== -1) return index > prevIndex ? 'to-start' : 'to-end'
      }
      return null
    })()
    prevMotionAttribute.current = attribute
    return attribute
  })()

  useEffect(() => {
    if (!element) return
    const enter = (event: PointerEvent) => listeners.current.onContentPointerEnter(event)
    const leave = (event: PointerEvent) => listeners.current.onContentPointerLeave(event)
    element.addEventListener('pointerenter', enter)
    element.addEventListener('pointerleave', leave)
    return () => {
      element.removeEventListener('pointerenter', enter)
      element.removeEventListener('pointerleave', leave)
    }
  }, [element])

  const { onItemDismiss } = menu
  const { onRootContentClose, triggerRef } = item
  useEffect(() => {
    if (!menu.isRootMenu || !element) return
    const handleClose = () => {
      onItemDismiss()
      onRootContentClose()
      if (element.contains(getActiveElement())) triggerRef.current?.focus()
    }
    element.addEventListener(EVENT_ROOT_CONTENT_DISMISS, handleClose)
    return () => element.removeEventListener(EVENT_ROOT_CONTENT_DISMISS, handleClose)
  })

  function handleFocusOutside(event: FocusOutsideEvent) {
    onFocusOutside?.(event)
    onInteractOutside?.(event)
    const target = event.detail.originalEvent.target as HTMLElement
    if (target.hasAttribute?.('data-navigation-menu-trigger')) event.preventDefault()
    if (!event.defaultPrevented) {
      item.onContentFocusOutside()
      const eventTarget = event.target as Node
      if (menu.rootNavigationMenu.current?.contains(eventTarget)) event.preventDefault()
    }
  }

  function handlePointerDownOutside(event: PointerDownOutsideEvent) {
    onPointerDownOutside?.(event)
    if (!event.defaultPrevented) {
      const target = event.target as Node
      const isTrigger = menu.getItems().some(node => node.contains(target))
      const isRootViewport = menu.isRootMenu && menu.viewport?.contains(target)
      if (isTrigger || isRootViewport || !menu.isRootMenu) event.preventDefault()
    }
  }

  function handleEscapeKeyDown(event: KeyboardEvent) {
    onEscapeKeyDown?.(event)
    if (!event.defaultPrevented) {
      menu.onItemDismiss()
      item.triggerRef.current?.focus()
      item.wasEscapeCloseRef.current = true
    }
  }

  function handleKeyDown(event: ReactKeyboardEvent<HTMLElement>) {
    const target = event.target as HTMLElement
    if (target.closest('[data-radix-navigation-menu]') !== menu.rootNavigationMenu.current) return
    const isMetaKey = event.altKey || event.ctrlKey || event.metaKey
    const isTabKey = event.key === 'Tab' && !isMetaKey
    const candidates = getTabbableCandidates(event.currentTarget)
    if (isTabKey) {
      const focusedElement = getActiveElement()
      const index = candidates.findIndex(candidate => candidate === focusedElement)
      const isMovingBackwards = event.shiftKey
      const nextCandidates = isMovingBackwards
        ? candidates.slice(0, index).reverse()
        : candidates.slice(index + 1, candidates.length)
      if (focusFirst(nextCandidates)) event.preventDefault()
      else {
        item.focusProxyRef.current?.focus()
        return
      }
    }
    const next = arrowNavigation(
      event.nativeEvent,
      getActiveElement() as HTMLElement | null,
      undefined,
      { itemsArray: candidates, loop: false, enableIgnoredElement: true },
    )
    next?.focus()
  }

  function handleDismiss() {
    if (menu.modelValue === item.value)
      element?.dispatchEvent(
        new Event(EVENT_ROOT_CONTENT_DISMISS, { bubbles: true, cancelable: true }),
      )
    onDismiss?.()
  }

  return (
    <DismissableLayer
      asChild
      disableOutsidePointerEvents={disableOutsidePointerEvents}
      onEscapeKeyDown={handleEscapeKeyDown}
      onPointerDownOutside={handlePointerDownOutside}
      onFocusOutside={handleFocusOutside}
      onDismiss={handleDismiss}
    >
      <Primitive
        id={contentId}
        aria-labelledby={triggerId}
        data-motion={motionAttribute ?? undefined}
        data-state={getOpenState(menu.modelValue === item.value)}
        data-orientation={menu.orientation}
        {...attrs}
        data-dismissable-layer=""
        ref={composedRef}
        onKeyDown={chain(handleKeyDown, event => onKeyDown?.(event))}
      />
    </DismissableLayer>
  )
}

export interface NavigationMenuViewportProps
  extends PrimitiveProps, HTMLAttributes<HTMLElement>, DataAttributes {
  forceMount?: boolean
  align?: 'start' | 'center' | 'end'
  ref?: Ref<HTMLElement>
}

export function NavigationMenuViewport({
  forceMount,
  align = 'center',
  ...props
}: NavigationMenuViewportProps) {
  const menu = useNavigationMenuContext('NavigationMenuViewport')
  const [element, setElement] = useState<HTMLElement | null>(null)
  const [size, setSize] = useState<{ width: number; height: number }>()
  const [position, setPosition] = useState<{ left: number; top: number }>()
  const [content, setContent] = useState<HTMLElement | null>(null)
  const open = !!menu.modelValue
  const { onViewportChange, activeTrigger, rootNavigationMenu } = menu
  const latest = useRef({ content, align })
  latest.current = { content, align }

  useLayoutEffect(() => {
    onViewportChange(element)
  }, [element, onViewportChange])

  useEffect(() => {
    if (!element) return
    requestAnimationFrame(() => {
      flushSync(() => setContent(element.querySelector<HTMLElement>('[data-state=open]')))
    })
  }, [menu.modelValue, open, element])

  const updatePosition = useCallback(() => {
    const target = latest.current.content
    const trigger = activeTrigger.current
    const root = rootNavigationMenu.current
    if (!target || !trigger || !root) return
    const bodyWidth = document.documentElement.offsetWidth
    const bodyHeight = document.documentElement.offsetHeight
    const rootRect = root.getBoundingClientRect()
    const rect = trigger.getBoundingClientRect()
    const { offsetWidth, offsetHeight } = target
    const startPositionLeft = rect.left - rootRect.left
    const startPositionTop = rect.top - rootRect.top
    let posLeft: number
    let posTop: number
    switch (latest.current.align) {
      case 'start':
        posLeft = startPositionLeft
        posTop = startPositionTop
        break
      case 'end':
        posLeft = startPositionLeft - offsetWidth + rect.width
        posTop = startPositionTop - offsetHeight + rect.height
        break
      default:
        posLeft = startPositionLeft - offsetWidth / 2 + rect.width / 2
        posTop = startPositionTop - offsetHeight / 2 + rect.height / 2
    }
    const screenOffset = 10
    if (posLeft + rootRect.left < screenOffset) posLeft = screenOffset - rootRect.left
    const rightOffset = posLeft + rootRect.left + offsetWidth
    if (rightOffset > bodyWidth - screenOffset) {
      posLeft -= rightOffset - bodyWidth + screenOffset
      if (posLeft < screenOffset - rootRect.left) posLeft = screenOffset - rootRect.left
    }
    if (posTop + rootRect.top < screenOffset) posTop = screenOffset - rootRect.top
    const bottomOffset = posTop + rootRect.top + offsetHeight
    if (bottomOffset > bodyHeight - screenOffset) {
      posTop -= bottomOffset - bodyHeight + screenOffset
      if (posTop < screenOffset - rootRect.top) posTop = screenOffset - rootRect.top
    }
    setPosition({ left: Math.round(posLeft), top: Math.round(posTop) })
  }, [activeTrigger, rootNavigationMenu])

  useEffect(() => {
    if (!content) return
    const observer = new ResizeObserver(() => {
      const target = latest.current.content
      if (!target) return
      flushSync(() => {
        setSize({ width: target.offsetWidth, height: target.offsetHeight })
        updatePosition()
      })
    })
    observer.observe(content)
    return () => observer.disconnect()
  }, [content, updatePosition])

  useEffect(() => {
    const targets = [document.body, rootNavigationMenu.current].filter(
      (target): target is HTMLElement => !!target,
    )
    const observer = new ResizeObserver(() => flushSync(updatePosition))
    for (const target of targets) observer.observe(target)
    return () => observer.disconnect()
  }, [rootNavigationMenu, updatePosition])

  const afterLeave = useCallback(() => {
    setSize(undefined)
    setPosition(undefined)
  }, [])

  return (
    <NavigationPresence present={!!forceMount || open} forceMount={!menu.unmountOnHide}>
      {present => (
        <NavigationMenuViewportImpl
          {...props}
          present={present}
          open={open}
          onAfterLeave={afterLeave}
          viewportRef={setElement}
          variables={{
            '--radix-navigation-menu-viewport-width': size ? `${size.width}px` : undefined,
            '--radix-navigation-menu-viewport-height': size ? `${size.height}px` : undefined,
            '--radix-navigation-menu-viewport-left': position ? `${position.left}px` : undefined,
            '--radix-navigation-menu-viewport-top': position ? `${position.top}px` : undefined,
          }}
        />
      )}
    </NavigationPresence>
  )
}

interface NavigationMenuViewportImplProps extends Omit<
  NavigationMenuViewportProps,
  'forceMount' | 'align'
> {
  present: boolean
  open: boolean
  onAfterLeave: () => void
  viewportRef: (element: HTMLElement | null) => void
  variables: Record<string, string | undefined>
}

function NavigationMenuViewportImpl({
  present,
  open,
  onAfterLeave,
  viewportRef,
  variables,
  style,
  ref,
  ...attrs
}: NavigationMenuViewportImplProps) {
  const menu = useNavigationMenuContext('NavigationMenuViewport')
  const [element, setElement] = useState<HTMLElement | null>(null)
  const composedRef = useComposedRefs(ref, viewportRef, setElement)
  const wasPresent = useRef(present)
  const latest = useRef({ menu, onAfterLeave })
  latest.current = { menu, onAfterLeave }

  useEffect(() => {
    if (wasPresent.current && !present) latest.current.onAfterLeave()
    wasPresent.current = present
  }, [present])

  useEffect(() => () => latest.current.onAfterLeave(), [])

  useEffect(() => {
    if (!element) return
    const enter = () => latest.current.menu.onContentEnter()
    const leave = whenMouse(() => latest.current.menu.onContentLeave())
    element.addEventListener('pointerenter', enter)
    element.addEventListener('pointerleave', leave)
    return () => {
      element.removeEventListener('pointerenter', enter)
      element.removeEventListener('pointerleave', leave)
    }
  }, [element])

  return (
    <Primitive
      {...attrs}
      ref={composedRef}
      data-state={getOpenState(open)}
      data-orientation={menu.orientation}
      style={
        {
          ...style,
          pointerEvents: !open && menu.isRootMenu ? 'none' : undefined,
          ...variables,
        } as CSSProperties
      }
      hidden={!present}
    />
  )
}

export interface NavigationMenuLinkProps
  extends PrimitiveProps, Omit<HTMLAttributes<HTMLElement>, 'onSelect'>, DataAttributes {
  active?: boolean
  onSelect?: (event: CustomEvent<{ originalEvent: MouseEvent }>) => void
  ref?: Ref<HTMLElement>
}

export function NavigationMenuLink({
  active,
  as = 'a',
  asChild,
  onSelect,
  onClick,
  ref,
  ...attrs
}: NavigationMenuLinkProps) {
  const [element, setElement] = useState<HTMLElement | null>(null)
  const composedRef = useComposedRefs(ref, setElement)
  useCollectionItem(element)

  function handleClick(event: ReactMouseEvent<HTMLElement>) {
    const native = event.nativeEvent
    const linkSelectEvent = new CustomEvent(LINK_SELECT, {
      bubbles: true,
      cancelable: true,
      detail: { originalEvent: native },
    })
    onSelect?.(linkSelectEvent)
    if (!linkSelectEvent.defaultPrevented && !native.metaKey) {
      const rootContentDismissEvent = new CustomEvent(EVENT_ROOT_CONTENT_DISMISS, {
        bubbles: true,
        cancelable: true,
      })
      native.target?.dispatchEvent(rootContentDismissEvent)
    }
  }

  return (
    <Primitive
      {...{ [ITEM_ATTRIBUTE]: '' }}
      {...attrs}
      ref={composedRef}
      as={as}
      data-active={active ? '' : undefined}
      aria-current={active ? 'page' : undefined}
      asChild={asChild}
      onClick={chain(onClick, handleClick)}
    />
  )
}
