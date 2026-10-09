'use client'

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from 'react'
import {
  addBranch,
  addLayer,
  blockOutsidePointerEvents,
  inBranch,
  isHighestLayer,
  layerPointerEvents,
  layersVersion,
  pointerEventsEnabled,
  subscribeLayers,
  watchFocusOutside,
  watchPointerDownOutside,
  type FocusOutsideEvent,
  type PointerDownOutsideEvent,
} from '../../../../shared/src/primitives/dismissable-layer'
import { Primitive, type PrimitiveElementProps } from '../../lib/primitive'
import { useCallbackRef } from '../utils/callback-ref'
import { composeEventHandlers } from '../utils/compose-event-handlers'
import { useComposedRefs } from '../utils/compose-refs'

export type { FocusOutsideEvent, PointerDownOutsideEvent }

export interface DismissableLayerProps extends PrimitiveElementProps {
  disableOutsidePointerEvents?: boolean
  onEscapeKeyDown?: (event: KeyboardEvent) => void
  onPointerDownOutside?: (event: PointerDownOutsideEvent) => void
  onFocusOutside?: (event: FocusOutsideEvent) => void
  onInteractOutside?: (event: PointerDownOutsideEvent | FocusOutsideEvent) => void
  onDismiss?: () => void
}

const settle = () => Promise.resolve().then(() => undefined)

export function DismissableLayer({
  disableOutsidePointerEvents = false,
  onEscapeKeyDown,
  onPointerDownOutside,
  onFocusOutside,
  onInteractOutside,
  onDismiss,
  onFocusCapture,
  onBlurCapture,
  onPointerDownCapture,
  style,
  ref,
  ...props
}: DismissableLayerProps) {
  const [node, setNode] = useState<HTMLElement | null>(null)
  const composedRef = useComposedRefs(ref, setNode)
  useSyncExternalStore(subscribeLayers, layersVersion, layersVersion)
  const escape = useCallbackRef(onEscapeKeyDown)
  const pointerDown = useCallbackRef(onPointerDownOutside)
  const focusOut = useCallbackRef(onFocusOutside)
  const interact = useCallbackRef(onInteractOutside)
  const dismiss = useCallbackRef(onDismiss)
  const watchers = useRef<{
    pointer?: ReturnType<typeof watchPointerDownOutside>
    focus?: ReturnType<typeof watchFocusOutside>
  }>({})

  useEffect(() => (node ? addLayer(node) : undefined), [node])

  useEffect(() => {
    if (!node || !disableOutsidePointerEvents) return
    return blockOutsidePointerEvents(node)
  }, [node, disableOutsidePointerEvents])

  useEffect(() => {
    if (!node) return
    const pointer = watchPointerDownOutside({
      element: () => node,
      onOutside: event => {
        if (inBranch(event.target) || !pointerEventsEnabled(node)) return
        pointerDown(event)
        interact(event)
        if (!event.defaultPrevented) dismiss()
      },
    })
    const focus = watchFocusOutside({
      element: () => node,
      settle,
      onOutside: event => {
        if (inBranch(event.target)) return
        focusOut(event)
        interact(event)
        if (!event.defaultPrevented) dismiss()
      },
    })
    watchers.current = { pointer, focus }
    return () => {
      pointer.stop()
      focus.stop()
      watchers.current = {}
    }
  }, [node, pointerDown, focusOut, interact, dismiss])

  useEffect(() => {
    if (!node) return
    const view = node.ownerDocument.defaultView ?? window
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || !isHighestLayer(node)) return
      escape(event)
      if (!event.defaultPrevented) dismiss()
    }
    view.addEventListener('keydown', handleKeyDown)
    return () => view.removeEventListener('keydown', handleKeyDown)
  }, [node, escape, dismiss])

  return (
    <Primitive
      {...props}
      data-dismissable-layer=""
      ref={composedRef}
      style={{ pointerEvents: layerPointerEvents(node), ...style } as CSSProperties}
      onFocusCapture={composeEventHandlers(onFocusCapture, () =>
        watchers.current.focus?.onFocusCapture(),
      )}
      onBlurCapture={composeEventHandlers(onBlurCapture, () =>
        watchers.current.focus?.onBlurCapture(),
      )}
      onPointerDownCapture={composeEventHandlers(onPointerDownCapture, () =>
        watchers.current.pointer?.onPointerDownCapture(),
      )}
    />
  )
}

export function DismissableLayerBranch({ ref, ...props }: PrimitiveElementProps) {
  const [node, setNode] = useState<HTMLElement | null>(null)
  const composedRef = useComposedRefs(ref, setNode)
  useEffect(() => (node ? addBranch(node) : undefined), [node])
  return <Primitive {...props} ref={composedRef} />
}
