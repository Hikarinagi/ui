'use client'

import { useSyncExternalStore } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

function subscribe(callback: () => void) {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return () => {}
  const query = window.matchMedia(QUERY)
  query.addEventListener('change', callback)
  return () => query.removeEventListener('change', callback)
}

function snapshot() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function')
    return 'no-preference'
  return window.matchMedia(QUERY).matches ? 'reduce' : 'no-preference'
}

function serverSnapshot() {
  return 'no-preference' as const
}

export function usePreferredReducedMotion() {
  return useSyncExternalStore(subscribe, snapshot, serverSnapshot) as 'reduce' | 'no-preference'
}
