'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export const COPIED_RESET_MS = 2000

export function useCopy(
  text: () => string,
  onCopied?: (value: string) => void,
  resetAfter: () => number = () => COPIED_RESET_MS,
) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const latest = useRef({ text, onCopied, resetAfter })
  latest.current = { text, onCopied, resetAfter }

  const copy = useCallback(async () => {
    const value = latest.current.text()
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      return
    }
    setCopied(true)
    latest.current.onCopied?.(value)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      setCopied(false)
    }, latest.current.resetAfter())
  }, [])

  useEffect(() => () => clearTimeout(timer.current), [])

  return { copied, copy }
}
