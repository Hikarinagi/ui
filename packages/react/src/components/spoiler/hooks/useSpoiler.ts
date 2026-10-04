'use client'

import { useLayoutEffect, useRef, useState, type RefObject } from 'react'
import {
  isPaintWorkletSupported,
  SpoilerPainter,
} from '../../../../../shared/src/behavior/spoiler/painter'

const ACCENT_LIGHT = '0 0% 20%'
const ACCENT_DARK = '0 0% 100%'

export function useSpoiler(
  host: RefObject<HTMLElement | null>,
  hidden: boolean,
  forceFallback: boolean,
) {
  const [usesFallback, setUsesFallback] = useState(true)
  const painter = useRef<SpoilerPainter | undefined>(undefined)
  const force = useRef(forceFallback)
  force.current = forceFallback

  useLayoutEffect(() => {
    const fallback = !isPaintWorkletSupported || force.current
    setUsesFallback(fallback)
    const el = host.current
    if (fallback || !el) return

    let isDark = false
    const accent = () => (isDark ? ACCENT_DARK : ACCENT_LIGHT)
    const readTheme = () => {
      const next = document.documentElement.classList.contains('dark')
      if (next === isDark) return
      isDark = next
      painter.current?.update({ accent: accent() })
    }
    readTheme()
    const themeObserver = new MutationObserver(readTheme)
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    painter.current = new SpoilerPainter(el, { accent: accent() })

    const resizeObserver = new ResizeObserver(() => {
      painter.current?.update({ accent: accent() })
    })
    resizeObserver.observe(el)

    return () => {
      painter.current?.destroy()
      painter.current = undefined
      themeObserver.disconnect()
      resizeObserver.disconnect()
    }
  }, [host])

  useLayoutEffect(() => {
    const instance = painter.current
    if (!instance) return
    if (hidden !== instance.isHidden) {
      if (hidden) {
        instance.hide()
      } else {
        instance.reveal()
      }
    }
  }, [hidden])

  return usesFallback
}
