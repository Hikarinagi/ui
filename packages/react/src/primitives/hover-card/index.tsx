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
  type ComponentProps,
  type HTMLAttributes,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type Ref,
  type RefObject,
} from 'react'
import { usePortalContainer } from '../../lib/config'
import { Primitive } from '../../lib/primitive'
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
  exitSideFromRect,
  hull,
  isPointInPolygon,
  paddedExitPoints,
  pointsFromRect,
  type Polygon,
} from '../utils/grace-area'

export type { FocusOutsideEvent, PointerDownOutsideEvent } from '../utils/dismissable'
import { DismissableLayer } from '../dismissable-layer'
import { Portal as HnPortal } from '../portal'
import { Presence } from '../presence'
import { composeEventHandlers } from '../utils/compose-event-handlers'
import { useComposedRefs } from '../utils/compose-refs'
import { useControllableState } from '../utils/controllable-state'

export interface HoverCardReference {
  getBoundingClientRect: () => Pick<
    DOMRect,
    'x' | 'y' | 'width' | 'height' | 'top' | 'right' | 'bottom' | 'left'
  >
  contextElement?: Element
}

export interface HoverCardHandlers {
  onOpen: () => void
  onClose: () => void
  onDismiss: () => void
}

interface RootContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
  handlers: HoverCardHandlers
  hasSelectionRef: RefObject<boolean>
  isPointerDownOnContentRef: RefObject<boolean>
  isPointerInTransitRef: RefObject<boolean>
  triggerElement: HTMLElement | null
  onTriggerChange: (element: HTMLElement | null) => void
  enableTouch: boolean
  anchor: HoverCardReference | HTMLElement | null
  onAnchorChange: (anchor: HoverCardReference | HTMLElement | null) => void
}

const RootContext = createContext<RootContextValue | null>(null)

export function useHoverCardRootContext(consumer = 'HoverCardRoot') {
  const context = useContext(RootContext)
  if (!context) throw new Error(`\`${consumer}\` must be used within \`HoverCardRoot\``)
  return context
}

function excludeTouch(handler: () => void) {
  return (event: ReactPointerEvent | PointerEvent) =>
    event.pointerType === 'touch' ? undefined : handler()
}

export interface HoverCardRootProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  openDelay?: number
  closeDelay?: number
  enableTouch?: boolean
  children?: ReactNode
}

export function HoverCardRoot({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  openDelay = 700,
  closeDelay = 300,
  enableTouch = false,
  children,
}: HoverCardRootProps) {
  const [open = false, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
    caller: 'HoverCardRoot',
  })
  const openTimer = useRef(0)
  const closeTimer = useRef(0)
  const hasSelectionRef = useRef(false)
  const isPointerDownOnContentRef = useRef(false)
  const isPointerInTransitRef = useRef(false)
  const [triggerElement, setTriggerElement] = useState<HTMLElement | null>(null)
  const [anchor, setAnchor] = useState<HoverCardReference | HTMLElement | null>(null)
  const latest = useRef({ setOpen, openDelay, closeDelay })
  latest.current = { setOpen, openDelay, closeDelay }

  const [handlers] = useState<HoverCardHandlers>(() => ({
    onOpen() {
      window.clearTimeout(closeTimer.current)
      openTimer.current = window.setTimeout(
        () => latest.current.setOpen(true),
        latest.current.openDelay,
      )
    },
    onClose() {
      window.clearTimeout(openTimer.current)
      if (!hasSelectionRef.current && !isPointerDownOnContentRef.current)
        closeTimer.current = window.setTimeout(
          () => latest.current.setOpen(false),
          latest.current.closeDelay,
        )
    },
    onDismiss() {
      window.clearTimeout(openTimer.current)
      latest.current.setOpen(false)
    },
  }))

  useEffect(
    () => () => {
      window.clearTimeout(openTimer.current)
      window.clearTimeout(closeTimer.current)
    },
    [],
  )

  const onOpenChangeCallback = useCallback((value: boolean) => setOpen(value), [setOpen])

  const value = useMemo<RootContextValue>(
    () => ({
      open,
      onOpenChange: onOpenChangeCallback,
      handlers,
      hasSelectionRef,
      isPointerDownOnContentRef,
      isPointerInTransitRef,
      triggerElement,
      onTriggerChange: setTriggerElement,
      enableTouch,
      anchor,
      onAnchorChange: setAnchor,
    }),
    [open, onOpenChangeCallback, handlers, triggerElement, enableTouch, anchor],
  )

  return (
    <PopperRoot>
      <RootContext value={value}>{children}</RootContext>
    </PopperRoot>
  )
}

export interface HoverCardTriggerProps extends HTMLAttributes<HTMLElement> {
  reference?: HoverCardReference
  asChild?: boolean
  as?: ComponentProps<typeof Primitive>['as']
  ref?: Ref<HTMLElement>
}

export function HoverCardTrigger({
  reference,
  as = 'a',
  asChild,
  ref,
  onPointerEnter,
  onPointerLeave,
  onPointerUp,
  onFocus,
  onBlur,
  ...props
}: HoverCardTriggerProps) {
  const context = useHoverCardRootContext('HoverCardTrigger')
  const [element, setElement] = useState<HTMLElement | null>(null)
  const { onTriggerChange, onAnchorChange } = context
  const composedRef = useComposedRefs(ref, setElement, onTriggerChange)
  const latest = useRef(context)
  latest.current = context

  useLayoutEffect(() => {
    onAnchorChange(reference ?? element)
  }, [reference, element, onAnchorChange])

  function handleLeave() {
    setTimeout(() => {
      const root = latest.current
      if (!root.isPointerInTransitRef.current && !root.open) root.handlers.onClose()
    }, 0)
  }

  function handleTouch(event: ReactPointerEvent) {
    const root = latest.current
    if (!root.enableTouch || event.pointerType !== 'touch') return
    if (root.open) root.handlers.onDismiss()
    else root.onOpenChange(true)
  }

  return (
    <Primitive
      as={as}
      asChild={asChild}
      data-state={context.open ? 'open' : 'closed'}
      data-grace-area-trigger=""
      {...props}
      onPointerEnter={composeEventHandlers(
        onPointerEnter,
        excludeTouch(() => latest.current.handlers.onOpen()),
      )}
      onPointerLeave={composeEventHandlers(onPointerLeave, excludeTouch(handleLeave))}
      onPointerUp={composeEventHandlers(onPointerUp, handleTouch)}
      onFocus={composeEventHandlers(onFocus, () => latest.current.handlers.onOpen())}
      onBlur={composeEventHandlers(onBlur, () => latest.current.handlers.onClose())}
      ref={composedRef}
    />
  )
}

export interface HoverCardPortalProps {
  to?: Element | DocumentFragment | null
  children?: ReactNode
}

export function HoverCardPortal({ to, children }: HoverCardPortalProps) {
  const configured = usePortalContainer()
  return (
    <HnPortal asChild container={to ?? configured}>
      {children}
    </HnPortal>
  )
}

export interface HoverCardContentProps extends Omit<PopperContentProps, 'ref' | 'onEscapeKeyDown'> {
  forceMount?: boolean
  reference?: HoverCardReference
  onEscapeKeyDown?: (event: KeyboardEvent) => void
  onPointerDownOutside?: (event: PointerDownOutsideEvent) => void
  onFocusOutside?: (event: FocusOutsideEvent) => void
  ref?: Ref<HTMLElement>
}

export function HoverCardContent({ forceMount, onPointerEnter, ...props }: HoverCardContentProps) {
  const context = useHoverCardRootContext('HoverCardContent')
  const latest = useRef(context)
  latest.current = context
  return (
    <Presence present={!!forceMount || context.open}>
      <HoverCardContentImpl
        {...props}
        onPointerEnter={composeEventHandlers(
          onPointerEnter,
          excludeTouch(() => latest.current.handlers.onOpen()),
        )}
      />
    </Presence>
  )
}

function useGraceArea(
  trigger: HTMLElement | null,
  container: HTMLElement | null,
  inTransit: RefObject<boolean>,
  onPointerExit: () => void,
) {
  const exit = useRef(onPointerExit)
  exit.current = onPointerExit

  useEffect(() => {
    if (!trigger || !container) return
    const document = trigger.ownerDocument
    let graceArea: Polygon | null = null
    let resetTimer = 0

    const setInTransit = (value: boolean) => {
      inTransit.current = value
      window.clearTimeout(resetTimer)
      if (value)
        resetTimer = window.setTimeout(() => {
          inTransit.current = false
        }, 300)
    }

    const track = (event: PointerEvent) => {
      if (!graceArea || !(event.target instanceof Element)) return
      const target = event.target
      const position = { x: event.clientX, y: event.clientY }
      const hasEnteredTarget = trigger.contains(target) || container.contains(target)
      const isPointerOutsideGraceArea = !isPointInPolygon(position, graceArea)
      const isAnotherGraceAreaTrigger = !!target.closest('[data-grace-area-trigger]')
      if (hasEnteredTarget) removeGraceArea()
      else if (isPointerOutsideGraceArea || isAnotherGraceAreaTrigger) {
        removeGraceArea()
        exit.current()
      }
    }

    function removeGraceArea() {
      graceArea = null
      setInTransit(false)
      document.removeEventListener('pointermove', track)
    }

    const create = (event: PointerEvent, hoverTarget: HTMLElement) => {
      const currentTarget = event.currentTarget as HTMLElement
      const exitPoint = { x: event.clientX, y: event.clientY }
      const exitSide = exitSideFromRect(exitPoint, currentTarget.getBoundingClientRect())
      graceArea = hull([
        ...paddedExitPoints(exitPoint, exitSide, 1),
        ...pointsFromRect(hoverTarget.getBoundingClientRect()),
      ])
      setInTransit(true)
      document.addEventListener('pointermove', track)
    }

    const onTriggerLeave = (event: PointerEvent) => create(event, container)
    const onContentLeave = (event: PointerEvent) => create(event, trigger)
    trigger.addEventListener('pointerleave', onTriggerLeave)
    container.addEventListener('pointerleave', onContentLeave)
    return () => {
      trigger.removeEventListener('pointerleave', onTriggerLeave)
      container.removeEventListener('pointerleave', onContentLeave)
      document.removeEventListener('pointermove', track)
      window.clearTimeout(resetTimer)
      inTransit.current = false
    }
  }, [trigger, container, inTransit])
}

function getTabbableNodes(container: HTMLElement) {
  const nodes: HTMLElement[] = []
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (node: Element) =>
      (node as HTMLElement).tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP,
  })
  while (walker.nextNode()) nodes.push(walker.currentNode as HTMLElement)
  return nodes
}

function HoverCardContentImpl({
  reference,
  onEscapeKeyDown,
  onPointerDownOutside,
  onFocusOutside,
  onPointerDown,
  style,
  ref,
  ...props
}: Omit<HoverCardContentProps, 'forceMount'>) {
  const context = useHoverCardRootContext('HoverCardContentImpl')
  const [content, setContent] = useState<HTMLElement | null>(null)
  const layer = useRef<HTMLElement | null>(null)
  const composedRef = useComposedRefs(ref, setContent, layer)
  const dir = usePopperDirection(props.dir)
  const anchor = (reference ?? context.anchor ?? undefined) as PopperContentProps['reference']
  const [containSelection, setContainSelection] = useState(false)
  const latest = useRef(context)
  latest.current = context

  useGraceArea(context.triggerElement, content, context.isPointerInTransitRef, () =>
    latest.current.handlers.onClose(),
  )

  useEffect(() => {
    if (!containSelection) return
    const body = document.body
    const original = body.style.userSelect || body.style.webkitUserSelect
    body.style.userSelect = 'none'
    body.style.webkitUserSelect = 'none'
    return () => {
      body.style.userSelect = original
      body.style.webkitUserSelect = original
    }
  }, [containSelection])

  useEffect(() => {
    const element = layer.current
    const root = latest.current
    const handlePointerUp = () => {
      setContainSelection(false)
      root.isPointerDownOnContentRef.current = false
      void Promise.resolve().then(() => {
        const hasSelection = document.getSelection()?.toString() !== ''
        if (hasSelection) root.hasSelectionRef.current = true
      })
    }
    if (element) {
      document.addEventListener('pointerup', handlePointerUp)
      for (const tabbable of getTabbableNodes(element)) tabbable.setAttribute('tabindex', '-1')
    }
    const handleScroll = (event: Event) => {
      const target = event.target as Node | null
      const trigger = latest.current.triggerElement
      if (trigger && target?.contains(trigger)) latest.current.handlers.onDismiss()
    }
    window.addEventListener('scroll', handleScroll, { capture: true })
    return () => {
      document.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('scroll', handleScroll, { capture: true })
      root.hasSelectionRef.current = false
      root.isPointerDownOnContentRef.current = false
    }
  }, [])

  const getLayer = () => layer.current

  return (
    <DismissableLayer
      asChild
      disableOutsidePointerEvents={false}
      onEscapeKeyDown={onEscapeKeyDown}
      onPointerDownOutside={guardLayer(getLayer, onPointerDownOutside)}
      onInteractOutside={guardLayer(getLayer)}
      onFocusOutside={guardLayer(getLayer, (event: FocusOutsideEvent) => {
        event.preventDefault()
        onFocusOutside?.(event)
      })}
      onDismiss={() => latest.current.handlers.onDismiss()}
    >
      <PopperContent
        {...props}
        reference={anchor}
        dir={dir}
        data-state={context.open ? 'open' : 'closed'}
        data-dismissable-layer=""
        ref={composedRef}
        style={
          {
            ...style,
            userSelect: containSelection ? 'text' : undefined,
            WebkitUserSelect: containSelection ? 'text' : undefined,
            '--radix-hover-card-content-transform-origin': 'var(--radix-popper-transform-origin)',
            '--radix-hover-card-content-available-width': 'var(--radix-popper-available-width)',
            '--radix-hover-card-content-available-height': 'var(--radix-popper-available-height)',
            '--radix-hover-card-trigger-width': 'var(--radix-popper-anchor-width)',
            '--radix-hover-card-trigger-height': 'var(--radix-popper-anchor-height)',
          } as PopperContentProps['style']
        }
        onPointerDown={composeEventHandlers(onPointerDown, event => {
          if (event.currentTarget.contains(event.target as Node)) setContainSelection(true)
          latest.current.hasSelectionRef.current = false
          latest.current.isPointerDownOnContentRef.current = true
        })}
      />
    </DismissableLayer>
  )
}

export interface HoverCardArrowProps extends PopperArrowProps {}

export function HoverCardArrow(props: HoverCardArrowProps) {
  return <PopperArrow {...props} />
}
