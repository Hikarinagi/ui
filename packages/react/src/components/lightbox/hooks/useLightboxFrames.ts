'use client'

import { useEffect, useState } from 'react'
import type { LightboxItem } from '../types'
import { fitRect, type Rect } from '../../../../../shared/src/lib/lightbox/pose'
import type { Size } from '../../../../../shared/src/lib/lightbox/zoom'
import { useLatest, useRerender } from './useLatest'

function previewSizeOf(item: LightboxItem | undefined): Size | undefined {
  const size = item?.previewSize
  if (
    size &&
    Number.isFinite(size.width) &&
    size.width > 0 &&
    Number.isFinite(size.height) &&
    size.height > 0
  )
    return size
}

export function createLightboxFrames(items: () => LightboxItem[], notify: () => void) {
  const state = {
    stage: { width: 0, height: 0 } as Size,
    area: { x: 0, y: 0, width: 0, height: 0 } as Rect,
  }
  const naturals = new Map<string, Size & { src: string }>()
  const previews = new Map<string, Size & { src: string; preview: string }>()
  let loader: HTMLImageElement | undefined

  function measure(el: HTMLElement | null | undefined) {
    if (!el) return
    const width = el.clientWidth
    const height = el.clientHeight
    const style = getComputedStyle(el)
    const rect = el.getBoundingClientRect()
    const chrome = el.querySelector('[data-hn-chrome]')?.getBoundingClientRect()
    const close = el.querySelector('[data-hn-close]')?.getBoundingClientRect()
    const x = Math.min(
      width / 2,
      Math.max(parseFloat(style.paddingLeft), parseFloat(style.paddingRight)),
    )
    const y = Math.min(
      height / 2,
      Math.max(
        parseFloat(style.paddingTop) + (close ? close.bottom - rect.top : 0),
        parseFloat(style.paddingBottom) + (chrome ? rect.bottom - chrome.top : 0),
      ),
    )
    state.stage = { width, height }
    state.area = { x, y, width: width - x * 2, height: height - y * 2 }
    notify()
  }

  function read(current?: () => LightboxItem | undefined): Promise<void> | undefined {
    loader?.removeAttribute('src')
    loader = undefined
    for (const item of items()) {
      const el = item.source?.()
      if (
        el &&
        'naturalWidth' in el &&
        el.naturalWidth &&
        el.naturalHeight &&
        !el.srcset &&
        (el.currentSrc || el.src) === new URL(item.src, el.ownerDocument.baseURI).href
      ) {
        naturals.set(item.id, { src: item.src, width: el.naturalWidth, height: el.naturalHeight })
        notify()
      }
    }
    const item = current?.()
    if (!item || previewSizeOf(item) || naturalOf(item)) return
    const img = new Image()
    loader = img
    const { id, src } = item
    img.src = src
    return img
      .decode()
      .catch(() => {})
      .then(() => {
        if (loader !== img) return
        learn(id, img)
        loader = undefined
        const latest = current?.()
        if (latest?.id !== id || latest?.src !== src) return read(current)
      })
  }

  function learn(id: string, img: HTMLImageElement) {
    const item = items().find(item => item.id === id)
    if (
      !item ||
      naturalOf(item) ||
      !img.naturalWidth ||
      !img.naturalHeight ||
      img.src !== new URL(item.src, img.ownerDocument.baseURI).href
    ) {
      return
    }
    naturals.set(id, { src: item.src, width: img.naturalWidth, height: img.naturalHeight })
    notify()
  }

  function naturalOf(item: LightboxItem | undefined): Size | undefined {
    if (!item) return
    const natural = naturals.get(item.id)
    return natural?.src === item.src ? natural : undefined
  }

  function learnPreview(item: LightboxItem | undefined, img: HTMLImageElement | undefined) {
    if (!item?.preview || !img?.naturalWidth || !img.naturalHeight) return
    if (img.src !== new URL(item.preview, img.ownerDocument.baseURI).href) return
    const previous = previews.get(item.id)
    if (previous?.src === item.src && previous.preview === item.preview) return
    previews.set(item.id, {
      src: item.src,
      preview: item.preview,
      width: img.naturalWidth,
      height: img.naturalHeight,
    })
    notify()
  }

  function displayOf(item: LightboxItem | undefined): Size | undefined {
    if (!item) return
    const size = previewSizeOf(item)
    if (size) return size
    const preview = previews.get(item.id)
    return preview?.src === item.src && preview.preview === item.preview ? preview : naturalOf(item)
  }

  function frameOf(item: LightboxItem | undefined): Rect {
    const natural = displayOf(item)
    return natural ? fitRect(natural, state.area) : state.area
  }

  function dispose() {
    loader?.removeAttribute('src')
    loader = undefined
  }

  return {
    get stage() {
      return state.stage
    },
    get area() {
      return state.area
    },
    measure,
    read,
    learn,
    learnPreview,
    naturalOf,
    displayOf,
    frameOf,
    dispose,
  }
}

export type LightboxFrames = ReturnType<typeof createLightboxFrames>

export function useLightboxFrames(items: () => LightboxItem[]) {
  const rerender = useRerender()
  const latest = useLatest({ items, rerender })
  const [frames] = useState(() =>
    createLightboxFrames(
      () => latest.current.items(),
      () => latest.current.rerender(),
    ),
  )
  useEffect(() => frames.dispose, [frames])
  return frames
}
