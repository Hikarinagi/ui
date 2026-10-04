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
  type CSSProperties,
  type FocusEvent as ReactFocusEvent,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type Ref,
  type RefObject,
} from 'react'
import { useComposedRefs, useControllableState } from 'radix-ui/internal'
import { Primitive, type PrimitiveProps } from '../../lib/primitive'
import { usePopperDirection } from '../popper'
import { RovingFocusGroup, RovingFocusItem } from '../roving-focus'
import {
  MenuContent,
  MenuRoot,
  MenuSubContent,
  MenuSubTrigger,
  useMenuAnchor,
  useSnapshot,
  type Direction,
  type MenuContentProps,
  type MenuSubContentProps,
  type MenuSubTriggerProps,
} from '../menu'
import { ITEM_SELECTOR, buttonAttributes, wrapArray } from '../menu/utils'

export {
  MenuArrow as MenubarArrow,
  MenuCheckboxItem as MenubarCheckboxItem,
  MenuGroup as MenubarGroup,
  MenuItem as MenubarItem,
  MenuItemIndicator as MenubarItemIndicator,
  MenuLabel as MenubarLabel,
  MenuPortal as MenubarPortal,
  MenuRadioGroup as MenubarRadioGroup,
  MenuRadioItem as MenubarRadioItem,
  MenuSeparator as MenubarSeparator,
  MenuSub as MenubarSub,
} from '../menu'
export type {
  MenuCheckboxItemProps as MenubarCheckboxItemProps,
  MenuGroupProps as MenubarGroupProps,
  MenuItemProps as MenubarItemProps,
  MenuItemIndicatorProps as MenubarItemIndicatorProps,
  MenuLabelProps as MenubarLabelProps,
  MenuPortalProps as MenubarPortalProps,
  MenuRadioGroupProps as MenubarRadioGroupProps,
  MenuRadioItemProps as MenubarRadioItemProps,
  MenuSeparatorProps as MenubarSeparatorProps,
  MenuSubProps as MenubarSubProps,
} from '../menu'

interface MenubarRootContextValue {
  value: string
  dir: Direction
  loop: boolean
  onMenuOpen: (value: string) => void
  onMenuClose: () => void
  onMenuToggle: (value: string) => void
  register: (element: HTMLElement) => () => void
  getItems: () => HTMLElement[]
}

interface MenubarMenuContextValue {
  value: string
  triggerId: string
  triggerElement: RefObject<HTMLElement | null>
  contentId: RefObject<string>
  wasKeyboardTriggerOpen: RefObject<boolean>
}

const MenubarRootContext = createContext<MenubarRootContextValue | null>(null)
const MenubarMenuContext = createContext<MenubarMenuContextValue | null>(null)

function useMenubarRootContext(consumer: string) {
  const context = useContext(MenubarRootContext)
  if (!context) throw new Error(`\`${consumer}\` must be used within \`MenubarRoot\``)
  return context
}

function useMenubarMenuContext(consumer: string) {
  const context = useContext(MenubarMenuContext)
  if (!context) throw new Error(`\`${consumer}\` must be used within \`MenubarMenu\``)
  return context
}

export interface MenubarRootProps
  extends PrimitiveProps, Omit<HTMLAttributes<HTMLElement>, 'dir' | 'defaultValue'> {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  dir?: Direction
  loop?: boolean
  ref?: Ref<HTMLElement>
  [attribute: `data-${string}`]: string | undefined
}

export function MenubarRoot({
  value: valueProp,
  defaultValue,
  onValueChange,
  dir: dirProp,
  loop = false,
  as = 'div',
  ref,
  ...props
}: MenubarRootProps) {
  const [value = '', setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue ?? '',
    onChange: onValueChange,
    caller: 'MenubarRoot',
  })
  const [currentTabStopId, setCurrentTabStopId] = useState<string | null>(null)
  const dir = usePopperDirection(dirProp)
  const root = useRef<HTMLElement | null>(null)
  const composedRef = useComposedRefs(ref, root)
  const triggers = useRef(new Set<HTMLElement>())

  const register = useCallback((element: HTMLElement) => {
    triggers.current.add(element)
    return () => {
      triggers.current.delete(element)
    }
  }, [])

  const getItems = useCallback(() => {
    const node = root.current
    if (!node) return []
    const ordered = Array.from(node.querySelectorAll(ITEM_SELECTOR))
    const order = new Map(ordered.map((element, index) => [element, index]))
    return [...triggers.current]
      .sort((a, b) => (order.get(a) ?? -1) - (order.get(b) ?? -1))
      .filter(element => element.dataset.disabled !== '')
  }, [])

  const onMenuOpen = useCallback(
    (next: string) => {
      setValue(next)
      setCurrentTabStopId(next)
    },
    [setValue],
  )
  const onMenuClose = useCallback(() => setValue(''), [setValue])
  const onMenuToggle = useCallback(
    (next: string) => {
      setValue(current => (current ? '' : next))
      setCurrentTabStopId(next)
    },
    [setValue],
  )

  const context = useMemo<MenubarRootContextValue>(
    () => ({ value, dir, loop, onMenuOpen, onMenuClose, onMenuToggle, register, getItems }),
    [value, dir, loop, onMenuOpen, onMenuClose, onMenuToggle, register, getItems],
  )

  return (
    <MenubarRootContext value={context}>
      <RovingFocusGroup
        asChild
        orientation="horizontal"
        loop={loop}
        dir={dir}
        currentTabStopId={currentTabStopId}
        onCurrentTabStopIdChange={setCurrentTabStopId}
      >
        <Primitive as={as} role="menubar" {...props} ref={composedRef} />
      </RovingFocusGroup>
    </MenubarRootContext>
  )
}

export interface MenubarMenuProps {
  value?: string
  children?: ReactNode
}

export function MenubarMenu({ value: valueProp, children }: MenubarMenuProps) {
  const root = useMenubarRootContext('MenubarMenu')
  const generated = useId()
  const [value] = useState(() => valueProp || generated)
  const triggerElement = useRef<HTMLElement | null>(null)
  const contentId = useRef('')
  const wasKeyboardTriggerOpen = useRef(false)
  const open = root.value === value

  useEffect(() => {
    if (!open) wasKeyboardTriggerOpen.current = false
  }, [open])

  const context = useMemo<MenubarMenuContextValue>(
    () => ({ value, triggerId: value, triggerElement, contentId, wasKeyboardTriggerOpen }),
    [value],
  )
  const { onMenuClose } = root

  return (
    <MenubarMenuContext value={context}>
      <MenuRoot
        open={open}
        modal={false}
        dir={root.dir}
        onOpenChange={next => {
          if (!next) onMenuClose()
        }}
      >
        {children}
      </MenuRoot>
    </MenubarMenuContext>
  )
}

export interface MenubarTriggerProps extends PrimitiveProps, HTMLAttributes<HTMLElement> {
  disabled?: boolean
  ref?: Ref<HTMLElement>
  [attribute: `data-${string}`]: string | undefined
}

export function MenubarTrigger({
  as = 'button',
  asChild,
  disabled,
  onPointerDown,
  onPointerEnter,
  onKeyDown,
  onFocus,
  onBlur,
  ref,
  ...props
}: MenubarTriggerProps) {
  const root = useMenubarRootContext('MenubarTrigger')
  const menu = useMenubarMenuContext('MenubarTrigger')
  const anchor = useMenuAnchor()
  const [element, setElement] = useState<HTMLElement | null>(null)
  const composedRef = useComposedRefs(ref, anchor, setElement)
  const [isFocused, setIsFocused] = useState(false)
  const open = root.value === menu.value
  const ariaControls = useSnapshot(open, () => (open ? menu.contentId.current : undefined))
  const { register } = root
  const { triggerElement } = menu

  useLayoutEffect(() => (element ? register(element) : undefined), [element, register])

  useEffect(() => {
    triggerElement.current = element
  }, [element, triggerElement])

  return (
    <RovingFocusItem asChild focusable={!disabled} tabStopId={menu.value}>
      <Primitive
        id={menu.triggerId}
        as={as}
        asChild={asChild}
        {...buttonAttributes(as, disabled)}
        role="menuitem"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={ariaControls}
        data-highlighted={isFocused ? '' : undefined}
        data-state={open ? 'open' : 'closed'}
        data-disabled={disabled ? '' : undefined}
        data-value={menu.value}
        {...props}
        ref={composedRef}
        onPointerDown={(event: ReactPointerEvent<HTMLElement>) => {
          onPointerDown?.(event)
          if (!disabled && event.button === 0 && event.ctrlKey === false)
            root.onMenuOpen(menu.value)
        }}
        onPointerEnter={(event: ReactPointerEvent<HTMLElement>) => {
          onPointerEnter?.(event)
          if (root.value && !open) {
            root.onMenuOpen(menu.value)
            element?.focus()
          }
        }}
        onKeyDown={(event: ReactKeyboardEvent<HTMLElement>) => {
          onKeyDown?.(event)
          if (disabled || !['Enter', ' ', 'ArrowDown'].includes(event.key)) return
          if (['Enter', ' '].includes(event.key)) root.onMenuToggle(menu.value)
          if (event.key === 'ArrowDown') root.onMenuOpen(menu.value)
          menu.wasKeyboardTriggerOpen.current = true
          event.preventDefault()
        }}
        onFocus={(event: ReactFocusEvent<HTMLElement>) => {
          onFocus?.(event)
          setIsFocused(true)
        }}
        onBlur={(event: ReactFocusEvent<HTMLElement>) => {
          onBlur?.(event)
          setIsFocused(false)
        }}
      />
    </RovingFocusItem>
  )
}

const contentStyle = {
  '--radix-menubar-content-transform-origin': 'var(--radix-popper-transform-origin)',
  '--radix-menubar-content-available-width': 'var(--radix-popper-available-width)',
  '--radix-menubar-content-available-height': 'var(--radix-popper-available-height)',
  '--radix-menubar-trigger-width': 'var(--radix-popper-anchor-width)',
  '--radix-menubar-trigger-height': 'var(--radix-popper-anchor-height)',
} as CSSProperties

const SUBTRIGGER_ATTR = 'data-radix-menubar-subtrigger'
const CONTENT_ATTR = 'data-radix-menubar-content'

function inside(event: ReactKeyboardEvent<HTMLElement>) {
  return event.currentTarget.contains(event.target as Node)
}

export type MenubarContentProps = MenuContentProps

export function MenubarContent({
  align = 'start',
  onCloseAutoFocus,
  onFocusOutside,
  onInteractOutside,
  onEntryFocus,
  onKeyDown,
  style,
  ...props
}: MenubarContentProps) {
  const root = useMenubarRootContext('MenubarContent')
  const menu = useMenubarMenuContext('MenubarContent')
  const id = useId()
  if (!menu.contentId.current) menu.contentId.current = id
  const hasInteractedOutside = useRef(false)

  function handleArrowNavigation(event: ReactKeyboardEvent<HTMLElement>) {
    const target = event.target as HTMLElement
    const targetIsSubTrigger = target.hasAttribute(SUBTRIGGER_ATTR)
    const prevMenuKey = root.dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft'
    const isPrevKey = prevMenuKey === event.key
    if (!isPrevKey && targetIsSubTrigger) return
    let candidates = root
      .getItems()
      .filter(item => item.dataset.disabled !== '')
      .map(item => item.dataset.value)
    if (isPrevKey) candidates.reverse()
    const currentIndex = candidates.indexOf(menu.value)
    candidates = root.loop
      ? wrapArray(candidates, currentIndex + 1)
      : candidates.slice(currentIndex + 1)
    const [nextValue] = candidates
    if (nextValue) root.onMenuOpen(nextValue)
  }

  return (
    <MenuContent
      id={menu.contentId.current}
      {...{ [CONTENT_ATTR]: '' }}
      aria-labelledby={menu.triggerId}
      {...props}
      align={align}
      style={{ ...contentStyle, ...style }}
      onCloseAutoFocus={event => {
        onCloseAutoFocus?.(event)
        if (!root.value && !hasInteractedOutside.current) menu.triggerElement.current?.focus()
        hasInteractedOutside.current = false
        event.preventDefault()
      }}
      onFocusOutside={event => {
        onFocusOutside?.(event)
        const target = event.target as HTMLElement
        const isMenubarTrigger = root
          .getItems()
          .filter(item => item.dataset.disabled !== '')
          .some(item => item.contains(target))
        if (isMenubarTrigger) event.preventDefault()
      }}
      onInteractOutside={event => {
        onInteractOutside?.(event)
        hasInteractedOutside.current = true
      }}
      onEntryFocus={event => {
        onEntryFocus?.(event)
        if (!menu.wasKeyboardTriggerOpen.current) event.preventDefault()
      }}
      onKeyDown={event => {
        onKeyDown?.(event)
        if ((event.key === 'ArrowRight' || event.key === 'ArrowLeft') && inside(event))
          handleArrowNavigation(event)
      }}
    />
  )
}

export type MenubarSubContentProps = MenuSubContentProps

export function MenubarSubContent({ onKeyDown, style, ...props }: MenubarSubContentProps) {
  const root = useMenubarRootContext('MenubarSubContent')
  const menu = useMenubarMenuContext('MenubarSubContent')

  function handleArrowNavigation(event: ReactKeyboardEvent<HTMLElement>) {
    const target = event.target as HTMLElement
    if (target.hasAttribute(SUBTRIGGER_ATTR)) return
    let candidates = root
      .getItems()
      .filter(item => item.dataset.disabled !== '')
      .map(item => item.dataset.value)
    const currentIndex = candidates.indexOf(menu.value)
    candidates = root.loop
      ? wrapArray(candidates, currentIndex + 1)
      : candidates.slice(currentIndex + 1)
    const [nextValue] = candidates
    if (nextValue) root.onMenuOpen(nextValue)
  }

  return (
    <MenuSubContent
      {...props}
      {...{ [CONTENT_ATTR]: '' }}
      style={{ ...contentStyle, ...style }}
      onKeyDown={event => {
        onKeyDown?.(event)
        if (event.key === 'ArrowRight' && inside(event)) handleArrowNavigation(event)
      }}
    />
  )
}

export function MenubarSubTrigger(props: MenuSubTriggerProps) {
  return <MenuSubTrigger {...props} {...{ [SUBTRIGGER_ATTR]: '' }} />
}

export type { MenuSubTriggerProps as MenubarSubTriggerProps } from '../menu'
