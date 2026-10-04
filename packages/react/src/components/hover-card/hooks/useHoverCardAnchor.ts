'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useHoverCardRootContext } from '../../../primitives/hover-card'
import {
  overlayAnchorElement,
  useOverlayAnchor,
  type OverlayAnchor,
  type OverlayPositionStrategy,
} from '../../../lib/overlay-anchor'
import { useOverlayPortal } from '../../../lib/overlay-portal'
import { useOverlayPositionerClass } from '../../../lib/overlay-positioner'
import { inPointerCorridor } from '../../../../../shared/src/lib/pointer-corridor'

interface HoverCardAnchorOptions {
  anchor?: OverlayAnchor | null
  updatePositionStrategy: OverlayPositionStrategy
  external: boolean
  closeDelay: number
  positionerClass?: string
}

function useListener<E extends Event>(
  target: EventTarget | null | undefined,
  type: string,
  listener: (event: E) => void,
  options?: AddEventListenerOptions,
) {
  const latest = useRef(listener)
  latest.current = listener
  const capture = options?.capture
  const passive = options?.passive
  useEffect(() => {
    if (!target) return
    const handle = (event: Event) => latest.current(event as E)
    const settings = { capture, passive }
    target.addEventListener(type, handle, settings)
    return () => target.removeEventListener(type, handle, settings)
  }, [target, type, capture, passive])
}

export function useHoverCardAnchor(props: HoverCardAnchorOptions) {
  const root = useHoverCardRootContext('HoverCardAnchor')
  const anchor = props.external ? (props.anchor ?? undefined) : undefined
  const element = overlayAnchorElement(anchor)
  const virtual = !!anchor && !element
  const { content, contentRef, present } = useOverlayPortal(root.open)
  useOverlayPositionerClass(content, props.positionerClass)
  const panel = props.external ? content : null
  const reference = useOverlayAnchor(
    props.external ? anchor : root.triggerElement,
    root.open,
    present,
    props.updatePositionStrategy,
  )

  const state = useRef({ props, root, anchor, element, virtual, panel, reference })
  state.current = { props, root, anchor, element, virtual, panel, reference }
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const tracking = useRef(false)
  const frame = useRef(0)

  const [api] = useState(() => {
    function cancel() {
      clearTimeout(timer.current)
      timer.current = undefined
    }

    function dismiss() {
      cancel()
      tracking.current = false
      state.current.root.onOpenChange(false)
    }

    function close() {
      const { virtual, root, props } = state.current
      if (
        virtual ||
        timer.current !== undefined ||
        !root.open ||
        root.hasSelectionRef.current ||
        root.isPointerDownOnContentRef.current
      )
        return
      timer.current = setTimeout(dismiss, props.closeDelay)
    }

    function keep() {
      tracking.current = false
      cancel()
    }

    function track(event: Event) {
      const pointer = event as PointerEvent
      const { root, element, panel } = state.current
      if (!root.open || !tracking.current || pointer.pointerType === 'touch') return
      const target = pointer.target as Node | null
      if (target && (element?.contains(target) || panel?.contains(target))) return keep()
      const a = element?.getBoundingClientRect()
      const b = panel?.getBoundingClientRect()
      if (a && b && inPointerCorridor({ x: pointer.clientX, y: pointer.clientY }, a, b)) cancel()
      else close()
    }

    function leave(event: Event) {
      const pointer = event as PointerEvent
      const { virtual, root, element, panel } = state.current
      if (virtual || pointer.pointerType === 'touch' || !root.open) return
      tracking.current = true
      const a = element?.getBoundingClientRect()
      const b = panel?.getBoundingClientRect()
      if (a && b && inPointerCorridor({ x: pointer.clientX, y: pointer.clientY }, a, b)) cancel()
      else close()
    }

    function measure() {
      const { anchor, element, root, reference } = state.current
      if (!anchor || (element && !element.isConnected)) {
        if (root.open) dismiss()
        return
      }
      reference?.getBoundingClientRect()
    }

    function pause() {
      cancelAnimationFrame(frame.current)
      frame.current = 0
    }

    function resume() {
      if (frame.current) return
      const loop = () => {
        measure()
        frame.current = requestAnimationFrame(loop)
      }
      frame.current = requestAnimationFrame(loop)
    }

    return { cancel, dismiss, close, keep, track, leave, measure, pause, resume }
  })

  useLayoutEffect(() => {
    const handlers = root.handlers
    const original = { ...handlers }
    handlers.onOpen = () => (state.current.props.external ? api.keep() : original.onOpen())
    handlers.onClose = () => (state.current.props.external ? api.close() : original.onClose())
    handlers.onDismiss = () => (state.current.props.external ? api.dismiss() : original.onDismiss())
    return () => {
      api.cancel()
      api.pause()
      Object.assign(handlers, original)
    }
  }, [root.handlers, api])

  const previousAnchor = useRef<OverlayAnchor | undefined>(undefined)
  useLayoutEffect(() => {
    const changed = anchor !== previousAnchor.current
    previousAnchor.current = anchor
    api.cancel()
    tracking.current = false
    api.pause()
    if (!props.external || !present) return
    if (changed) {
      root.hasSelectionRef.current = false
      root.isPointerDownOnContentRef.current = false
    }
    api.measure()
    if (!virtual) api.resume()
  }, [anchor, root.open, present])

  useListener(element, 'pointerenter', api.keep)
  useListener(element, 'pointerleave', api.leave)
  useListener(element, 'focusin', api.keep)
  useListener<FocusEvent>(element, 'focusout', event => {
    const target = event.relatedTarget as Node | null
    const { element, panel } = state.current
    if (!target || (!element?.contains(target) && !panel?.contains(target))) api.close()
  })
  useListener(panel, 'pointerenter', api.keep)
  useListener(panel, 'pointerleave', api.leave)
  useListener(element?.ownerDocument, 'pointermove', api.track)
  useListener(
    element?.ownerDocument,
    'scroll',
    event => {
      const { root, element } = state.current
      if (root.open && (event.target as Node | null)?.contains(element ?? null)) api.dismiss()
    },
    { capture: true, passive: true },
  )

  return { reference, contentRef, present }
}
