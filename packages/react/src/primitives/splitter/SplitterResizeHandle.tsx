'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import type { CSSProperties, FocusEvent, HTMLAttributes, ReactNode, Ref } from 'react'
import { useComposedRefs } from 'radix-ui/internal'
import { Primitive, type PrimitiveProps } from '../../lib/primitive'
import { usePanelGroupContext } from './context'
import { assert } from './utils/assert'
import {
  getResizeHandleElement,
  getResizeHandleElementIndex,
  getResizeHandleElementsForGroup,
} from './utils/dom'
import { registerResizeHandle } from './utils/registry'
import type {
  PointerHitAreaMargins,
  ResizeEvent,
  ResizeHandlerAction,
  ResizeHandlerState,
} from './utils/types'

const isBrowser = typeof document !== 'undefined'

export interface SplitterResizeHandleProps extends PrimitiveProps, HTMLAttributes<HTMLElement> {
  id?: string
  hitAreaMargins?: PointerHitAreaMargins
  tabIndex?: number
  disabled?: boolean
  nonce?: string
  onDragging?: (isDragging: boolean) => void
  children?: ReactNode
  ref?: Ref<HTMLElement>
}

export function SplitterResizeHandle({
  id,
  hitAreaMargins,
  tabIndex = 0,
  disabled = false,
  nonce,
  onDragging,
  as,
  asChild,
  style,
  onBlur,
  onFocus,
  children,
  ref,
  ...attrs
}: SplitterResizeHandleProps) {
  const { api, direction, groupId, panelGroupElement } = usePanelGroupContext('PanelResizeHandle')
  const element = useRef<HTMLElement>(null)
  const composedRef = useComposedRefs(ref, element)
  const generatedId = useId()
  const resizeHandleId = id || `reka-splitter-resize-handle-${generatedId}`
  const [state, setState] = useState<ResizeHandlerState>('inactive')
  const [isFocused, setIsFocused] = useState(false)
  const latest = useRef({ state, direction, nonce, onDragging, api })
  latest.current = { state, direction, nonce, onDragging, api }

  const resizeHandler = useMemo(
    () => (!isBrowser || disabled ? null : api.registerResizeHandle(resizeHandleId)),
    [api, disabled, resizeHandleId],
  )

  const coarse = hitAreaMargins?.coarse ?? 15
  const fine = hitAreaMargins?.fine ?? 5
  useEffect(() => {
    if (disabled || resizeHandler === null) return
    const el = element.current
    if (!el) return
    assert(el)
    const update = (value: ResizeHandlerState) => {
      latest.current.state = value
      setState(value)
    }
    const setResizeHandlerState = (
      action: ResizeHandlerAction,
      isActive: boolean,
      event: ResizeEvent,
    ) => {
      if (isActive) {
        switch (action) {
          case 'down': {
            update('drag')
            latest.current.api.startDragging(resizeHandleId, event)
            latest.current.onDragging?.(true)
            break
          }
          case 'move': {
            if (latest.current.state !== 'drag') update('hover')
            resizeHandler?.(event)
            break
          }
          case 'up': {
            update('hover')
            latest.current.api.stopDragging()
            latest.current.onDragging?.(false)
            break
          }
        }
      } else {
        update('inactive')
      }
    }
    return registerResizeHandle(
      resizeHandleId,
      el,
      () => latest.current.direction,
      { coarse, fine },
      () => latest.current.nonce,
      setResizeHandlerState,
    )
  }, [disabled, resizeHandler, resizeHandleId, coarse, fine])

  useEffect(() => {
    const groupElement = panelGroupElement.current
    if (disabled || resizeHandler === null || groupElement === null) return
    const handleElement = getResizeHandleElement(resizeHandleId, groupElement)
    if (handleElement == null) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return
      switch (event.key) {
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight':
        case 'ArrowUp':
        case 'End':
        case 'Home': {
          event.preventDefault()
          resizeHandler?.(event)
          break
        }
        case 'F6': {
          event.preventDefault()
          const handleGroupId = handleElement.getAttribute('data-panel-group-id')
          assert(handleGroupId)
          const handles = getResizeHandleElementsForGroup(handleGroupId, groupElement)
          const index = getResizeHandleElementIndex(handleGroupId, resizeHandleId, groupElement)
          assert(index !== null)
          const nextIndex = event.shiftKey
            ? index > 0
              ? index - 1
              : handles.length - 1
            : index + 1 < handles.length
              ? index + 1
              : 0
          const nextHandle = handles[nextIndex] as HTMLElement
          nextHandle.focus()
          break
        }
      }
    }
    handleElement.addEventListener('keydown', onKeyDown)
    return () => {
      handleElement.removeEventListener('keydown', onKeyDown)
    }
  }, [disabled, resizeHandler, resizeHandleId, panelGroupElement])

  return (
    <Primitive
      id={resizeHandleId}
      ref={composedRef}
      as={as}
      asChild={asChild}
      role="separator"
      data-resize-handle=""
      tabIndex={tabIndex}
      data-state={state}
      data-disabled={disabled ? '' : undefined}
      data-orientation={direction}
      data-panel-group-id={groupId}
      data-resize-handle-active={state === 'drag' ? 'pointer' : isFocused ? 'keyboard' : undefined}
      data-resize-handle-state={state}
      data-panel-resize-handle-enabled={!disabled}
      data-panel-resize-handle-id={resizeHandleId}
      {...attrs}
      style={{ touchAction: 'none', userSelect: 'none', ...style } as CSSProperties}
      onBlur={(event: FocusEvent<HTMLElement>) => {
        setIsFocused(false)
        onBlur?.(event)
      }}
      onFocus={(event: FocusEvent<HTMLElement>) => {
        setIsFocused(false)
        onFocus?.(event)
      }}
    >
      {children}
    </Primitive>
  )
}
