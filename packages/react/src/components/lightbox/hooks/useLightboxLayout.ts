'use client'

import { useEffect } from 'react'
import type { LightboxItem } from '../types'
import type { LightboxFrames } from './useLightboxFrames'
import type { LightboxLarge } from './useLightboxLarge'
import type { LightboxPhaseController } from './useLightboxPhase'
import type { LightboxZoom } from './useLightboxZoom'
import { useLatest } from './useLatest'

export function useLightboxLayout(options: {
  stage: HTMLElement | null
  current: () => LightboxItem | undefined
  frames: LightboxFrames
  large: LightboxLarge
  phase: LightboxPhaseController
  zoom: LightboxZoom
  measure: () => void
}) {
  const latest = useLatest(options)

  function sync() {
    const { phase, zoom, measure, frames, current, large } = latest.current
    if (phase.current() !== 'open') return
    zoom.reflow(() => {
      measure()
      frames.learnPreview(current(), large.image)
    })
  }

  function learn(id: string, img: HTMLImageElement) {
    const { phase, zoom, frames, current } = latest.current
    const update = () => frames.learn(id, img)
    if (phase.current() === 'open' && current()?.id === id) zoom.reflow(update)
    else update()
  }

  const phase = options.phase.current()
  const current = options.current()
  const image = options.large.image

  useEffect(sync, [phase, current, image])

  const stage = options.stage
  useEffect(() => {
    if (!stage || typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(sync)
    observer.observe(stage)
    const chrome = stage.querySelector<HTMLElement>('[data-hn-chrome]')
    if (chrome) observer.observe(chrome)
    return () => observer.disconnect()
  }, [stage])

  return { learn }
}
