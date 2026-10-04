'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

function subscribeReducedMotion(callback: () => void) {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return () => {}
  const query = window.matchMedia(REDUCED_MOTION)
  query.addEventListener('change', callback)
  return () => query.removeEventListener('change', callback)
}

function reducedMotionSnapshot() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false
  return window.matchMedia(REDUCED_MOTION).matches
}

function subscribeVisibility(callback: () => void) {
  if (typeof document === 'undefined') return () => {}
  document.addEventListener('visibilitychange', callback)
  return () => document.removeEventListener('visibilitychange', callback)
}

function visibilitySnapshot() {
  return typeof document === 'undefined' ? 'visible' : document.visibilityState
}

function serverFalse() {
  return false
}

function serverVisible() {
  return 'visible' as DocumentVisibilityState
}

export function useAutoplay(interval: number | undefined, enabled: boolean, tick: () => void) {
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const visibility = useSyncExternalStore(subscribeVisibility, visibilitySnapshot, serverVisible)
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    reducedMotionSnapshot,
    serverFalse,
  )
  const latest = useRef(tick)

  useEffect(() => {
    latest.current = tick
  })

  const delay = interval ?? 0
  const active =
    enabled && delay > 0 && !hovered && !focused && visibility !== 'hidden' && !reducedMotion

  useEffect(() => {
    if (!active) return
    const handle = setInterval(() => latest.current(), delay)
    return () => clearInterval(handle)
  }, [active, delay])

  return { hovered, focused, active, setHovered, setFocused }
}
