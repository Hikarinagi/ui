'use client'

import { useSyncExternalStore } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

function subscribe(callback: () => void) {
  if (typeof window === 'undefined' || !('matchMedia' in window)) return () => {}
  const query = window.matchMedia(QUERY)
  query.addEventListener('change', callback)
  return () => query.removeEventListener('change', callback)
}

function snapshot() {
  return typeof window !== 'undefined' && 'matchMedia' in window && window.matchMedia(QUERY).matches
}

export function usePreferredReducedMotion() {
  return useSyncExternalStore(subscribe, snapshot, () => false) ? 'reduce' : 'no-preference'
}
