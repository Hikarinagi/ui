'use client'

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type Ref,
  type RefObject,
} from 'react'
import { useCallbackRef, useComposedRefs } from 'radix-ui/internal'
import { Primitive, type PrimitiveProps } from '../../lib/primitive'
import { usePopperDirection } from '../popper'
import {
  MenuContent,
  MenuRoot,
  MenuSubContent,
  useMenuAnchor,
  type Direction,
  type MenuContentProps,
  type MenuReference,
  type MenuSubContentProps,
} from '../menu'
import { isTouchOrPen } from '../menu/utils'

export {
  MenuArrow as ContextMenuArrow,
  MenuCheckboxItem as ContextMenuCheckboxItem,
  MenuGroup as ContextMenuGroup,
  MenuItem as ContextMenuItem,
  MenuItemIndicator as ContextMenuItemIndicator,
  MenuLabel as ContextMenuLabel,
  MenuPortal as ContextMenuPortal,
  MenuRadioGroup as ContextMenuRadioGroup,
  MenuRadioItem as ContextMenuRadioItem,
  MenuSeparator as ContextMenuSeparator,
  MenuSub as ContextMenuSub,
  MenuSubTrigger as ContextMenuSubTrigger,
} from '../menu'
export type {
  MenuCheckboxItemProps as ContextMenuCheckboxItemProps,
  MenuGroupProps as ContextMenuGroupProps,
  MenuItemProps as ContextMenuItemProps,
  MenuItemIndicatorProps as ContextMenuItemIndicatorProps,
  MenuLabelProps as ContextMenuLabelProps,
  MenuPortalProps as ContextMenuPortalProps,
  MenuRadioGroupProps as ContextMenuRadioGroupProps,
  MenuRadioItemProps as ContextMenuRadioItemProps,
  MenuSeparatorProps as ContextMenuSeparatorProps,
  MenuSubProps as ContextMenuSubProps,
  MenuSubTriggerProps as ContextMenuSubTriggerProps,
} from '../menu'

interface ContextMenuRootContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
  modal: boolean
  dir: Direction
  triggerElement: RefObject<HTMLElement | null>
  pressOpenDelay: number
}

const ContextMenuRootContext = createContext<ContextMenuRootContextValue | null>(null)

function useContextMenuRootContext(consumer: string) {
  const context = useContext(ContextMenuRootContext)
  if (!context) throw new Error(`\`${consumer}\` must be used within \`ContextMenuRoot\``)
  return context
}

export interface ContextMenuRootProps {
  onOpenChange?: (open: boolean) => void
  dir?: Direction
  modal?: boolean
  pressOpenDelay?: number
  children?: ReactNode
}

export function ContextMenuRoot({
  onOpenChange,
  dir: dirProp,
  modal = true,
  pressOpenDelay = 700,
  children,
}: ContextMenuRootProps) {
  const [open, setOpen] = useState(false)
  const dir = usePopperDirection(dirProp)
  const triggerElement = useRef<HTMLElement | null>(null)
  const emitted = useRef(open)
  const emit = useCallbackRef((value: boolean) => onOpenChange?.(value))

  useEffect(() => {
    if (emitted.current === open) return
    emitted.current = open
    emit(open)
  }, [open, emit])

  const context = useMemo<ContextMenuRootContextValue>(
    () => ({ open, onOpenChange: setOpen, modal, dir, triggerElement, pressOpenDelay }),
    [open, modal, dir, pressOpenDelay],
  )

  return (
    <ContextMenuRootContext value={context}>
      <MenuRoot open={open} onOpenChange={setOpen} dir={dir} modal={modal}>
        {children}
      </MenuRoot>
    </ContextMenuRootContext>
  )
}

export interface ContextMenuTriggerProps extends PrimitiveProps, HTMLAttributes<HTMLElement> {
  disabled?: boolean
  ref?: Ref<HTMLElement>
  [attribute: `data-${string}`]: string | undefined
}

export function ContextMenuTrigger({
  as = 'span',
  asChild,
  disabled = false,
  style,
  onContextMenu,
  onPointerDown,
  onPointerMove,
  onPointerCancel,
  onPointerUp,
  ref,
  ...props
}: ContextMenuTriggerProps) {
  const root = useContextMenuRootContext('ContextMenuTrigger')
  const [point, setPoint] = useState({ x: 0, y: 0 })
  const reference = useMemo<MenuReference>(
    () => ({
      getBoundingClientRect: () =>
        ({
          width: 0,
          height: 0,
          left: point.x,
          right: point.x,
          top: point.y,
          bottom: point.y,
          ...point,
        }) as DOMRect,
    }),
    [point],
  )
  useMenuAnchor(reference)
  const longPressTimer = useRef(0)
  const element = useRef<HTMLElement | null>(null)
  const composedRef = useComposedRefs(ref, element)
  const { triggerElement } = root

  useEffect(() => {
    if (element.current) triggerElement.current = element.current
  }, [triggerElement])

  function clearLongPress() {
    window.clearTimeout(longPressTimer.current)
  }

  useEffect(() => clearLongPress, [])

  function handleOpen(event: { clientX: number; clientY: number }) {
    setPoint({ x: event.clientX, y: event.clientY })
    root.onOpenChange(true)
  }

  function handlePointerEvent(event: ReactPointerEvent<HTMLElement>) {
    if (!disabled && isTouchOrPen(event) && !event.defaultPrevented) clearLongPress()
  }

  return (
    <Primitive
      as={as}
      asChild={asChild}
      data-state={root.open ? 'open' : 'closed'}
      data-disabled={disabled ? '' : undefined}
      {...props}
      style={{ WebkitTouchCallout: 'none', pointerEvents: 'auto', ...style } as CSSProperties}
      ref={composedRef}
      onContextMenu={(event: ReactMouseEvent<HTMLElement>) => {
        onContextMenu?.(event)
        if (disabled || event.defaultPrevented) return
        clearLongPress()
        handleOpen(event)
        event.preventDefault()
      }}
      onPointerDown={(event: ReactPointerEvent<HTMLElement>) => {
        onPointerDown?.(event)
        if (disabled || !isTouchOrPen(event) || event.defaultPrevented) return
        clearLongPress()
        const position = { clientX: event.clientX, clientY: event.clientY }
        longPressTimer.current = window.setTimeout(() => handleOpen(position), root.pressOpenDelay)
      }}
      onPointerMove={(event: ReactPointerEvent<HTMLElement>) => {
        onPointerMove?.(event)
        handlePointerEvent(event)
      }}
      onPointerCancel={(event: ReactPointerEvent<HTMLElement>) => {
        onPointerCancel?.(event)
        handlePointerEvent(event)
      }}
      onPointerUp={(event: ReactPointerEvent<HTMLElement>) => {
        onPointerUp?.(event)
        handlePointerEvent(event)
      }}
    />
  )
}

const contentStyle = {
  '--radix-context-menu-content-transform-origin': 'var(--radix-popper-transform-origin)',
  '--radix-context-menu-content-available-width': 'var(--radix-popper-available-width)',
  '--radix-context-menu-content-available-height': 'var(--radix-popper-available-height)',
  '--radix-context-menu-trigger-width': 'var(--radix-popper-anchor-width)',
  '--radix-context-menu-trigger-height': 'var(--radix-popper-anchor-height)',
} as CSSProperties

export type ContextMenuContentProps = Omit<
  MenuContentProps,
  'side' | 'sideOffset' | 'align' | 'arrowPadding' | 'updatePositionStrategy'
>

export function ContextMenuContent({
  alignOffset = 0,
  avoidCollisions = true,
  collisionBoundary = [],
  collisionPadding = 0,
  sticky = 'partial',
  hideWhenDetached = false,
  onCloseAutoFocus,
  onInteractOutside,
  style,
  ...props
}: ContextMenuContentProps) {
  const root = useContextMenuRootContext('ContextMenuContent')
  const hasInteractedOutside = useRef(false)

  return (
    <MenuContent
      {...props}
      alignOffset={alignOffset}
      avoidCollisions={avoidCollisions}
      collisionBoundary={collisionBoundary}
      collisionPadding={collisionPadding}
      sticky={sticky}
      hideWhenDetached={hideWhenDetached}
      side="right"
      sideOffset={2}
      align="start"
      updatePositionStrategy="always"
      style={{ ...contentStyle, ...style }}
      onCloseAutoFocus={event => {
        onCloseAutoFocus?.(event)
        if (!event.defaultPrevented && hasInteractedOutside.current) event.preventDefault()
        hasInteractedOutside.current = false
      }}
      onInteractOutside={event => {
        onInteractOutside?.(event)
        const originalEvent = event.detail.originalEvent as PointerEvent
        if (originalEvent.button === 2 && event.target === root.triggerElement.current)
          event.preventDefault()
        if (!event.defaultPrevented && !root.modal) hasInteractedOutside.current = true
      }}
    />
  )
}

export type ContextMenuSubContentProps = MenuSubContentProps

export function ContextMenuSubContent({ style, ...props }: ContextMenuSubContentProps) {
  return <MenuSubContent {...props} style={{ ...contentStyle, ...style }} />
}
