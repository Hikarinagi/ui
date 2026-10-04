'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
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
import { Portal as RadixPortal } from 'radix-ui'
import { usePortalContainer } from '../../lib/config'
import {
  DismissableLayer,
  Presence,
  composeEventHandlers,
  useComposedRefs,
  useControllableState,
} from 'radix-ui/internal'
import { Primitive } from '../../lib/primitive'
import { PrimitiveVisuallyHidden } from '../visually-hidden'
import {
  PopperArrow,
  PopperContent,
  PopperRoot,
  PopperVirtualAnchor,
  usePopperDirection,
  type PopperArrowProps,
  type PopperContentProps,
} from '../popper'
import {
  exitSideFromRect,
  hull,
  isPointInPolygon,
  paddedExitPoints,
  pointsFromRect,
  type Polygon,
} from '../utils/grace-area'

const TOOLTIP_OPEN = 'tooltip.open'

interface ProviderContextValue {
  isOpenDelayed: RefObject<boolean>
  delayDuration: number
  onOpen: () => void
  onClose: () => void
  isPointerInTransit: RefObject<boolean>
  onPointerInTransitChange: (inTransit: boolean) => void
  disableHoverableContent: boolean
  disableClosingTrigger: boolean
  disabled: boolean
  ignoreNonKeyboardFocus: boolean
}

const ProviderContext = createContext<ProviderContextValue | null>(null)

function useProviderContext(consumer: string) {
  const context = useContext(ProviderContext)
  if (!context) throw new Error(`\`${consumer}\` must be used within \`TooltipProvider\``)
  return context
}

export interface TooltipProviderProps {
  delayDuration?: number
  skipDelayDuration?: number
  disableHoverableContent?: boolean
  disableClosingTrigger?: boolean
  disabled?: boolean
  ignoreNonKeyboardFocus?: boolean
  children?: ReactNode
}

export function TooltipProvider({
  delayDuration = 700,
  skipDelayDuration = 300,
  disableHoverableContent = false,
  disableClosingTrigger = false,
  disabled = false,
  ignoreNonKeyboardFocus = false,
  children,
}: TooltipProviderProps) {
  const isOpenDelayed = useRef(true)
  const isPointerInTransit = useRef(false)
  const skipDelayTimer = useRef(0)

  useEffect(() => () => window.clearTimeout(skipDelayTimer.current), [])

  const onOpen = useCallback(() => {
    window.clearTimeout(skipDelayTimer.current)
    isOpenDelayed.current = false
  }, [])

  const onClose = useCallback(() => {
    window.clearTimeout(skipDelayTimer.current)
    skipDelayTimer.current = window.setTimeout(() => {
      isOpenDelayed.current = true
    }, skipDelayDuration)
  }, [skipDelayDuration])

  const onPointerInTransitChange = useCallback((inTransit: boolean) => {
    isPointerInTransit.current = inTransit
  }, [])

  const value = useMemo<ProviderContextValue>(
    () => ({
      isOpenDelayed,
      delayDuration,
      onOpen,
      onClose,
      isPointerInTransit,
      onPointerInTransitChange,
      disableHoverableContent,
      disableClosingTrigger,
      disabled,
      ignoreNonKeyboardFocus,
    }),
    [
      delayDuration,
      onOpen,
      onClose,
      onPointerInTransitChange,
      disableHoverableContent,
      disableClosingTrigger,
      disabled,
      ignoreNonKeyboardFocus,
    ],
  )

  return <ProviderContext value={value}>{children}</ProviderContext>
}

interface RootContextValue {
  contentId: string
  open: boolean
  stateAttribute: 'closed' | 'delayed-open' | 'instant-open'
  trigger: HTMLElement | null
  onTriggerChange: (trigger: HTMLElement | null) => void
  onTriggerEnter: () => void
  onTriggerLeave: () => void
  onOpen: () => void
  onClose: () => void
  disableHoverableContent: boolean
  disableClosingTrigger: boolean
  disabled: boolean
  ignoreNonKeyboardFocus: boolean
}

const RootContext = createContext<RootContextValue | null>(null)

function useRootContext(consumer: string) {
  const context = useContext(RootContext)
  if (!context) throw new Error(`\`${consumer}\` must be used within \`TooltipRoot\``)
  return context
}

export interface TooltipRootProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  delayDuration?: number
  disableHoverableContent?: boolean
  disableClosingTrigger?: boolean
  disabled?: boolean
  ignoreNonKeyboardFocus?: boolean
  children?: ReactNode
}

export function TooltipRoot(props: TooltipRootProps) {
  const provider = useProviderContext('TooltipRoot')
  const disableHoverableContent = props.disableHoverableContent ?? provider.disableHoverableContent
  const disableClosingTrigger = props.disableClosingTrigger ?? provider.disableClosingTrigger
  const disabled = props.disabled ?? provider.disabled
  const delayDuration = props.delayDuration ?? provider.delayDuration
  const ignoreNonKeyboardFocus = props.ignoreNonKeyboardFocus ?? provider.ignoreNonKeyboardFocus
  const contentId = useId()
  const [trigger, setTrigger] = useState<HTMLElement | null>(null)
  const wasOpenDelayed = useRef(false)
  const openTimer = useRef(0)

  const [open = false, setOpen] = useControllableState({
    prop: props.open,
    defaultProp: props.defaultOpen ?? false,
    onChange: next => {
      if (next) {
        provider.onOpen()
        document.dispatchEvent(new CustomEvent(TOOLTIP_OPEN))
      } else provider.onClose()
      props.onOpenChange?.(next)
    },
    caller: 'TooltipRoot',
  })

  const stateAttribute = open
    ? wasOpenDelayed.current
      ? 'delayed-open'
      : 'instant-open'
    : 'closed'

  const clearTimer = useCallback(() => {
    window.clearTimeout(openTimer.current)
    openTimer.current = 0
  }, [])

  const handleOpen = useCallback(() => {
    clearTimer()
    wasOpenDelayed.current = false
    setOpen(true)
  }, [clearTimer, setOpen])

  const handleClose = useCallback(() => {
    clearTimer()
    setOpen(false)
  }, [clearTimer, setOpen])

  const handleDelayedOpen = useCallback(() => {
    clearTimer()
    openTimer.current = window.setTimeout(() => {
      wasOpenDelayed.current = true
      setOpen(true)
      openTimer.current = 0
    }, delayDuration)
  }, [clearTimer, delayDuration, setOpen])

  useEffect(() => clearTimer, [clearTimer])

  const onTriggerEnter = useCallback(() => {
    if (provider.isOpenDelayed.current) handleDelayedOpen()
    else handleOpen()
  }, [provider.isOpenDelayed, handleDelayedOpen, handleOpen])

  const onTriggerLeave = useCallback(() => {
    if (disableHoverableContent) handleClose()
    else clearTimer()
  }, [disableHoverableContent, handleClose, clearTimer])

  const value: RootContextValue = {
    contentId,
    open,
    stateAttribute,
    trigger,
    onTriggerChange: setTrigger,
    onTriggerEnter,
    onTriggerLeave,
    onOpen: handleOpen,
    onClose: handleClose,
    disableHoverableContent,
    disableClosingTrigger,
    disabled,
    ignoreNonKeyboardFocus,
  }

  return (
    <PopperRoot>
      <RootContext value={value}>{props.children}</RootContext>
    </PopperRoot>
  )
}

export interface TooltipTriggerProps extends HTMLAttributes<HTMLElement> {
  asChild?: boolean
  as?: ComponentProps<typeof Primitive>['as']
  ref?: Ref<HTMLElement>
}

export function TooltipTrigger({ asChild, as = 'button', ref, ...props }: TooltipTriggerProps) {
  const context = useRootContext('TooltipTrigger')
  const provider = useProviderContext('TooltipTrigger')
  const anchor = useRef<HTMLElement | null>(null)
  const composedRef = useComposedRefs(ref, anchor, context.onTriggerChange)
  const isPointerDown = useRef(false)
  const hasPointerMoveOpened = useRef(false)

  const handlePointerUp = useCallback(() => {
    setTimeout(() => {
      isPointerDown.current = false
    }, 1)
  }, [])

  useEffect(
    () => () => document.removeEventListener('pointerup', handlePointerUp),
    [handlePointerUp],
  )

  const listeners = context.disabled
    ? {}
    : {
        onClick: composeEventHandlers(props.onClick, () => {
          if (!context.disableClosingTrigger) context.onClose()
        }),
        onFocus: composeEventHandlers(props.onFocus, event => {
          if (isPointerDown.current) return
          if (
            context.ignoreNonKeyboardFocus &&
            !(event.target as HTMLElement).matches?.(':focus-visible')
          )
            return
          context.onOpen()
        }),
        onPointerMove: composeEventHandlers(props.onPointerMove, (event: ReactPointerEvent) => {
          if (event.pointerType === 'touch') return
          if (!hasPointerMoveOpened.current && !provider.isPointerInTransit.current) {
            context.onTriggerEnter()
            hasPointerMoveOpened.current = true
          }
        }),
        onPointerLeave: composeEventHandlers(props.onPointerLeave, () => {
          context.onTriggerLeave()
          hasPointerMoveOpened.current = false
        }),
        onPointerDown: composeEventHandlers(props.onPointerDown, () => {
          if (context.open && !context.disableClosingTrigger) context.onClose()
          isPointerDown.current = true
          document.addEventListener('pointerup', handlePointerUp, { once: true })
        }),
        onBlur: composeEventHandlers(props.onBlur, () => context.onClose()),
      }

  return (
    <>
      <PopperVirtualAnchor anchor={anchor} />
      <Primitive
        as={as}
        asChild={asChild}
        aria-describedby={context.open ? context.contentId : undefined}
        data-state={context.stateAttribute}
        {...props}
        {...listeners}
        data-grace-area-trigger=""
        ref={composedRef}
      />
    </>
  )
}

export interface TooltipPortalProps {
  forceMount?: boolean
  container?: Element | DocumentFragment | null
  children?: ReactNode
}

const PortalContext = createContext<{ forceMount?: boolean }>({})

export function TooltipPortal({ forceMount, container, children }: TooltipPortalProps) {
  const configured = usePortalContainer()
  const context = useRootContext('TooltipPortal')
  return (
    <PortalContext value={{ forceMount }}>
      <Presence.Root present={!!forceMount || context.open}>
        <RadixPortal.Root asChild container={container ?? configured}>
          {children}
        </RadixPortal.Root>
      </Presence.Root>
    </PortalContext>
  )
}

export interface TooltipContentProps extends Omit<PopperContentProps, 'ref'> {
  forceMount?: boolean
  'aria-label'?: string
  onEscapeKeyDown?: (event: KeyboardEvent) => void
  onPointerDownOutside?: (event: CustomEvent<{ originalEvent: PointerEvent }>) => void
  ref?: Ref<HTMLDivElement>
}

export function TooltipContent(props: TooltipContentProps) {
  const portal = useContext(PortalContext)
  const { forceMount = portal.forceMount, side = 'top', ...contentProps } = props
  const context = useRootContext('TooltipContent')
  return (
    <Presence.Root present={!!forceMount || context.open}>
      {context.disableHoverableContent ? (
        <TooltipContentImpl side={side} {...contentProps} />
      ) : (
        <TooltipContentHoverable side={side} {...contentProps} />
      )}
    </Presence.Root>
  )
}

function TooltipContentHoverable({ ref, ...props }: TooltipContentProps) {
  const context = useRootContext('TooltipContent')
  const provider = useProviderContext('TooltipContent')
  const [element, setElement] = useState<HTMLDivElement | null>(null)
  const composedRef = useComposedRefs(ref, setElement)
  const { trigger, onClose } = context
  const { onPointerInTransitChange } = provider
  const close = useRef(onClose)
  close.current = onClose

  useEffect(() => {
    if (!trigger || !element) return
    let graceArea: Polygon | null = null

    const track = (event: PointerEvent) => {
      if (!graceArea) return
      const target = event.target as Node
      const position = { x: event.clientX, y: event.clientY }
      const entered = trigger.contains(target) || element.contains(target)
      if (entered) removeGraceArea()
      else if (!isPointInPolygon(position, graceArea)) {
        removeGraceArea()
        close.current()
      }
    }

    function removeGraceArea() {
      graceArea = null
      onPointerInTransitChange(false)
      document.removeEventListener('pointermove', track)
    }

    const create = (event: PointerEvent, hoverTarget: HTMLElement) => {
      const currentTarget = event.currentTarget as HTMLElement
      const exitPoint = { x: event.clientX, y: event.clientY }
      const exitSide = exitSideFromRect(exitPoint, currentTarget.getBoundingClientRect())
      graceArea = hull([
        ...paddedExitPoints(exitPoint, exitSide),
        ...pointsFromRect(hoverTarget.getBoundingClientRect()),
      ])
      onPointerInTransitChange(true)
      document.addEventListener('pointermove', track)
    }

    const onTriggerLeave = (event: PointerEvent) => create(event, element)
    const onContentLeave = (event: PointerEvent) => create(event, trigger)
    trigger.addEventListener('pointerleave', onTriggerLeave)
    element.addEventListener('pointerleave', onContentLeave)
    return () => {
      trigger.removeEventListener('pointerleave', onTriggerLeave)
      element.removeEventListener('pointerleave', onContentLeave)
      removeGraceArea()
    }
  }, [trigger, element, onPointerInTransitChange])

  return <TooltipContentImpl {...props} ref={composedRef} />
}

function TooltipContentImpl({
  'aria-label': ariaLabelProp,
  onEscapeKeyDown,
  onPointerDownOutside,
  children,
  style,
  ref,
  ...props
}: TooltipContentProps) {
  const context = useRootContext('TooltipContent')
  const [element, setElement] = useState<HTMLDivElement | null>(null)
  const composedRef = useComposedRefs(ref, setElement)
  const [text, setText] = useState<string | undefined>(undefined)
  const { trigger, onClose } = context
  const dir = usePopperDirection(props.dir)

  useEffect(() => {
    if (!element) return
    setText(element.textContent ?? '')
  }, [element])

  useEffect(() => {
    document.addEventListener(TOOLTIP_OPEN, onClose)
    return () => document.removeEventListener(TOOLTIP_OPEN, onClose)
  }, [onClose])

  useEffect(() => {
    const onScroll = (event: Event) => {
      const target = event.target as Node | null
      if (target?.contains(trigger)) onClose()
    }
    window.addEventListener('scroll', onScroll, { capture: true })
    return () => window.removeEventListener('scroll', onScroll, { capture: true })
  }, [trigger, onClose])

  return (
    <DismissableLayer.Root
      asChild
      disableOutsidePointerEvents={false}
      onEscapeKeyDown={onEscapeKeyDown}
      onPointerDownOutside={event => {
        if (context.disableClosingTrigger && trigger?.contains(event.target as Node))
          event.preventDefault()
        onPointerDownOutside?.(event)
      }}
      onFocusOutside={event => event.preventDefault()}
      onDismiss={onClose}
    >
      <PopperContent
        data-state={context.stateAttribute}
        dir={dir}
        {...props}
        data-dismissable-layer=""
        ref={composedRef}
        style={
          {
            ...style,
            '--radix-tooltip-content-transform-origin': 'var(--radix-popper-transform-origin)',
            '--radix-tooltip-content-available-width': 'var(--radix-popper-available-width)',
            '--radix-tooltip-content-available-height': 'var(--radix-popper-available-height)',
            '--radix-tooltip-trigger-width': 'var(--radix-popper-anchor-width)',
            '--radix-tooltip-trigger-height': 'var(--radix-popper-anchor-height)',
          } as PopperContentProps['style']
        }
      >
        {children}
        <PrimitiveVisuallyHidden id={context.contentId} role="tooltip">
          {ariaLabelProp ?? text}
        </PrimitiveVisuallyHidden>
      </PopperContent>
    </DismissableLayer.Root>
  )
}

export interface TooltipArrowProps extends PopperArrowProps {}

export function TooltipArrow(props: TooltipArrowProps) {
  return <PopperArrow {...props} />
}
