'use client'

import {
  createContext,
  useCallback,
  useContext,
  useId,
  useMemo,
  useRef,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  type Ref,
  type RefObject,
} from 'react'
import { useComposedRefs, useControllableState } from 'radix-ui/internal'
import { Primitive, type PrimitiveProps } from '../../lib/primitive'
import { usePopperDirection } from '../popper'
import {
  MenuContent,
  MenuRoot,
  MenuSubContent,
  useMenuAnchor,
  useSnapshot,
  type Direction,
  type MenuContentProps,
  type MenuSubContentProps,
} from '../menu'
import { buttonAttributes } from '../menu/utils'

export {
  MenuArrow as DropdownMenuArrow,
  MenuCheckboxItem as DropdownMenuCheckboxItem,
  MenuGroup as DropdownMenuGroup,
  MenuItem as DropdownMenuItem,
  MenuItemIndicator as DropdownMenuItemIndicator,
  MenuLabel as DropdownMenuLabel,
  MenuPortal as DropdownMenuPortal,
  MenuRadioGroup as DropdownMenuRadioGroup,
  MenuRadioItem as DropdownMenuRadioItem,
  MenuSeparator as DropdownMenuSeparator,
  MenuSub as DropdownMenuSub,
  MenuSubTrigger as DropdownMenuSubTrigger,
} from '../menu'
export type {
  MenuCheckboxItemProps as DropdownMenuCheckboxItemProps,
  MenuGroupProps as DropdownMenuGroupProps,
  MenuItemProps as DropdownMenuItemProps,
  MenuItemIndicatorProps as DropdownMenuItemIndicatorProps,
  MenuLabelProps as DropdownMenuLabelProps,
  MenuPortalProps as DropdownMenuPortalProps,
  MenuRadioGroupProps as DropdownMenuRadioGroupProps,
  MenuRadioItemProps as DropdownMenuRadioItemProps,
  MenuReference as DropdownMenuReference,
  MenuSeparatorProps as DropdownMenuSeparatorProps,
  MenuSubProps as DropdownMenuSubProps,
  MenuSubTriggerProps as DropdownMenuSubTriggerProps,
  FocusOutsideEvent,
  PointerDownOutsideEvent,
} from '../menu'

interface DropdownMenuRootContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
  onOpenToggle: () => void
  triggerId: RefObject<string>
  triggerElement: RefObject<HTMLElement | null>
  contentId: RefObject<string>
  modal: boolean
  dir: Direction
}

const DropdownMenuRootContext = createContext<DropdownMenuRootContextValue | null>(null)

function useDropdownMenuRootContext(consumer: string) {
  const context = useContext(DropdownMenuRootContext)
  if (!context) throw new Error(`\`${consumer}\` must be used within \`DropdownMenuRoot\``)
  return context
}

export interface DropdownMenuRootProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  modal?: boolean
  dir?: Direction
  children?: ReactNode
}

export function DropdownMenuRoot({
  open: openProp,
  defaultOpen,
  onOpenChange,
  modal = true,
  dir: dirProp,
  children,
}: DropdownMenuRootProps) {
  const [open = false, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange,
    caller: 'DropdownMenuRoot',
  })
  const dir = usePopperDirection(dirProp)
  const triggerId = useRef('')
  const contentId = useRef('')
  const triggerElement = useRef<HTMLElement | null>(null)
  const handleOpenChange = useCallback((value: boolean) => setOpen(value), [setOpen])
  const onOpenToggle = useCallback(() => setOpen(value => !value), [setOpen])

  const context = useMemo<DropdownMenuRootContextValue>(
    () => ({
      open,
      onOpenChange: handleOpenChange,
      onOpenToggle,
      triggerId,
      triggerElement,
      contentId,
      modal,
      dir,
    }),
    [open, handleOpenChange, onOpenToggle, modal, dir],
  )

  return (
    <DropdownMenuRootContext value={context}>
      <MenuRoot open={open} onOpenChange={handleOpenChange} dir={dir} modal={modal}>
        {children}
      </MenuRoot>
    </DropdownMenuRootContext>
  )
}

export interface DropdownMenuTriggerProps extends PrimitiveProps, HTMLAttributes<HTMLElement> {
  disabled?: boolean
  ref?: Ref<HTMLElement>
  [attribute: `data-${string}`]: string | undefined
}

export function DropdownMenuTrigger({
  as = 'button',
  asChild,
  disabled,
  onClick,
  onKeyDown,
  ref,
  ...props
}: DropdownMenuTriggerProps) {
  const root = useDropdownMenuRootContext('DropdownMenuTrigger')
  const id = useId()
  if (!root.triggerId.current) root.triggerId.current = id
  const anchor = useMenuAnchor()
  const { triggerElement } = root
  const register = useCallback(
    (node: HTMLElement | null) => {
      if (node) triggerElement.current = node
    },
    [triggerElement],
  )
  const composedRef = useComposedRefs(ref, anchor, register)
  const ariaControls = useSnapshot(root.open, () =>
    root.open ? root.contentId.current : undefined,
  )

  return (
    <Primitive
      id={root.triggerId.current}
      {...buttonAttributes(as, disabled)}
      as={as}
      asChild={asChild}
      aria-haspopup="menu"
      aria-expanded={root.open}
      aria-controls={ariaControls}
      data-disabled={disabled ? '' : undefined}
      data-state={root.open ? 'open' : 'closed'}
      {...props}
      ref={composedRef}
      onClick={(event: ReactMouseEvent<HTMLElement>) => {
        if (!disabled && event.button === 0 && event.ctrlKey === false) {
          const opening = !root.open
          root.onOpenToggle()
          if (opening) event.preventDefault()
        }
        onClick?.(event)
      }}
      onKeyDown={(event: ReactKeyboardEvent<HTMLElement>) => {
        if (!disabled && ['Enter', ' ', 'ArrowDown'].includes(event.key)) {
          if (['Enter', ' '].includes(event.key)) root.onOpenToggle()
          if (event.key === 'ArrowDown') root.onOpenChange(true)
          event.preventDefault()
        }
        onKeyDown?.(event)
      }}
    />
  )
}

const contentStyle = {
  '--radix-dropdown-menu-content-transform-origin': 'var(--radix-popper-transform-origin)',
  '--radix-dropdown-menu-content-available-width': 'var(--radix-popper-available-width)',
  '--radix-dropdown-menu-content-available-height': 'var(--radix-popper-available-height)',
  '--radix-dropdown-menu-trigger-width': 'var(--radix-popper-anchor-width)',
  '--radix-dropdown-menu-trigger-height': 'var(--radix-popper-anchor-height)',
} as CSSProperties

export type DropdownMenuContentProps = MenuContentProps

export function DropdownMenuContent({
  onCloseAutoFocus,
  onInteractOutside,
  style,
  ...props
}: DropdownMenuContentProps) {
  const root = useDropdownMenuRootContext('DropdownMenuContent')
  const hasInteractedOutside = useRef(false)
  const id = useId()
  if (!root.contentId.current) root.contentId.current = id

  return (
    <MenuContent
      id={root.contentId.current}
      aria-labelledby={root.triggerId.current}
      {...props}
      style={{ ...contentStyle, ...style }}
      onCloseAutoFocus={event => {
        onCloseAutoFocus?.(event)
        if (event.defaultPrevented) return
        if (!hasInteractedOutside.current)
          setTimeout(() => {
            root.triggerElement.current?.focus()
          }, 0)
        hasInteractedOutside.current = false
        event.preventDefault()
      }}
      onInteractOutside={event => {
        onInteractOutside?.(event)
        if (event.defaultPrevented) return
        const originalEvent = event.detail.originalEvent as PointerEvent
        const ctrlLeftClick = originalEvent.button === 0 && originalEvent.ctrlKey === true
        const isRightClick = originalEvent.button === 2 || ctrlLeftClick
        if (!root.modal || isRightClick) hasInteractedOutside.current = true
        if (root.triggerElement.current?.contains(event.target as HTMLElement))
          event.preventDefault()
      }}
    />
  )
}

export type DropdownMenuSubContentProps = MenuSubContentProps

export function DropdownMenuSubContent({ style, ...props }: DropdownMenuSubContentProps) {
  return <MenuSubContent {...props} style={{ ...contentStyle, ...style }} />
}
