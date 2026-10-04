'use client'

import { useEffect, useState } from 'react'

function seconds(open: boolean, delay: number) {
  if (!open) return undefined
  const value = Math.ceil(delay)
  return Number.isFinite(value) && value > 0 ? value : 0
}

export function useConfirmDelay(open: boolean, delay: number) {
  const [remaining, setRemaining] = useState(() => seconds(open, delay) ?? 0)
  const [key, setKey] = useState({ open, delay })

  if (key.open !== open || !Object.is(key.delay, delay)) {
    setKey({ open, delay })
    const next = seconds(open, delay)
    if (next !== undefined) setRemaining(next)
  }

  useEffect(() => {
    const total = seconds(open, delay)
    if (!total) return
    let timer: ReturnType<typeof setTimeout> | undefined
    const deadline = performance.now() + total * 1000
    function tick() {
      const milliseconds = deadline - performance.now()
      const value = Math.max(0, Math.ceil(milliseconds / 1000))
      setRemaining(value)
      timer = value > 0 ? setTimeout(tick, Math.min(1000, milliseconds)) : undefined
    }
    tick()
    return () => clearTimeout(timer)
  }, [open, delay])

  return remaining
}
