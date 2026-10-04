'use client'

import { useEffect, useRef } from 'react'

function fullPath() {
  return `${location.pathname}${location.search}${location.hash}`
}

export function useLocationChange(onChange: () => void) {
  const latest = useRef(onChange)
  latest.current = onChange

  useEffect(() => {
    let current = fullPath()
    let active = true
    const compare = () => {
      const next = fullPath()
      if (!active || next === current) return
      current = next
      latest.current()
    }
    const check = () => queueMicrotask(compare)
    const navigation = (window as Window & { navigation?: EventTarget }).navigation
    navigation?.addEventListener('currententrychange', check)
    window.addEventListener('popstate', check)
    window.addEventListener('hashchange', check)
    return () => {
      active = false
      navigation?.removeEventListener('currententrychange', check)
      window.removeEventListener('popstate', check)
      window.removeEventListener('hashchange', check)
    }
  }, [])
}
