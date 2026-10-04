'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ComponentProps,
  type CSSProperties,
  type MutableRefObject,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react'
import { Portal as RadixPortal } from 'radix-ui'
import {
  DismissableLayer,
  FocusScope,
  Presence,
  useCallbackRef,
  useComposedRefs,
  useControllableState,
  useLayoutEffect,
} from 'radix-ui/internal'
import { hideOthers } from 'aria-hidden'
import { Primitive, type PrimitiveElementProps } from '../../lib/primitive'
import { useBodyScrollLock } from '../body-scroll-lock'
import { usePortalContainer } from '../../lib/config'
import { focus, focusFirst, getActiveElement, getTabbableCandidates } from './focus'
import { guardLayer } from '../utils/dismissable'

type LayerProps = ComponentProps<typeof DismissableLayer.Root>
export type PointerDownOutsideEvent = Parameters<NonNullable<LayerProps['onPointerDownOutside']>>[0]
export type FocusOutsideEvent = Parameters<NonNullable<LayerProps['onFocusOutside']>>[0]

const AUTOFOCUS_ON_UNMOUNT = 'focusScope.autoFocusOnUnmount'

interface DialogIds {
  content: string
  title: string
  description: string
}

export interface DialogRootContextValue {
  open: boolean
  modal: boolean
  unmountOnHide: boolean
  openModal: () => void
  onOpenChange: (open: boolean) => void
  onOpenToggle: () => void
  ids: DialogIds
  triggerElement: MutableRefObject<HTMLElement | null>
  contentElement: MutableRefObject<HTMLElement | null>
}

const DialogRootContext = createContext<DialogRootContextValue | null>(null)

export function useDialogRootContext(consumer = 'DialogRoot') {
  const context = useContext(DialogRootContext)
  if (!context) throw new Error(`\`${consumer}\` must be used within \`DialogRoot\``)
  return context
}

export interface DialogRootSlotProps {
  open: boolean
  close: () => void
}

export interface DialogRootProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  modal?: boolean
  unmountOnHide?: boolean
  children?: ReactNode | ((props: DialogRootSlotProps) => ReactNode)
}

export function DialogRoot({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  modal = true,
  unmountOnHide = true,
  children,
}: DialogRootProps) {
  const [open = false, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
    caller: 'DialogRoot',
  })
  const ids = useRef<DialogIds>({ content: '', title: '', description: '' }).current
  const triggerElement = useRef<HTMLElement | null>(null)
  const contentElement = useRef<HTMLElement | null>(null)
  const close = useCallback(() => setOpen(false), [setOpen])

  const value: DialogRootContextValue = {
    open,
    modal,
    unmountOnHide,
    openModal: () => setOpen(true),
    onOpenChange: setOpen,
    onOpenToggle: () => setOpen(previous => !previous),
    ids,
    triggerElement,
    contentElement,
  }

  return (
    <DialogRootContext value={value}>
      {typeof children === 'function' ? children({ open, close }) : children}
    </DialogRootContext>
  )
}

type ButtonLikeProps = PrimitiveElementProps &
  Pick<ButtonHTMLAttributes<HTMLElement>, 'type' | 'disabled'>

export type DialogTriggerProps = ButtonLikeProps

export function DialogTrigger({
  as = 'button',
  asChild,
  ref,
  onClick,
  ...props
}: DialogTriggerProps) {
  const context = useDialogRootContext('DialogTrigger')
  const id = useId()
  if (!context.ids.content) context.ids.content = id
  const element = useRef<HTMLElement | null>(null)
  const composedRef = useComposedRefs(ref, element)

  useLayoutEffect(() => {
    context.triggerElement.current = element.current
  }, [])

  const own = {
    type: as === 'button' ? 'button' : undefined,
    'aria-haspopup': 'dialog',
    'aria-expanded': context.open || false,
    'aria-controls': context.open ? context.ids.content : undefined,
    'data-state': context.open ? 'open' : 'closed',
  } as PrimitiveElementProps

  return (
    <Primitive
      as={as}
      asChild={asChild}
      {...own}
      {...props}
      onClick={event => {
        context.onOpenToggle()
        onClick?.(event)
      }}
      ref={composedRef}
    />
  )
}

export interface DialogPortalProps {
  to?: string | Element | null
  disabled?: boolean
  defer?: boolean
  forceMount?: boolean
  children?: ReactNode
}

export function DialogPortal({
  to,
  disabled = false,
  forceMount = false,
  children,
}: DialogPortalProps) {
  const configured = usePortalContainer()
  const [mounted, setMounted] = useState(false)
  useLayoutEffect(() => setMounted(true), [])
  if (!mounted && !forceMount) return null
  if (disabled) return <>{children}</>
  const target = typeof to === 'string' ? (mounted ? document.querySelector(to) : null) : to
  return (
    <RadixPortal.Root asChild container={target ?? configured ?? undefined}>
      <>{children}</>
    </RadixPortal.Root>
  )
}

export interface DialogOverlayProps extends PrimitiveElementProps {
  forceMount?: boolean
}

export function DialogOverlay({ forceMount, ref, ...props }: DialogOverlayProps) {
  const context = useDialogRootContext('DialogOverlay')
  if (!context.modal) return null
  const keep = !!forceMount || !context.unmountOnHide
  return (
    <Presence.Root present={!!forceMount || context.open}>
      {keep ? (
        ({ present }) => (
          <DialogOverlayImpl
            {...props}
            ref={ref}
            present={context.unmountOnHide || present}
            shown={context.unmountOnHide || present}
          />
        )
      ) : (
        <DialogOverlayImpl {...props} ref={ref} present shown />
      )}
    </Presence.Root>
  )
}

interface OverlayImplProps extends PrimitiveElementProps {
  present: boolean
  shown: boolean
}

function DialogOverlayImpl({
  as,
  asChild,
  present,
  shown,
  style,
  onPointerDown,
  ref,
  ...props
}: OverlayImplProps) {
  const context = useDialogRootContext('DialogOverlay')
  useBodyScrollLock(present)
  return (
    <Primitive
      as={as}
      asChild={asChild}
      data-state={context.open ? 'open' : 'closed'}
      {...props}
      style={hidden({ pointerEvents: 'auto', ...style }, shown)}
      onPointerDown={(event: ReactPointerEvent<HTMLElement>) => {
        if (event.button === 0 && event.target === event.currentTarget) event.preventDefault()
        onPointerDown?.(event)
      }}
      ref={ref}
    />
  )
}

function hidden(style: CSSProperties | undefined, shown: boolean): CSSProperties | undefined {
  return shown ? style : { ...style, display: 'none' }
}

export interface DialogContentProps extends PrimitiveElementProps {
  forceMount?: boolean
  disableOutsidePointerEvents?: boolean
  onEscapeKeyDown?: (event: KeyboardEvent) => void
  onPointerDownOutside?: (event: PointerDownOutsideEvent) => void
  onFocusOutside?: (event: FocusOutsideEvent) => void
  onInteractOutside?: (event: PointerDownOutsideEvent | FocusOutsideEvent) => void
  onOpenAutoFocus?: (event: Event) => void
  onCloseAutoFocus?: (event: Event) => void
}

export function DialogContent({ forceMount, ref, ...props }: DialogContentProps) {
  const context = useDialogRootContext('DialogContent')
  const keep = !!forceMount || !context.unmountOnHide
  const Impl = context.modal ? DialogContentModal : DialogContentNonModal
  return (
    <Presence.Root present={!!forceMount || context.open}>
      {keep ? (
        ({ present }) => (
          <Impl
            key={context.modal ? 0 : 1}
            {...props}
            ref={ref}
            present={context.unmountOnHide || present}
            shown={context.unmountOnHide || present}
          />
        )
      ) : (
        <Impl key={context.modal ? 0 : 1} {...props} ref={ref} present shown />
      )}
    </Presence.Root>
  )
}

interface ContentVariantProps extends Omit<DialogContentProps, 'forceMount'> {
  present: boolean
  shown: boolean
}

function DialogContentModal({
  present,
  disableOutsidePointerEvents = true,
  onCloseAutoFocus,
  onPointerDownOutside,
  onFocusOutside,
  ref,
  ...props
}: ContentVariantProps) {
  const context = useDialogRootContext('DialogContent')
  const [element, setElement] = useState<HTMLElement | null>(null)
  const composedRef = useComposedRefs(ref, setElement)
  const wasPresent = useRef(present)

  useEffect(() => {
    if (!present || !element) return
    let insideClosedPopover = false
    try {
      insideClosedPopover = !!element.closest('[popover]:not(:popover-open)')
    } catch {}
    if (insideClosedPopover) return
    return hideOthers(element)
  }, [present, element])

  useEffect(() => {
    if (!present && wasPresent.current) context.triggerElement.current?.focus()
    wasPresent.current = present
  }, [present])

  return (
    <DialogContentImpl
      {...props}
      ref={composedRef}
      present={present}
      trapFocus={context.open}
      disableOutsidePointerEvents={disableOutsidePointerEvents}
      onCloseAutoFocus={event => {
        onCloseAutoFocus?.(event)
        if (event.defaultPrevented) return
        event.preventDefault()
        context.triggerElement.current?.focus()
      }}
      onPointerDownOutside={event => {
        onPointerDownOutside?.(event)
        const original = event.detail.originalEvent
        const ctrlLeftClick = original.button === 0 && original.ctrlKey === true
        if (original.button === 2 || ctrlLeftClick) event.preventDefault()
      }}
      onFocusOutside={event => {
        onFocusOutside?.(event)
        event.preventDefault()
      }}
    />
  )
}

function DialogContentNonModal({
  present,
  onCloseAutoFocus,
  onInteractOutside,
  ref,
  ...props
}: ContentVariantProps) {
  const context = useDialogRootContext('DialogContent')
  const interacted = useRef(false)
  const pointerDown = useRef(false)
  const wasPresent = useRef(present)

  useEffect(() => {
    if (!present && wasPresent.current) {
      if (!interacted.current) context.triggerElement.current?.focus()
      interacted.current = false
      pointerDown.current = false
    }
    wasPresent.current = present
  }, [present])

  return (
    <DialogContentImpl
      {...props}
      ref={ref}
      present={present}
      trapFocus={false}
      disableOutsidePointerEvents={false}
      onCloseAutoFocus={event => {
        onCloseAutoFocus?.(event)
        if (!event.defaultPrevented) {
          if (!interacted.current) context.triggerElement.current?.focus()
          event.preventDefault()
        }
        interacted.current = false
        pointerDown.current = false
      }}
      onInteractOutside={event => {
        onInteractOutside?.(event)
        if (!event.defaultPrevented) {
          interacted.current = true
          if (event.detail.originalEvent.type === 'pointerdown') pointerDown.current = true
        }
        const target = event.target as Node
        if (context.triggerElement.current?.contains(target)) event.preventDefault()
        if (event.detail.originalEvent.type === 'focusin' && pointerDown.current)
          event.preventDefault()
      }}
    />
  )
}

interface ContentImplProps extends ContentVariantProps {
  trapFocus: boolean
}

const TITLE_WARNING = `Warning: \`DialogContent\` requires a \`DialogTitle\` for the component to be accessible for screen reader users.

If you want to hide the \`DialogTitle\`, you can wrap it with our VisuallyHidden component.

For more information, see https://www.reka-ui.com/docs/components/dialog.html#title`

const DESCRIPTION_WARNING =
  'Warning: Missing `Description` or `aria-describedby="undefined"` for DialogContent.'

function DialogContentImpl({
  as,
  asChild,
  present,
  shown,
  trapFocus,
  disableOutsidePointerEvents,
  onEscapeKeyDown,
  onPointerDownOutside,
  onFocusOutside,
  onInteractOutside,
  onOpenAutoFocus,
  onCloseAutoFocus,
  style,
  ref,
  ...attrs
}: ContentImplProps) {
  const context = useDialogRootContext('DialogContent')
  const titleId = useId()
  const descriptionId = useId()
  if (!context.ids.title) context.ids.title = titleId
  if (!context.ids.description) context.ids.description = descriptionId
  const node = useRef<HTMLElement | null>(null)
  const composedRef = useComposedRefs(ref, node)
  const closeAutoFocus = useCallbackRef(onCloseAutoFocus)

  useLayoutEffect(() => {
    const container = node.current
    context.contentElement.current = container
    const active = getActiveElement()
    if (active !== document.body) context.triggerElement.current = active as HTMLElement | null
    const previous = active
    return () => {
      if (!container) return
      const event = new CustomEvent(AUTOFOCUS_ON_UNMOUNT, { bubbles: false, cancelable: true })
      const handler = (unmount: Event) => closeAutoFocus(unmount)
      container.addEventListener(AUTOFOCUS_ON_UNMOUNT, handler)
      container.dispatchEvent(event)
      container.setAttribute('data-focus-scope-unmounting', '')
      setTimeout(() => {
        if (!event.defaultPrevented) focus(previous ?? document.body, { select: true })
        container.removeEventListener(AUTOFOCUS_ON_UNMOUNT, handler)
        container.removeAttribute('data-focus-scope-unmounting')
      }, 0)
    }
  }, [])

  useEffect(() => {
    if (!import.meta.env.DEV) return
    if (!document.getElementById(context.ids.title)) console.warn(TITLE_WARNING)
    const describedById = node.current?.getAttribute('aria-describedby')
    if (context.ids.description && describedById) {
      if (!document.getElementById(context.ids.description)) console.warn(DESCRIPTION_WARNING)
    }
  }, [])

  return (
    <FocusScope.Root
      asChild
      loop
      trapped={trapFocus}
      onMountAutoFocus={event => {
        onOpenAutoFocus?.(event)
        if (event.defaultPrevented) return
        event.preventDefault()
        const container = node.current
        if (!container) return
        const previous = getActiveElement()
        focusFirst(getTabbableCandidates(container), { select: true })
        if (getActiveElement() === previous) focus(container)
      }}
      onUnmountAutoFocus={event => event.preventDefault()}
    >
      <DismissableLayer.Root
        asChild
        disableOutsidePointerEvents={disableOutsidePointerEvents}
        onEscapeKeyDown={onEscapeKeyDown}
        onPointerDownOutside={guardLayer(() => node.current, onPointerDownOutside)}
        onFocusOutside={guardLayer(() => node.current, onFocusOutside)}
        onInteractOutside={guardLayer(() => node.current, onInteractOutside)}
        onDismiss={() => context.onOpenChange(false)}
        style={hidden(style, shown)}
      >
        <Primitive
          as={as}
          asChild={asChild}
          id={context.ids.content}
          role="dialog"
          aria-describedby={context.ids.description}
          aria-labelledby={context.ids.title}
          data-state={context.open ? 'open' : 'closed'}
          {...attrs}
          data-dismissable-layer=""
          ref={composedRef}
        />
      </DismissableLayer.Root>
    </FocusScope.Root>
  )
}

export interface DialogTitleProps extends PrimitiveElementProps {}

export function DialogTitle({ as = 'h2', ...props }: DialogTitleProps) {
  const context = useDialogRootContext('DialogTitle')
  return <Primitive as={as} id={context.ids.title} {...props} />
}

export interface DialogDescriptionProps extends PrimitiveElementProps {}

export function DialogDescription({ as = 'p', ...props }: DialogDescriptionProps) {
  const context = useDialogRootContext('DialogDescription')
  return <Primitive as={as} id={context.ids.description} {...props} />
}

export type DialogCloseProps = ButtonLikeProps

export function DialogClose({ as = 'button', onClick, ...props }: DialogCloseProps) {
  const context = useDialogRootContext('DialogClose')
  const own = { type: as === 'button' ? 'button' : undefined } as PrimitiveElementProps
  return (
    <Primitive
      as={as}
      {...own}
      {...props}
      onClick={event => {
        context.onOpenChange(false)
        onClick?.(event)
      }}
    />
  )
}
