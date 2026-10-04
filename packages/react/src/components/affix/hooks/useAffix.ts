'use client'

import { useEffect, useLayoutEffect, useRef, useState, type ElementType } from 'react'

export interface AffixOptions {
  as: ElementType
  position: 'top' | 'bottom'
  offset: number | undefined
  disabled: boolean | undefined
}

interface AffixSettings {
  position: 'top' | 'bottom'
  offset: number
  disabled: boolean | undefined
}

function findScrollport(el: HTMLElement) {
  const view = el.ownerDocument.defaultView!
  let parent = el.parentElement
  while (
    parent &&
    parent !== el.ownerDocument.documentElement &&
    parent !== el.ownerDocument.body
  ) {
    if (/^(auto|scroll|hidden|overlay)$/.test(view.getComputedStyle(parent).overflowY))
      return parent
    parent = parent.parentElement
  }
  return undefined
}

function createAffix(
  element: { readonly current: HTMLElement | null },
  settings: () => AffixSettings,
  onAffixed: (value: boolean) => void,
) {
  let affixed = false
  let mounted = false
  let frame = 0
  let cleanup: (() => void) | undefined
  let scrollport: HTMLElement | undefined

  function setAffixed(value: boolean) {
    if (value === affixed) return
    affixed = value
    onAffixed(value)
  }

  function measure() {
    frame = 0
    const el = element.current
    const view = el?.ownerDocument.defaultView
    const { position, offset, disabled } = settings()
    if (!el || !view || disabled || !el.getClientRects().length) {
      setAffixed(false)
      return
    }
    if (findScrollport(el) !== scrollport) {
      connect()
      return
    }
    const box = el.getBoundingClientRect()
    const port = scrollport?.getBoundingClientRect()
    const scale = scrollport?.offsetHeight ? port!.height / scrollport.offsetHeight : 1
    const top = port ? port.top + scrollport!.clientTop * scale : 0
    const height = scrollport
      ? scrollport.clientHeight * scale
      : el.ownerDocument.documentElement.clientHeight
    const edge = position === 'bottom' ? top + height - offset * scale : top + offset * scale
    const actual = position === 'bottom' ? box.bottom : box.top
    setAffixed(
      box.width > 0 &&
        box.height > 0 &&
        height > 0 &&
        view.getComputedStyle(el).position === 'sticky' &&
        Math.abs(actual - edge) < 1,
    )
  }

  function update() {
    const view = element.current?.ownerDocument.defaultView
    if (mounted && view && !frame) frame = view.requestAnimationFrame(measure)
  }

  function connect() {
    cleanup?.()
    cleanup = undefined
    scrollport = undefined
    const el = element.current
    const view = el?.ownerDocument.defaultView
    if (!mounted || !el || !view) return
    const { position, offset, disabled } = settings()
    if (disabled) {
      setAffixed(false)
      return
    }
    scrollport = findScrollport(el)
    const resize = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(update)
    resize?.observe(el)
    if (el.parentElement) resize?.observe(el.parentElement)
    if (scrollport && scrollport !== el.parentElement) resize?.observe(scrollport)
    const margin = `${-(Math.max(0, offset) + 1)}px`
    const intersection =
      typeof IntersectionObserver === 'undefined'
        ? undefined
        : new IntersectionObserver(update, {
            root: scrollport ?? null,
            rootMargin: position === 'bottom' ? `0px 0px ${margin} 0px` : `${margin} 0px 0px 0px`,
            threshold: [0, 1],
          })
    intersection?.observe(el)
    const onScroll = (event: Event) => {
      if (
        event.target === el.ownerDocument ||
        (event.target instanceof Element && event.target.contains(el))
      )
        update()
    }
    el.ownerDocument.addEventListener('scroll', onScroll, { passive: true, capture: true })
    view.addEventListener('resize', update, { passive: true })
    cleanup = () => {
      el.ownerDocument.removeEventListener('scroll', onScroll, true)
      view.removeEventListener('resize', update)
      resize?.disconnect()
      intersection?.disconnect()
    }
    update()
  }

  function mount() {
    mounted = true
  }

  function unmount() {
    mounted = false
    cleanup?.()
    if (frame) element.current?.ownerDocument.defaultView?.cancelAnimationFrame(frame)
  }

  return {
    get affixed() {
      return affixed
    },
    connect,
    update,
    mount,
    unmount,
  }
}

export function useAffix(options: AffixOptions, onChange: (affixed: boolean) => void) {
  const element = useRef<HTMLElement>(null)
  const [affixed, setAffixed] = useState(false)
  const offset = Number.isFinite(options.offset) ? options.offset! : 0
  const latest = useRef({
    position: options.position,
    offset,
    disabled: options.disabled,
    onChange,
  })
  latest.current = { position: options.position, offset, disabled: options.disabled, onChange }
  const [affix] = useState(() =>
    createAffix(
      element,
      () => latest.current,
      value => {
        setAffixed(value)
        latest.current.onChange(value)
      },
    ),
  )
  const updated = useRef(false)

  useLayoutEffect(() => {
    affix.mount()
    return affix.unmount
  }, [affix])

  useLayoutEffect(affix.connect, [affix, options.position, offset, options.disabled, options.as])

  useEffect(() => {
    if (updated.current) affix.update()
    updated.current = true
  })

  return { element, affixed, offset, affix }
}
