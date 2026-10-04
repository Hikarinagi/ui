'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import { useOverlayPortal } from './overlay-portal'
import {
  overlayAnchorContext,
  overlayAnchorElement,
  useOverlayAnchor,
  type OverlayAnchor,
  type OverlayPositionStrategy,
} from './overlay-anchor'

import type { FocusOutsideEvent, PointerDownOutsideEvent } from '../primitives/utils/dismissable'

export type { FocusOutsideEvent, PointerDownOutsideEvent } from '../primitives/utils/dismissable'

export interface AnchoredOverlayEmits {
  onOpenAutoFocus?: (event: Event) => void
  onCloseAutoFocus?: (event: Event) => void
  onEscapeKeyDown?: (event: KeyboardEvent) => void
  onPointerDownOutside?: (event: PointerDownOutsideEvent) => void
  onFocusOutside?: (event: FocusOutsideEvent) => void
  onInteractOutside?: (event: PointerDownOutsideEvent | FocusOutsideEvent) => void
}

export interface AnchoredOverlayEvents {
  onOpenAutoFocus?: (event: Event) => void
  onCloseAutoFocus: (event: Event) => void
  onInteractOutside: (event: PointerDownOutsideEvent | FocusOutsideEvent) => void
  onPointerDownOutside: (event: PointerDownOutsideEvent) => void
  onFocusOutside: (event: FocusOutsideEvent) => void
  onEscapeKeyDown: (event: KeyboardEvent) => void
}

function once<E extends Event>(handler: (event: E) => void) {
  const handled = new WeakSet<E>()
  return (event: E) => {
    if (handled.has(event)) return
    handled.add(event)
    handler(event)
  }
}

export function useAnchoredOverlay(
  props: {
    anchor?: OverlayAnchor | null
    modal: boolean
    updatePositionStrategy: OverlayPositionStrategy
    dir?: 'ltr' | 'rtl'
  },
  open: boolean | undefined,
  emit: Omit<AnchoredOverlayEmits, 'onOpenAutoFocus'>,
  openAutoFocus?: (event: Event) => void,
) {
  const [triggerElement, setTriggerElement] = useState<HTMLElement | null>(null)
  const visible = !!open && !!(props.anchor || triggerElement)
  const { content, contentRef, present } = useOverlayPortal(visible)
  const reference = useOverlayAnchor(
    props.anchor ?? triggerElement,
    visible,
    present,
    props.updatePositionStrategy,
    props.dir,
  )

  const latest = useRef({ props, emit, openAutoFocus, triggerElement, visible })
  latest.current = { props, emit, openAutoFocus, triggerElement, visible }
  const previousFocus = useRef<HTMLElement | null>(null)
  const interactedOutside = useRef(false)

  useLayoutEffect(() => {
    if (!visible) return
    const document =
      overlayAnchorContext(latest.current.props.anchor)?.ownerDocument ??
      latest.current.triggerElement?.ownerDocument ??
      globalThis.document
    previousFocus.current = document?.activeElement as HTMLElement | null
    interactedOutside.current = false
  }, [visible])

  const [events] = useState(() => ({
    onOpenAutoFocus: once((event: Event) => latest.current.openAutoFocus?.(event)),
    onCloseAutoFocus: once((event: Event) => {
      latest.current.emit.onCloseAutoFocus?.(event)
      const cancelled = event.defaultPrevented
      event.preventDefault()
      const panel = event.target as HTMLElement
      const target = latest.current.triggerElement ?? previousFocus.current
      const restore = !cancelled && !interactedOutside.current
      void Promise.resolve().then(() => {
        const active = panel.ownerDocument.activeElement
        if (
          restore &&
          !latest.current.visible &&
          target?.isConnected &&
          (active === panel.ownerDocument.body || panel.contains(active))
        )
          target.focus({ preventScroll: true })
      })
    }),
    onInteractOutside: once((event: PointerDownOutsideEvent | FocusOutsideEvent) => {
      const { props, emit, triggerElement } = latest.current
      if (!triggerElement && overlayAnchorElement(props.anchor)?.contains(event.target as Node))
        event.preventDefault()
      emit.onInteractOutside?.(event)
      const original = event.detail.originalEvent
      const rightClick =
        'button' in original &&
        (original.button === 2 || (original.button === 0 && original.ctrlKey))
      if (!event.defaultPrevented && (!props.modal || rightClick)) interactedOutside.current = true
    }),
    onPointerDownOutside: once((event: PointerDownOutsideEvent) =>
      latest.current.emit.onPointerDownOutside?.(event),
    ),
    onFocusOutside: once((event: FocusOutsideEvent) => latest.current.emit.onFocusOutside?.(event)),
    onEscapeKeyDown: once((event: KeyboardEvent) => latest.current.emit.onEscapeKeyDown?.(event)),
  }))

  return {
    trigger: setTriggerElement,
    triggerElement,
    content,
    contentRef,
    present,
    reference,
    visible,
    events: {
      ...(openAutoFocus ? { onOpenAutoFocus: events.onOpenAutoFocus } : {}),
      onCloseAutoFocus: events.onCloseAutoFocus,
      onInteractOutside: events.onInteractOutside,
      onPointerDownOutside: events.onPointerDownOutside,
      onFocusOutside: events.onFocusOutside,
      onEscapeKeyDown: events.onEscapeKeyDown,
    } as AnchoredOverlayEvents,
  }
}
