'use client'

import type { MouseEvent, RefObject } from 'react'

export function useSegmentFocus(host: RefObject<HTMLElement | null>) {
  function segments() {
    return Array.from(
      host.current?.querySelectorAll<HTMLElement>('[data-hn-segment]:not([aria-hidden="true"])') ??
        [],
    )
  }

  function focus() {
    const all = segments()
    ;(all.find(segment => segment.hasAttribute('data-placeholder')) ?? all[0])?.focus()
  }

  function onHostClick(event: MouseEvent<HTMLElement>) {
    if ((event.target as Element).closest('[data-hn-segment], button')) return
    focus()
  }

  return { focus, onHostClick }
}
