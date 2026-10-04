'use client'

import { useEffect, useRef } from 'react'
import { matchesHotkey, parseHotkey } from '../utils/hotkey'

export function useHotkey(spec: string | undefined, handler: () => void) {
  const latest = useRef(handler)
  latest.current = handler

  useEffect(() => {
    if (!spec) return
    const hotkey = parseHotkey(spec)
    const listener = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.repeat) return
      if (!matchesHotkey(event, hotkey)) return
      event.preventDefault()
      latest.current()
    }
    window.addEventListener('keydown', listener)
    return () => window.removeEventListener('keydown', listener)
  }, [spec])
}
