'use client'

import { useEffect, useState } from 'react'
import type { LightboxItem } from '../types'
import { useLatest, useRerender } from './useLatest'

export const LARGE_HINT_DELAY_MS = 800

function createLightboxLarge(notify: () => void) {
  const state = {
    src: undefined as string | undefined,
    ready: false,
    image: undefined as HTMLImageElement | undefined,
    waiting: false,
  }
  let loader: HTMLImageElement | null = null
  let timer: ReturnType<typeof setTimeout> | null = null

  function assign(next: Partial<typeof state>) {
    let changed = false
    for (const key of Object.keys(next) as (keyof typeof state)[]) {
      if (state[key] === next[key]) continue
      Object.assign(state, { [key]: next[key] })
      changed = true
    }
    if (changed) notify()
  }

  function reset() {
    if (loader) loader.src = ''
    loader = null
    if (timer) clearTimeout(timer)
    timer = null
    assign({ src: undefined, ready: false, image: undefined, waiting: false })
  }

  function load(target: LightboxItem) {
    const url = target.preview
    if (!url || url === target.src) return
    assign({ src: url })
    const img = new Image()
    loader = img
    img.decoding = 'async'
    img.src = url
    timer = setTimeout(() => {
      if (loader === img && !state.ready) assign({ waiting: true })
    }, LARGE_HINT_DELAY_MS)
    const done = () => {
      if (loader !== img) return
      if (timer) clearTimeout(timer)
      timer = null
      assign({ waiting: false, image: img, ready: true })
    }
    const decode = typeof img.decode === 'function' ? img.decode() : Promise.resolve()
    decode.then(done, () => {
      if (loader !== img) return
      if (timer) clearTimeout(timer)
      timer = null
      assign({ waiting: false })
    })
  }

  return { state, reset, load }
}

export interface LightboxLarge {
  src: string | undefined
  ready: boolean
  waiting: boolean
  image: HTMLImageElement | undefined
}

export function useLightboxLarge(item: LightboxItem | undefined, active: boolean): LightboxLarge {
  const rerender = useRerender()
  const latest = useLatest(rerender)
  const [large] = useState(() => createLightboxLarge(() => latest.current()))
  const target = active ? item : undefined

  useEffect(() => {
    large.reset()
    if (target) large.load(target)
  }, [large, target])

  useEffect(() => large.reset, [large])

  return {
    src: large.state.src,
    ready: large.state.ready,
    waiting: large.state.waiting,
    image: large.state.image,
  }
}
