'use client'

import { useLayoutEffect, useRef, type RefObject } from 'react'
import { useServerRender } from './hidden-input'

export function useBoundValue(
  element: RefObject<HTMLInputElement | null>,
  value: string | number | null | undefined,
) {
  const server = useServerRender()
  const last = useRef<{ value: unknown } | null>(null)

  useLayoutEffect(() => {
    const input = element.current
    if (!input) return
    const previous = last.current
    last.current = { value }
    if (previous && Object.is(previous.value, value)) return
    const next = value == null ? '' : String(value)
    if (!previous || input.value !== next) input.value = next
    if (value == null) input.removeAttribute('value')
    else input.setAttribute('value', next)
  })

  return server && value != null ? { defaultValue: String(value) } : {}
}
