'use client'

import {
  useLayoutEffect,
  useRef,
  useSyncExternalStore,
  type ChangeEvent,
  type CompositionEvent,
  type RefObject,
} from 'react'

type TextControl = HTMLInputElement | HTMLTextAreaElement

const subscribe = () => () => {}

interface Handlers<T extends TextControl> {
  onChange?: (event: ChangeEvent<T>) => void
  onCompositionStart?: (event: CompositionEvent<T>) => void
  onCompositionEnd?: (event: CompositionEvent<T>) => void
}

export function useModelText<T extends TextControl>(
  model: string | undefined,
  setModel: (value: string) => void,
  handlers: Handlers<T> = {},
): {
  element: RefObject<T | null>
  bindings: Required<Handlers<T>> & { defaultValue: string | undefined }
} {
  const element = useRef<T | null>(null)
  const composing = useRef(false)
  const server = useSyncExternalStore(
    subscribe,
    () => false,
    () => true,
  )

  useLayoutEffect(() => {
    const node = element.current
    if (!node) return
    const next = model ?? ''
    if (node.value !== next) node.value = next
  }, [model, server])

  return {
    element,
    bindings: {
      defaultValue: server ? model : undefined,
      onChange: event => {
        if (!composing.current) setModel(event.target.value)
        handlers.onChange?.(event)
      },
      onCompositionStart: event => {
        composing.current = true
        handlers.onCompositionStart?.(event)
      },
      onCompositionEnd: event => {
        if (composing.current) {
          composing.current = false
          setModel(event.currentTarget.value)
        }
        handlers.onCompositionEnd?.(event)
      },
    },
  }
}
