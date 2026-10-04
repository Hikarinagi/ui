'use client'

import { useEffect, useRef, type RefObject } from 'react'
import { irisOrigin } from '../../../../../shared/src/lib/iris-origin'

export function useReveal(
  host: RefObject<HTMLElement | null>,
  hidden: boolean,
  setHidden: (hidden: boolean) => void,
  revealOn: 'click' | 'hover',
) {
  const latest = useRef({ hidden, setHidden })
  latest.current = { hidden, setHidden }

  useEffect(() => {
    const el = host.current
    if (!el) return

    function setOrigin(event?: MouseEvent) {
      if (!el) return
      if (!event || !latest.current.hidden) return

      const origin = irisOrigin([...el.getClientRects()], event.clientX, event.clientY)
      if (!origin) {
        el.style.removeProperty('--hn-iris-x')
        el.style.removeProperty('--hn-iris-y')
        return
      }
      el.style.setProperty('--hn-iris-x', `${origin.x.toFixed(1)}%`)
      el.style.setProperty('--hn-iris-y', `${origin.y.toFixed(1)}%`)
    }

    function toggle(event?: MouseEvent) {
      setOrigin(event)
      latest.current.setHidden(!latest.current.hidden)
    }

    const handlers: Record<string, (event: Event) => void> =
      revealOn === 'hover'
        ? {
            mouseenter: event => {
              setOrigin(event as MouseEvent)
              latest.current.setHidden(false)
            },
            mouseleave: () => latest.current.setHidden(true),
            focus: () => latest.current.setHidden(false),
            blur: () => latest.current.setHidden(true),
          }
        : {
            click: event => toggle(event as MouseEvent),
            keydown: event => {
              const key = (event as KeyboardEvent).key
              if (key === 'Enter' || key === ' ') {
                event.preventDefault()
                toggle()
              }
            },
          }

    for (const [name, handler] of Object.entries(handlers)) el.addEventListener(name, handler)
    return () => {
      for (const [name, handler] of Object.entries(handlers)) el.removeEventListener(name, handler)
    }
  }, [host, revealOn])
}
