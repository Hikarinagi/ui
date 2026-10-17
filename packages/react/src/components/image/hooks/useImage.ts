'use client'

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { cssTimeToMs } from '../../../../../shared/src/lib/css-time'
import { thumbhashToDataUrl } from '../../../../../shared/src/lib/thumbhash'
import { useImageResolver } from '../resolver'

function ready(img: HTMLImageElement): Promise<void> {
  if (typeof img.decode === 'function') return img.decode()
  if (img.complete) {
    return img.naturalWidth > 0 ? Promise.resolve() : Promise.reject(new Error('image failed'))
  }
  return new Promise((res, rej) => {
    img.addEventListener('load', () => res(), { once: true })
    img.addEventListener('error', () => rej(new Error('image failed')), { once: true })
  })
}

function play(el: HTMLElement, duration: string, easing: string): Animation | null {
  const style = getComputedStyle(el)
  try {
    return el.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: cssTimeToMs(style.getPropertyValue(duration)),
      easing: style.getPropertyValue(easing).trim() || 'linear',
      fill: 'forwards',
    })
  } catch {
    return null
  }
}

function afterPaint() {
  return new Promise<void>(res => requestAnimationFrame(() => requestAnimationFrame(() => res())))
}

export function useImage(
  props: {
    src?: string
    fallback?: string
    thumbhash?: string
    lazy: boolean
    rootMargin: string
    skeleton: boolean
  },
  emit: {
    load?: (size: { width: number; height: number }) => void
    error?: () => void
  },
) {
  const resolve = useImageResolver()

  const [rootEl, setRootEl] = useState<HTMLElement | null>(null)
  const [imageEl, setImageEl] = useState<HTMLImageElement | null>(null)
  const skeletonEl = useRef<HTMLElement | null>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)
  const [entered, setEntered] = useState(!props.lazy)
  const [usingFallback, setUsingFallback] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [skeletonMounted, setSkeletonMounted] = useState(true)
  const [failed, setFailed] = useState(false)
  const fade = useRef<Animation | null>(null)
  const [options] = useState(() => ({ lazy: props.lazy, rootMargin: props.rootMargin }))

  const primary = useMemo(
    () => (props.src ? resolve(props.src, 'image') : ''),
    [props.src, resolve],
  )
  const fallbackSource = props.fallback
  const resolveFallback = useCallback(
    () => (fallbackSource ? resolve(fallbackSource, 'image') : ''),
    [fallbackSource, resolve],
  )

  const [seenPrimary, setSeenPrimary] = useState(primary)
  if (seenPrimary !== primary) {
    setSeenPrimary(primary)
    setUsingFallback(false)
  }

  const fallback = useMemo(
    () => (usingFallback ? resolveFallback() : ''),
    [usingFallback, resolveFallback],
  )
  const resolved = usingFallback ? fallback : primary

  const [seenResolved, setSeenResolved] = useState(resolved)
  if (seenResolved !== resolved) {
    setSeenResolved(resolved)
    setRevealed(false)
    setSkeletonMounted(true)
    setFailed(false)
  }

  const thumbhash = props.thumbhash
  const placeholder = useMemo(() => (thumbhash ? thumbhashToDataUrl(thumbhash) : null), [thumbhash])

  const src = entered ? resolved || undefined : undefined
  const showImage = Boolean(resolved) && !failed
  const showSkeleton = (props.skeleton || !!placeholder) && showImage && skeletonMounted

  const latest = useRef({
    src,
    usingFallback,
    resolveFallback,
    placeholder,
    lazy: props.lazy,
    emit,
  })
  latest.current = { src, usingFallback, resolveFallback, placeholder, lazy: props.lazy, emit }

  useLayoutEffect(() => {
    fade.current?.cancel()
    fade.current = null
  }, [resolved])

  useEffect(() => {
    if (!options.lazy || entered || !rootEl) return
    if (typeof IntersectionObserver === 'undefined') {
      setEntered(true)
      return
    }
    const observer = new IntersectionObserver(
      entries => {
        if (!entries.some(entry => entry.isIntersecting)) return
        setEntered(true)
        observer.disconnect()
      },
      { rootMargin: options.rootMargin },
    )
    observer.observe(rootEl)
    return () => observer.disconnect()
  }, [rootEl, entered, options])

  function dropLayer() {
    const layer = skeletonEl.current
    const anim =
      layer &&
      (latest.current.placeholder
        ? play(layer, '--hn-duration-slow', '--hn-ease-move')
        : play(layer, '--hn-duration-fast', '--hn-ease-enter'))
    if (!anim) {
      setSkeletonMounted(false)
      return
    }

    fade.current = anim
    anim.finished.then(
      () => {
        if (fade.current === anim) setSkeletonMounted(false)
      },
      () => {},
    )
  }

  async function reveal() {
    if (!latest.current.lazy) {
      if (latest.current.placeholder) {
        flushSync(() => setRevealed(true))
        dropLayer()
      } else {
        setRevealed(true)
        setSkeletonMounted(false)
      }
      return
    }

    const img = imageRef.current
    const at = latest.current.src
    await afterPaint()
    if (imageRef.current !== img || latest.current.src !== at) return

    flushSync(() => setRevealed(true))
    dropLayer()
  }

  function fail() {
    if (!latest.current.usingFallback && latest.current.resolveFallback()) {
      setUsingFallback(true)
      latest.current.usingFallback = true
      return
    }
    setFailed(true)
    latest.current.emit.error?.()
  }

  useEffect(() => {
    const img = imageEl
    if (!img || !src) return
    const at = src
    let active = true
    ready(img).then(
      () => {
        if (!active || latest.current.src !== at) return
        latest.current.emit.load?.({ width: img.naturalWidth, height: img.naturalHeight })
        void reveal()
      },
      () => {
        if (active && latest.current.src === at) fail()
      },
    )
    return () => {
      active = false
    }
  }, [imageEl, src])

  const imageCallback = useCallback((el: HTMLImageElement | null) => {
    imageRef.current = el
    setImageEl(el)
  }, [])

  return {
    rootRef: setRootEl,
    imageRef: imageCallback,
    imageEl: imageRef,
    skeletonRef: skeletonEl,
    src,
    placeholder,
    revealed,
    failed,
    showImage,
    showSkeleton,
  }
}
