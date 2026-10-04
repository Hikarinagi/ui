'use client'

import { useEffect, useRef, useState } from 'react'
import {
  createFocusScopeAPI,
  dispatchMountAutoFocus,
  dispatchUnmountAutoFocus,
  focusScopesStack,
  getActiveElement,
  handleFocusScopeKeyDown,
  trapFocus,
  type FocusScopeAPI,
} from '../../../../shared/src/primitives/focus-scope'
import { Primitive, type PrimitiveElementProps } from '../../lib/primitive'
import { useCallbackRef } from '../utils/callback-ref'
import { composeEventHandlers } from '../utils/compose-event-handlers'
import { useComposedRefs } from '../utils/compose-refs'

export interface FocusScopeProps extends PrimitiveElementProps {
  loop?: boolean
  trapped?: boolean
  onMountAutoFocus?: (event: Event) => void
  onUnmountAutoFocus?: (event: Event) => void
}

export function FocusScope({
  loop = false,
  trapped = false,
  onMountAutoFocus,
  onUnmountAutoFocus,
  onKeyDown,
  ref,
  ...props
}: FocusScopeProps) {
  const [container, setContainer] = useState<HTMLElement | null>(null)
  const composedRef = useComposedRefs(ref, setContainer)
  const scope = useRef<FocusScopeAPI | null>(null)
  scope.current ??= createFocusScopeAPI()
  const mount = useCallbackRef(onMountAutoFocus)
  const unmount = useCallbackRef(onUnmountAutoFocus)

  useEffect(() => {
    if (!trapped || !container) return
    return trapFocus(container, scope.current!)
  }, [trapped, container])

  useEffect(() => {
    if (!container) return
    const api = scope.current!
    focusScopesStack.add(api)
    const previous = getActiveElement()
    if (!container.contains(previous)) dispatchMountAutoFocus(container, previous, mount)
    return () => dispatchUnmountAutoFocus(container, previous, api, unmount)
  }, [container, mount, unmount])

  return (
    <Primitive
      tabIndex={-1}
      {...props}
      ref={composedRef}
      onKeyDown={composeEventHandlers(onKeyDown, event =>
        handleFocusScopeKeyDown(event, { loop, trapped, scope: scope.current! }),
      )}
    />
  )
}
