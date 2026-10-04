'use client'

import { useEffect, useRef, useState, type PointerEvent } from 'react'

export function useSliderChrome(disabled: boolean, label: 'auto' | 'always' | 'none') {
  const [dragging, setDragging] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [ring, setRing] = useState(false)
  const pointer = useRef(false)

  const labelOpen = label === 'always' || (!disabled && (hovered || ring || dragging))

  useEffect(() => {
    const release = () => setDragging(false)
    window.addEventListener('pointerup', release, { passive: true })
    window.addEventListener('pointercancel', release, { passive: true })
    return () => {
      window.removeEventListener('pointerup', release)
      window.removeEventListener('pointercancel', release)
    }
  }, [])

  function onPointerDown(event: PointerEvent<HTMLElement>) {
    pointer.current = true
    if (disabled) return
    const root = event.currentTarget
    if (!root.firstElementChild?.contains(event.target as Node)) return
    setDragging(true)
  }

  function onFocusIn() {
    setRing(!pointer.current)
    pointer.current = false
  }

  const listeners = {
    onKeyDown: () => setRing(true),
    onFocus: onFocusIn,
    onBlur: () => setRing(false),
    onPointerEnter: (event: PointerEvent<HTMLElement>) => setHovered(event.pointerType === 'mouse'),
    onPointerLeave: () => setHovered(false),
  }

  return { dragging, hovered, ring, labelOpen, onPointerDown, listeners }
}
