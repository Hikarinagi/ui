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
  type ComponentProps,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
  type RefObject,
} from 'react'
import { usePortalContainer } from '../../lib/config'
import { hideOthers } from 'aria-hidden'
import { Primitive } from '../../lib/primitive'
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
import { autoFocusWithin, focus } from './focus'
import { DismissableLayer } from '../dismissable-layer'
import { FocusScope } from '../focus-scope'
import { Portal as HnPortal } from '../portal'
import { Presence } from '../presence'
import { useCallbackRef } from '../utils/callback-ref'
import { composeEventHandlers } from '../utils/compose-event-handlers'
import { useComposedRefs } from '../utils/compose-refs'
import { useControllableState } from '../utils/controllable-state'
import { useFocusGuards } from '../utils/focus-guards'

export type { FocusOutsideEvent, PointerDownOutsideEvent } from '../utils/dismissable'

export interface PopoverReference {
  getBoundingClientRect: () => Pick<
    DOMRect,
    'x' | 'y' | 'width' | 'height' | 'top' | 'right' | 'bottom' | 'left'
  >
  contextElement?: Element
}

const AUTOFOCUS_ON_UNMOUNT = 'focusScope.autoFocusOnUnmount'

function buttonType(as: unknown): { type?: string } {
  return { type: as === 'button' ? 'button' : undefined }
}

interface RootContextValue {
  contentId: string
  triggerId: string
  onTriggerIdChange: (id: string) => void
  modal: boolean
  open: boolean
  onOpenChange: (open: boolean) => void
  onOpenToggle: () => void
  triggerElement: RefObject<HTMLElement | null>
  hasCustomAnchor: boolean
  onCustomAnchorChange: (present: boolean) => void
  anchor: PopoverReference | HTMLElement | null
  onAnchorChange: (anchor: PopoverReference | HTMLElement | null) => void
}

const RootContext = createContext<RootContextValue | null>(null)

export function usePopoverRootContext(consumer = 'PopoverRoot') {
  const context = useContext(RootContext)
  if (!context) throw new Error(`\`${consumer}\` must be used within \`PopoverRoot\``)
  return context
}

export interface PopoverRootProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  modal?: boolean
  children?: ReactNode
}

export function PopoverRoot({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  modal = false,
  children,
}: PopoverRootProps) {
  const [open = false, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
    caller: 'PopoverRoot',
  })
  const contentId = useId()
  const [triggerId, setTriggerId] = useState('')
  const triggerElement = useRef<HTMLElement | null>(null)
  const [hasCustomAnchor, setHasCustomAnchor] = useState(false)
  const [anchor, setAnchor] = useState<PopoverReference | HTMLElement | null>(null)

  const onTriggerIdChange = useCallback((id: string) => {
    setTriggerId(current => current || id)
  }, [])
  const onOpenChangeCallback = useCallback((value: boolean) => setOpen(value), [setOpen])
  const onOpenToggle = useCallback(() => setOpen(value => !value), [setOpen])

  const value = useMemo<RootContextValue>(
    () => ({
      contentId,
      triggerId,
      onTriggerIdChange,
      modal,
      open,
      onOpenChange: onOpenChangeCallback,
      onOpenToggle,
      triggerElement,
      hasCustomAnchor,
      onCustomAnchorChange: setHasCustomAnchor,
      anchor,
      onAnchorChange: setAnchor,
    }),
    [
      contentId,
      triggerId,
      onTriggerIdChange,
      modal,
      open,
      onOpenChangeCallback,
      onOpenToggle,
      hasCustomAnchor,
      anchor,
    ],
  )

  return (
    <PopperRoot>
      <RootContext value={value}>{children}</RootContext>
    </PopperRoot>
  )
}

export interface PopoverTriggerProps extends HTMLAttributes<HTMLElement> {
  asChild?: boolean
  as?: ComponentProps<typeof Primitive>['as']
  ref?: Ref<HTMLElement>
}

export function PopoverTrigger({
  as = 'button',
  asChild,
  ref,
  onClick,
  ...props
}: PopoverTriggerProps) {
  const context = usePopoverRootContext('PopoverTrigger')
  const id = useId()
  const [element, setElement] = useState<HTMLElement | null>(null)
  const { onTriggerIdChange, onAnchorChange, hasCustomAnchor, triggerElement } = context
  const register = useCallback(
    (node: HTMLElement | null) => {
      setElement(node)
      if (node) triggerElement.current = node
    },
    [triggerElement],
  )
  const composedRef = useComposedRefs(ref, register)

  useLayoutEffect(() => onTriggerIdChange(id), [id, onTriggerIdChange])

  useLayoutEffect(() => {
    if (!hasCustomAnchor) onAnchorChange(element)
  }, [hasCustomAnchor, element, onAnchorChange])

  return (
    <Primitive
      id={context.triggerId || id}
      {...buttonType(as)}
      aria-haspopup="dialog"
      aria-expanded={context.open}
      aria-controls={context.open ? context.contentId : undefined}
      data-state={context.open ? 'open' : 'closed'}
      as={as}
      asChild={asChild}
      {...props}
      onClick={composeEventHandlers(onClick, context.onOpenToggle)}
      ref={composedRef}
    />
  )
}

export interface PopoverAnchorProps extends HTMLAttributes<HTMLElement> {
  reference?: PopoverReference
  asChild?: boolean
  as?: ComponentProps<typeof Primitive>['as']
  ref?: Ref<HTMLElement>
}

export function PopoverAnchor({ reference, as, asChild, ref, ...props }: PopoverAnchorProps) {
  const context = usePopoverRootContext('PopoverAnchor')
  const [element, setElement] = useState<HTMLElement | null>(null)
  const composedRef = useComposedRefs(ref, setElement)
  const { onCustomAnchorChange, onAnchorChange } = context

  useLayoutEffect(() => {
    onCustomAnchorChange(true)
    return () => onCustomAnchorChange(false)
  }, [onCustomAnchorChange])

  useLayoutEffect(() => {
    onAnchorChange(reference ?? element)
  }, [reference, element, onAnchorChange])

  return <Primitive as={as} asChild={asChild} {...props} ref={composedRef} />
}

export interface PopoverPortalProps {
  to?: Element | DocumentFragment | null
  children?: ReactNode
}

export function PopoverPortal({ to, children }: PopoverPortalProps) {
  const configured = usePortalContainer()
  return (
    <HnPortal asChild container={to ?? configured}>
      {children}
    </HnPortal>
  )
}

export interface PopoverContentProps extends Omit<PopperContentProps, 'ref' | 'onEscapeKeyDown'> {
  forceMount?: boolean
  reference?: PopoverReference
  disableOutsidePointerEvents?: boolean
  onEscapeKeyDown?: (event: KeyboardEvent) => void
  onPointerDownOutside?: (event: PointerDownOutsideEvent) => void
  onFocusOutside?: (event: FocusOutsideEvent) => void
  onInteractOutside?: (event: PointerDownOutsideEvent | FocusOutsideEvent) => void
  onOpenAutoFocus?: (event: Event) => void
  onCloseAutoFocus?: (event: Event) => void
  ref?: Ref<HTMLElement>
}

export function PopoverContent({ forceMount, ...props }: PopoverContentProps) {
  const context = usePopoverRootContext('PopoverContent')
  return (
    <Presence present={!!forceMount || context.open}>
      {context.modal ? <PopoverContentModal {...props} /> : <PopoverContentNonModal {...props} />}
    </Presence>
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

function PopoverContentModal({
  ref,
  onCloseAutoFocus,
  onPointerDownOutside,
  onFocusOutside,
  ...props
}: PopoverContentProps) {
  const context = usePopoverRootContext('PopoverContentModal')
  const isRightClickOutside = useRef(false)
  const [element, setElement] = useState<HTMLElement | null>(null)
  const composedRef = useComposedRefs(ref, setElement)
  useBodyScrollLock(true)
  useHideOthers(element)

  return (
    <PopoverContentImpl
      {...props}
      ref={composedRef}
      trapFocus={context.open}
      disableOutsidePointerEvents
      onCloseAutoFocus={event => {
        onCloseAutoFocus?.(event)
        event.preventDefault()
        if (!isRightClickOutside.current) context.triggerElement.current?.focus()
      }}
      onPointerDownOutside={event => {
        onPointerDownOutside?.(event)
        const originalEvent = event.detail.originalEvent
        const ctrlLeftClick = originalEvent.button === 0 && originalEvent.ctrlKey === true
        isRightClickOutside.current = originalEvent.button === 2 || ctrlLeftClick
      }}
      onFocusOutside={event => {
        onFocusOutside?.(event)
        event.preventDefault()
      }}
    />
  )
}

function PopoverContentNonModal({
  onCloseAutoFocus,
  onInteractOutside,
  ...props
}: PopoverContentProps) {
  const context = usePopoverRootContext('PopoverContentNonModal')
  const hasInteractedOutside = useRef(false)
  const hasPointerDownOutside = useRef(false)

  return (
    <PopoverContentImpl
      {...props}
      trapFocus={false}
      disableOutsidePointerEvents={false}
      onCloseAutoFocus={event => {
        onCloseAutoFocus?.(event)
        if (!event.defaultPrevented) {
          if (!hasInteractedOutside.current) context.triggerElement.current?.focus()
          event.preventDefault()
        }
        hasInteractedOutside.current = false
        hasPointerDownOutside.current = false
      }}
      onInteractOutside={event => {
        onInteractOutside?.(event)
        if (!event.defaultPrevented) {
          hasInteractedOutside.current = true
          if (event.detail.originalEvent.type === 'pointerdown')
            hasPointerDownOutside.current = true
        }
        const target = event.target as Node
        if (context.triggerElement.current?.contains(target)) event.preventDefault()
        if (event.detail.originalEvent.type === 'focusin' && hasPointerDownOutside.current)
          event.preventDefault()
      }}
    />
  )
}

interface PopoverContentImplProps extends Omit<PopoverContentProps, 'forceMount'> {
  trapFocus?: boolean
}

function PopoverContentImpl({
  trapFocus,
  disableOutsidePointerEvents,
  reference,
  onOpenAutoFocus,
  onCloseAutoFocus,
  onEscapeKeyDown,
  onPointerDownOutside,
  onFocusOutside,
  onInteractOutside,
  style,
  ref,
  ...props
}: PopoverContentImplProps) {
  const context = usePopoverRootContext('PopoverContentImpl')
  const layer = useRef<HTMLElement | null>(null)
  const composedRef = useComposedRefs(ref, layer)
  const dir = usePopperDirection(props.dir)
  const anchor = (reference ?? context.anchor ?? undefined) as PopperContentProps['reference']
  const closeAutoFocus = useCallbackRef(onCloseAutoFocus)
  useFocusGuards()

  useLayoutEffect(() => {
    const container = layer.current
    const previouslyFocusedElement = document.activeElement as HTMLElement | null
    return () => {
      if (!container) return
      const event = new CustomEvent(AUTOFOCUS_ON_UNMOUNT, { bubbles: false, cancelable: true })
      const handler = (unmount: Event) => {
        if (unmount === event) closeAutoFocus(unmount)
      }
      container.addEventListener(AUTOFOCUS_ON_UNMOUNT, handler)
      container.dispatchEvent(event)
      container.setAttribute('data-focus-scope-unmounting', '')
      setTimeout(() => {
        if (!event.defaultPrevented)
          focus(previouslyFocusedElement ?? document.body, { select: true })
        container.removeEventListener(AUTOFOCUS_ON_UNMOUNT, handler)
        container.removeAttribute('data-focus-scope-unmounting')
      }, 0)
    }
  }, [closeAutoFocus])

  const getLayer = () => layer.current

  return (
    <FocusScope
      asChild
      loop
      trapped={trapFocus}
      onMountAutoFocus={event => {
        onOpenAutoFocus?.(event)
        if (event.defaultPrevented) return
        event.preventDefault()
        autoFocusWithin(event.currentTarget as HTMLElement)
      }}
      onUnmountAutoFocus={event => event.preventDefault()}
    >
      <DismissableLayer
        asChild
        disableOutsidePointerEvents={disableOutsidePointerEvents}
        onPointerDownOutside={guardLayer(getLayer, onPointerDownOutside)}
        onInteractOutside={guardLayer(getLayer, onInteractOutside)}
        onEscapeKeyDown={onEscapeKeyDown}
        onFocusOutside={guardLayer(getLayer, onFocusOutside)}
        onDismiss={() => context.onOpenChange(false)}
      >
        <PopperContent
          {...props}
          reference={anchor}
          dir={dir}
          id={context.contentId}
          data-state={context.open ? 'open' : 'closed'}
          aria-labelledby={context.triggerId}
          role="dialog"
          data-dismissable-layer=""
          ref={composedRef}
          style={
            {
              ...style,
              '--radix-popover-content-transform-origin': 'var(--radix-popper-transform-origin)',
              '--radix-popover-content-available-width': 'var(--radix-popper-available-width)',
              '--radix-popover-content-available-height': 'var(--radix-popper-available-height)',
              '--radix-popover-trigger-width': 'var(--radix-popper-anchor-width)',
              '--radix-popover-trigger-height': 'var(--radix-popper-anchor-height)',
            } as PopperContentProps['style']
          }
        />
      </DismissableLayer>
    </FocusScope>
  )
}

export interface PopoverCloseProps extends HTMLAttributes<HTMLElement> {
  asChild?: boolean
  as?: ComponentProps<typeof Primitive>['as']
  ref?: Ref<HTMLElement>
}

export function PopoverClose({ as = 'button', asChild, onClick, ...props }: PopoverCloseProps) {
  const context = usePopoverRootContext('PopoverClose')
  return (
    <Primitive
      {...buttonType(as)}
      as={as}
      asChild={asChild}
      {...props}
      onClick={composeEventHandlers(onClick, () => context.onOpenChange(false))}
    />
  )
}

export interface PopoverArrowProps extends PopperArrowProps {}

export function PopoverArrow(props: PopoverArrowProps) {
  return <PopperArrow {...props} />
}
