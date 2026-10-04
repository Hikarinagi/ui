'use client'

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'

interface Options {
  enabled: boolean
  open: boolean
  dismiss: () => void
}

const DISTANCE_RATIO = 0.3
const FLICK_VELOCITY = 0.6

interface Controller {
  onPointerDown: (event: ReactPointerEvent) => void
  detach: () => void
  reset: () => void
}

export function useDragToDismiss(panel: () => HTMLElement | null, options: Options) {
  const [dragging, setDragging] = useState(false)
  const [offset, setOffsetState] = useState(0)
  const [wasOpen, setWasOpen] = useState(options.open)
  const latest = useRef({ panel, options })
  latest.current = { panel, options }
  const controller = useRef<Controller | null>(null)

  if (!controller.current) {
    let startY = 0
    let startTime = 0
    let pointerId: number | null = null
    let current = 0

    const setOffset = (value: number) => {
      current = value
      setOffsetState(value)
    }

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerId !== pointerId) return
      setOffset(Math.max(0, event.clientY - startY))
    }

    const detach = () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', finish)
      window.removeEventListener('pointercancel', finish)
      pointerId = null
      setDragging(false)
    }

    function finish(event: PointerEvent) {
      if (event.pointerId !== pointerId) return
      detach()
      const height = latest.current.panel()?.offsetHeight ?? 0
      const elapsed = Math.max(1, performance.now() - startTime)
      const velocity = current / elapsed
      const far = height > 0 && current > height * DISTANCE_RATIO
      if (current > 0 && (far || velocity > FLICK_VELOCITY)) {
        latest.current.options.dismiss()
        return
      }
      setOffset(0)
    }

    controller.current = {
      onPointerDown: event => {
        if (!latest.current.options.enabled || pointerId !== null || event.button !== 0) return
        pointerId = event.pointerId
        startY = event.clientY
        startTime = performance.now()
        setDragging(true)
        window.addEventListener('pointermove', onPointerMove)
        window.addEventListener('pointerup', finish)
        window.addEventListener('pointercancel', finish)
      },
      detach,
      reset: () => setOffset(0),
    }
  }

  if (wasOpen !== options.open) {
    setWasOpen(options.open)
    if (options.open) controller.current.reset()
  }

  useEffect(() => controller.current!.detach, [])

  return { dragging, offset, onPointerDown: controller.current.onPointerDown }
}
