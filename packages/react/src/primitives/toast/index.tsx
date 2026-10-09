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
  type CSSProperties,
  type ReactNode,
  type Ref,
  type RefObject,
} from 'react'
import { usePortalContainer } from '../../lib/config'
import { Primitive, type PrimitiveElementProps } from '../../lib/primitive'
import { PrimitiveVisuallyHidden } from '../visually-hidden'
import { focusFirst, getActiveElement, getTabbableCandidates } from '../dialog/focus'
import {
  TOAST_SWIPE_CANCEL,
  TOAST_SWIPE_END,
  TOAST_SWIPE_MOVE,
  TOAST_SWIPE_START,
  VIEWPORT_PAUSE,
  VIEWPORT_RESUME,
  getAnnounceTextContent,
  handleAndDispatchCustomEvent,
  isDeltaInDirection,
  type SwipeDirection,
  type SwipeEvent,
} from './utils'

export type { SwipeDirection, SwipeEvent } from './utils'
import { createCollection } from '../collection'
import { DismissableLayerBranch } from '../dismissable-layer'
import { Portal as HnPortal } from '../portal'
import { Presence } from '../presence'
import { useCallbackRef } from '../utils/callback-ref'
import { useComposedRefs } from '../utils/compose-refs'
import { useControllableState } from '../utils/controllable-state'

const [ToastCollection, useToastCollection] = createCollection<HTMLElement>('Toast')

interface ProviderContextValue {
  label: string
  duration: number
  disableSwipe: boolean
  swipeDirection: SwipeDirection
  swipeThreshold: number
  toastCount: number
  viewport: HTMLElement | null
  onViewportChange: (viewport: HTMLElement | null) => void
  onToastAdd: () => void
  onToastRemove: () => void
  isFocusedToastEscapeKeyDownRef: RefObject<boolean>
  isClosePausedRef: RefObject<boolean>
}

const ProviderContext = createContext<ProviderContextValue | null>(null)

function useProviderContext(consumer: string) {
  const context = useContext(ProviderContext)
  if (!context) throw new Error(`\`${consumer}\` must be used within \`ToastProvider\``)
  return context
}

export interface ToastProviderProps {
  label?: string
  duration?: number
  disableSwipe?: boolean
  swipeDirection?: SwipeDirection
  swipeThreshold?: number
  children?: ReactNode
}

export function ToastProvider({
  label = 'Notification',
  duration = 5000,
  disableSwipe = false,
  swipeDirection = 'right',
  swipeThreshold = 50,
  children,
}: ToastProviderProps) {
  const [viewport, setViewport] = useState<HTMLElement | null>(null)
  const [toastCount, setToastCount] = useState(0)
  const isFocusedToastEscapeKeyDownRef = useRef(false)
  const isClosePausedRef = useRef(false)

  if (label && typeof label === 'string' && !label.trim())
    throw new Error(
      'Invalid prop `label` supplied to `ToastProvider`. Expected non-empty `string`.',
    )

  const onToastAdd = useCallback(() => setToastCount(count => count + 1), [])
  const onToastRemove = useCallback(() => setToastCount(count => count - 1), [])

  const value = useMemo<ProviderContextValue>(
    () => ({
      label,
      duration,
      disableSwipe,
      swipeDirection,
      swipeThreshold,
      toastCount,
      viewport,
      onViewportChange: setViewport,
      onToastAdd,
      onToastRemove,
      isFocusedToastEscapeKeyDownRef,
      isClosePausedRef,
    }),
    [
      label,
      duration,
      disableSwipe,
      swipeDirection,
      swipeThreshold,
      toastCount,
      viewport,
      onToastAdd,
      onToastRemove,
    ],
  )

  return (
    <ToastCollection.Provider>
      <ProviderContext value={value}>{children}</ProviderContext>
    </ToastCollection.Provider>
  )
}

const DEFAULT_HOTKEY = ['F8']

interface FocusProxyProps {
  onFocusFromOutsideViewport: () => void
  ref?: Ref<HTMLElement>
}

function FocusProxy({ onFocusFromOutsideViewport, ref }: FocusProxyProps) {
  const context = useProviderContext('ToastFocusProxy')
  return (
    <PrimitiveVisuallyHidden
      ref={ref}
      tabIndex={0}
      style={{ position: 'fixed' }}
      onFocus={event => {
        const previous = event.relatedTarget as Node | null
        if (!context.viewport?.contains(previous)) onFocusFromOutsideViewport()
      }}
    />
  )
}

export interface ToastViewportProps extends PrimitiveElementProps {
  hotkey?: string[]
  label?: string | ((hotkey: string) => string)
}

export function ToastViewport({
  hotkey = DEFAULT_HOTKEY,
  label = 'Notifications ({hotkey})',
  as = 'ol',
  asChild,
  ref,
  ...props
}: ToastViewportProps) {
  const context = useProviderContext('ToastViewport')
  const getItems = useToastCollection()
  const viewportRef = useRef<HTMLElement | null>(null)
  const composedRef = useComposedRefs(ref, viewportRef, context.onViewportChange)
  const headFocusProxyRef = useRef<HTMLElement | null>(null)
  const tailFocusProxyRef = useRef<HTMLElement | null>(null)
  const hasToasts = context.toastCount > 0
  const hotkeyMessage = hotkey.join('+').replace(/Key/g, '').replace(/Digit/g, '')
  const keys = useRef(hotkey)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (keys.current.includes(event.key)) viewportRef.current?.focus()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const getSortedTabbableCandidates = useCallback(
    ({ tabbingDirection }: { tabbingDirection: 'forwards' | 'backwards' }) => {
      const toastItems = getItems()
        .map(item => item.ref.current)
        .filter((node): node is HTMLElement => !!node && node.dataset.disabled !== '')
      const tabbableCandidates = toastItems.map(toastNode => {
        const toastTabbableCandidates = [toastNode, ...getTabbableCandidates(toastNode)]
        return tabbingDirection === 'forwards'
          ? toastTabbableCandidates
          : toastTabbableCandidates.reverse()
      })
      return (
        tabbingDirection === 'forwards' ? tabbableCandidates.reverse() : tabbableCandidates
      ).flat()
    },
    [getItems],
  )

  useEffect(() => {
    const viewport = viewportRef.current
    if (!hasToasts || !viewport) return
    const handlePause = () => {
      if (!context.isClosePausedRef.current) {
        viewport.dispatchEvent(new CustomEvent(VIEWPORT_PAUSE))
        context.isClosePausedRef.current = true
      }
    }
    const handleResume = () => {
      if (context.isClosePausedRef.current) {
        viewport.dispatchEvent(new CustomEvent(VIEWPORT_RESUME))
        context.isClosePausedRef.current = false
      }
    }
    const handleFocusOutResume = (event: FocusEvent) => {
      if (!viewport.contains(event.relatedTarget as Node | null)) handleResume()
    }
    const handlePointerLeaveResume = () => {
      if (!viewport.contains(getActiveElement())) handleResume()
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      const isMetaKey = event.altKey || event.ctrlKey || event.metaKey
      const isTabKey = event.key === 'Tab' && !isMetaKey
      if (!isTabKey) return
      const focusedElement = getActiveElement()
      const isTabbingBackwards = event.shiftKey
      const targetIsViewport = event.target === viewport
      if (targetIsViewport && isTabbingBackwards) {
        headFocusProxyRef.current?.focus()
        return
      }
      const tabbingDirection = isTabbingBackwards ? 'backwards' : 'forwards'
      const sortedCandidates = getSortedTabbableCandidates({ tabbingDirection })
      const index = sortedCandidates.findIndex(candidate => candidate === focusedElement)
      if (focusFirst(sortedCandidates.slice(index + 1))) event.preventDefault()
      else if (isTabbingBackwards) headFocusProxyRef.current?.focus()
      else tailFocusProxyRef.current?.focus()
    }
    viewport.addEventListener('focusin', handlePause)
    viewport.addEventListener('focusout', handleFocusOutResume)
    viewport.addEventListener('pointermove', handlePause)
    viewport.addEventListener('pointerleave', handlePointerLeaveResume)
    viewport.addEventListener('keydown', handleKeyDown)
    window.addEventListener('blur', handlePause)
    window.addEventListener('focus', handleResume)
    return () => {
      viewport.removeEventListener('focusin', handlePause)
      viewport.removeEventListener('focusout', handleFocusOutResume)
      viewport.removeEventListener('pointermove', handlePause)
      viewport.removeEventListener('pointerleave', handlePointerLeaveResume)
      viewport.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('blur', handlePause)
      window.removeEventListener('focus', handleResume)
    }
  }, [hasToasts, context.isClosePausedRef, getSortedTabbableCandidates])

  return (
    <DismissableLayerBranch
      role="region"
      aria-label={
        typeof label === 'string' ? label.replace('{hotkey}', hotkeyMessage) : label(hotkeyMessage)
      }
      tabIndex={-1}
      style={{ pointerEvents: hasToasts ? undefined : 'none' }}
    >
      {hasToasts && (
        <FocusProxy
          ref={headFocusProxyRef}
          onFocusFromOutsideViewport={() =>
            focusFirst(getSortedTabbableCandidates({ tabbingDirection: 'forwards' }))
          }
        />
      )}
      <ToastCollection.Slot>
        <Primitive tabIndex={-1} as={as} asChild={asChild} {...props} ref={composedRef} />
      </ToastCollection.Slot>
      {hasToasts && (
        <FocusProxy
          ref={tailFocusProxyRef}
          onFocusFromOutsideViewport={() =>
            focusFirst(getSortedTabbableCandidates({ tabbingDirection: 'backwards' }))
          }
        />
      )}
    </DismissableLayerBranch>
  )
}

interface RootContextValue {
  onClose: (event?: { pointerType?: string }) => void
}

const RootContext = createContext<RootContextValue | null>(null)

function useRootContext(consumer: string) {
  const context = useContext(RootContext)
  if (!context) throw new Error(`\`${consumer}\` must be used within \`ToastRoot\``)
  return context
}

interface ToastRootEvents {
  onEscapeKeyDown?: (event: KeyboardEvent) => void
  onPause?: () => void
  onResume?: () => void
  onSwipeStart?: (event: SwipeEvent) => void
  onSwipeMove?: (event: SwipeEvent) => void
  onSwipeCancel?: (event: SwipeEvent) => void
  onSwipeEnd?: (event: SwipeEvent) => void
}

export interface ToastRootProps
  extends Omit<PrimitiveElementProps, 'onPause' | 'onResume'>, ToastRootEvents {
  defaultOpen?: boolean
  forceMount?: boolean
  type?: 'foreground' | 'background'
  open?: boolean
  onOpenChange?: (open: boolean) => void
  duration?: number
}

export function ToastRoot({
  defaultOpen = true,
  forceMount,
  type = 'foreground',
  open: openProp,
  onOpenChange,
  onSwipeStart,
  onSwipeMove,
  onSwipeCancel,
  onSwipeEnd,
  ...props
}: ToastRootProps) {
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
    caller: 'ToastRoot',
  })

  return (
    <Presence present={!!forceMount || open}>
      <ToastRootImpl
        {...props}
        open={open}
        type={type}
        onClose={() => setOpen(false)}
        onSwipeStart={event => {
          onSwipeStart?.(event)
          if (!event.defaultPrevented) event.currentTarget.setAttribute('data-swipe', 'start')
        }}
        onSwipeMove={event => {
          onSwipeMove?.(event)
          if (event.defaultPrevented) return
          const { x, y } = event.detail.delta
          const target = event.currentTarget
          target.setAttribute('data-swipe', 'move')
          target.style.setProperty('--radix-toast-swipe-move-x', `${x}px`)
          target.style.setProperty('--radix-toast-swipe-move-y', `${y}px`)
        }}
        onSwipeCancel={event => {
          onSwipeCancel?.(event)
          if (event.defaultPrevented) return
          const target = event.currentTarget
          target.setAttribute('data-swipe', 'cancel')
          target.style.removeProperty('--radix-toast-swipe-move-x')
          target.style.removeProperty('--radix-toast-swipe-move-y')
          target.style.removeProperty('--radix-toast-swipe-end-x')
          target.style.removeProperty('--radix-toast-swipe-end-y')
        }}
        onSwipeEnd={event => {
          onSwipeEnd?.(event)
          if (event.defaultPrevented) return
          const { x, y } = event.detail.delta
          const target = event.currentTarget
          target.setAttribute('data-swipe', 'end')
          target.style.removeProperty('--radix-toast-swipe-move-x')
          target.style.removeProperty('--radix-toast-swipe-move-y')
          target.style.setProperty('--radix-toast-swipe-end-x', `${x}px`)
          target.style.setProperty('--radix-toast-swipe-end-y', `${y}px`)
          setOpen(false)
        }}
      />
    </Presence>
  )
}

interface ToastRootImplProps
  extends Omit<PrimitiveElementProps, 'onPause' | 'onResume'>, ToastRootEvents {
  type?: 'foreground' | 'background'
  open: boolean
  duration?: number
  onClose: () => void
}

function ToastRootImpl({
  type,
  open,
  duration: durationProp,
  as = 'li',
  asChild,
  onClose,
  onEscapeKeyDown,
  onPause,
  onResume,
  onSwipeStart,
  onSwipeMove,
  onSwipeCancel,
  onSwipeEnd,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  style,
  ref,
  ...props
}: ToastRootImplProps) {
  const provider = useProviderContext('ToastRoot')
  const [node, setNode] = useState<HTMLElement | null>(null)
  const composedRef = useComposedRefs(ref, setNode)
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null)
  const swipeDeltaRef = useRef<{ x: number; y: number } | null>(null)
  const duration = typeof durationProp === 'number' ? durationProp : provider.duration
  const closeTimerStartTimeRef = useRef(0)
  const closeTimerRemainingTimeRef = useRef(duration)
  const closeTimerRef = useRef(0)
  const handlePause = useCallbackRef(onPause)
  const handleResume = useCallbackRef(onResume)
  const handleEscapeKeyDown = useCallbackRef(onEscapeKeyDown)

  if (type && !['foreground', 'background'].includes(type))
    throw new Error('Invalid prop `type` supplied to `Toast`. Expected `foreground | background`.')

  const handleClose = useCallbackRef((event?: { pointerType?: string }) => {
    const isNonPointerEvent = event?.pointerType === ''
    const isFocusInToast = node?.contains(getActiveElement())
    if (isFocusInToast && isNonPointerEvent) provider.viewport?.focus()
    if (isNonPointerEvent) provider.isClosePausedRef.current = false
    onClose()
  })

  const startTimer = useCallbackRef((delay: number) => {
    if (delay <= 0 || delay === Number.POSITIVE_INFINITY) return
    window.clearTimeout(closeTimerRef.current)
    closeTimerStartTimeRef.current = Date.now()
    closeTimerRef.current = window.setTimeout(() => handleClose(), delay)
  })

  useEffect(() => {
    const viewport = provider.viewport
    if (!viewport) return
    const resume = () => {
      startTimer(closeTimerRemainingTimeRef.current)
      handleResume()
    }
    const pause = () => {
      const elapsedTime = Date.now() - closeTimerStartTimeRef.current
      closeTimerRemainingTimeRef.current = closeTimerRemainingTimeRef.current - elapsedTime
      window.clearTimeout(closeTimerRef.current)
      handlePause()
    }
    viewport.addEventListener(VIEWPORT_PAUSE, pause)
    viewport.addEventListener(VIEWPORT_RESUME, resume)
    return () => {
      viewport.removeEventListener(VIEWPORT_PAUSE, pause)
      viewport.removeEventListener(VIEWPORT_RESUME, resume)
    }
  }, [provider.viewport, startTimer, handlePause, handleResume])

  useEffect(() => {
    closeTimerRemainingTimeRef.current = duration
    if (open && !provider.isClosePausedRef.current) startTimer(duration)
  }, [open, duration, provider.isClosePausedRef, startTimer])

  useEffect(() => () => window.clearTimeout(closeTimerRef.current), [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      handleEscapeKeyDown(event)
      if (event.defaultPrevented) return
      provider.isFocusedToastEscapeKeyDownRef.current = true
      handleClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [handleEscapeKeyDown, handleClose, provider.isFocusedToastEscapeKeyDownRef])

  const { onToastAdd, onToastRemove } = provider
  useEffect(() => {
    onToastAdd()
    return () => onToastRemove()
  }, [onToastAdd, onToastRemove])

  const announceTextContent = useMemo(() => (node ? getAnnounceTextContent(node) : null), [node])
  const rootContext = useMemo(() => ({ onClose: handleClose }), [handleClose])
  const swipeStyle: CSSProperties | undefined = provider.disableSwipe
    ? style
    : { ...style, userSelect: 'none', touchAction: 'none' }

  return (
    <RootContext value={rootContext}>
      {announceTextContent && (
        <ToastAnnounce role="alert" aria-live={type === 'foreground' ? 'assertive' : 'polite'}>
          {announceTextContent}
        </ToastAnnounce>
      )}
      {provider.viewport && (
        <HnPortal asChild container={provider.viewport}>
          <ToastCollection.ItemSlot>
            <Primitive
              tabIndex={0}
              {...props}
              as={as}
              asChild={asChild}
              data-state={open ? 'open' : 'closed'}
              data-swipe-direction={provider.swipeDirection}
              style={swipeStyle}
              ref={composedRef}
              onPointerDown={event => {
                onPointerDown?.(event)
                if (event.button !== 0) return
                if (provider.disableSwipe) return
                pointerStartRef.current = { x: event.clientX, y: event.clientY }
              }}
              onPointerMove={event => {
                onPointerMove?.(event)
                if (provider.disableSwipe || !pointerStartRef.current) return
                const x = event.clientX - pointerStartRef.current.x
                const y = event.clientY - pointerStartRef.current.y
                const hasSwipeMoveStarted = Boolean(swipeDeltaRef.current)
                const isHorizontalSwipe = ['left', 'right'].includes(provider.swipeDirection)
                const clamp = ['left', 'up'].includes(provider.swipeDirection) ? Math.min : Math.max
                const clampedX = isHorizontalSwipe ? clamp(0, x) : 0
                const clampedY = !isHorizontalSwipe ? clamp(0, y) : 0
                const moveStartBuffer = event.pointerType === 'touch' ? 10 : 2
                const delta = { x: clampedX, y: clampedY }
                const target = event.currentTarget
                const detail = { originalEvent: event.nativeEvent, delta }
                if (hasSwipeMoveStarted) {
                  swipeDeltaRef.current = delta
                  handleAndDispatchCustomEvent(TOAST_SWIPE_MOVE, target, onSwipeMove, detail)
                } else if (isDeltaInDirection(delta, provider.swipeDirection, moveStartBuffer)) {
                  swipeDeltaRef.current = delta
                  handleAndDispatchCustomEvent(TOAST_SWIPE_START, target, onSwipeStart, detail)
                  ;(event.target as HTMLElement).setPointerCapture(event.pointerId)
                } else if (Math.abs(x) > moveStartBuffer || Math.abs(y) > moveStartBuffer) {
                  pointerStartRef.current = null
                }
              }}
              onPointerUp={event => {
                onPointerUp?.(event)
                if (provider.disableSwipe) return
                const delta = swipeDeltaRef.current
                const target = event.target as HTMLElement
                if (target.hasPointerCapture(event.pointerId))
                  target.releasePointerCapture(event.pointerId)
                swipeDeltaRef.current = null
                pointerStartRef.current = null
                if (!delta) return
                const toast = event.currentTarget
                const detail = { originalEvent: event.nativeEvent, delta }
                if (isDeltaInDirection(delta, provider.swipeDirection, provider.swipeThreshold))
                  handleAndDispatchCustomEvent(TOAST_SWIPE_END, toast, onSwipeEnd, detail)
                else handleAndDispatchCustomEvent(TOAST_SWIPE_CANCEL, toast, onSwipeCancel, detail)
                toast.addEventListener('click', clickEvent => clickEvent.preventDefault(), {
                  once: true,
                })
              }}
            />
          </ToastCollection.ItemSlot>
        </HnPortal>
      )}
    </RootContext>
  )
}

interface ToastAnnounceProps {
  role: string
  'aria-live': 'assertive' | 'polite'
  children: string[]
}

function ToastAnnounce({ children, ...props }: ToastAnnounceProps) {
  const provider = useProviderContext('ToastAnnounce')
  const [renderAnnounceText, setRenderAnnounceText] = useState(false)

  useEffect(() => {
    let inner = 0
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setRenderAnnounceText(true))
    })
    const announced = window.setTimeout(() => setRenderAnnounceText(true), 1000)
    return () => {
      cancelAnimationFrame(outer)
      cancelAnimationFrame(inner)
      window.clearTimeout(announced)
    }
  }, [])

  if (!renderAnnounceText) return null
  return (
    <PrimitiveVisuallyHidden feature="fully-hidden" {...props}>
      {`${provider.label} `}
      {children}
    </PrimitiveVisuallyHidden>
  )
}

export interface ToastAnnounceExcludeProps extends PrimitiveElementProps {
  altText?: string
}

export function ToastAnnounceExclude({ altText, ...props }: ToastAnnounceExcludeProps) {
  return (
    <Primitive
      data-radix-toast-announce-exclude=""
      data-radix-toast-announce-alt={altText || undefined}
      {...props}
    />
  )
}

export type ToastCloseProps = PrimitiveElementProps

export function ToastClose({ as = 'button', asChild, onClick, ...props }: ToastCloseProps) {
  const root = useRootContext('ToastClose')
  return (
    <ToastAnnounceExclude asChild>
      <Primitive
        as={as}
        asChild={asChild}
        {...props}
        {...{ type: as === 'button' ? 'button' : undefined }}
        onClick={event => {
          onClick?.(event)
          root.onClose(event.nativeEvent as PointerEvent)
        }}
      />
    </ToastAnnounceExclude>
  )
}

export interface ToastActionProps extends ToastCloseProps {
  altText: string
}

export function ToastAction({ altText, ...props }: ToastActionProps) {
  if (!altText) throw new Error('Missing prop `altText` expected on `ToastAction`')
  return (
    <ToastAnnounceExclude altText={altText} asChild>
      <ToastClose {...props} />
    </ToastAnnounceExclude>
  )
}

export type ToastTitleProps = PrimitiveElementProps

export function ToastTitle(props: ToastTitleProps) {
  return <Primitive {...props} />
}

export type ToastDescriptionProps = PrimitiveElementProps

export function ToastDescription(props: ToastDescriptionProps) {
  return <Primitive {...props} />
}

export interface ToastPortalProps {
  to?: string | Element | null
  disabled?: boolean
  defer?: boolean
  forceMount?: boolean
  children?: ReactNode
}

export function ToastPortal({
  to,
  disabled = false,
  forceMount = false,
  children,
}: ToastPortalProps) {
  const [mounted, setMounted] = useState(false)
  const configured = usePortalContainer()
  useLayoutEffect(() => setMounted(true), [])
  if (!mounted && !forceMount) return null
  if (disabled) return <>{children}</>
  const target = typeof to === 'string' ? (mounted ? document.querySelector(to) : null) : to
  return (
    <HnPortal asChild container={target ?? configured ?? undefined}>
      <>{children}</>
    </HnPortal>
  )
}
