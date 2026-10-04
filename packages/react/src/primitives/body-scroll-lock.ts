'use client'

import { useEffect, useId } from 'react'

const locks = new Map<string, boolean>()
let initialOverflow: string | undefined
let releaseTouchMove: (() => void) | undefined
let active = false

const isIOS =
  typeof navigator !== 'undefined' &&
  (/iP(?:ad|hone|od)/.test(navigator.userAgent) ||
    (navigator.maxTouchPoints > 2 && /iPad|Macintosh/.test(navigator.userAgent)))

function scrollable(element: Element): boolean {
  const style = getComputedStyle(element)
  if (
    style.overflowX === 'scroll' ||
    style.overflowY === 'scroll' ||
    (style.overflowX === 'auto' && element.clientWidth < element.scrollWidth) ||
    (style.overflowY === 'auto' && element.clientHeight < element.scrollHeight)
  )
    return true
  const parent = element.parentNode
  if (!(parent instanceof Element) || parent.tagName === 'BODY') return false
  return scrollable(parent)
}

function preventTouchMove(event: TouchEvent) {
  const target = event.target
  if (target instanceof Element && scrollable(target)) return
  if (event.touches.length > 1) return
  if (event.cancelable) event.preventDefault()
}

function locked() {
  for (const value of locks.values()) if (value) return true
  return false
}

function reset() {
  document.body.style.paddingRight = ''
  document.body.style.marginRight = ''
  document.documentElement.style.removeProperty('--scrollbar-width')
  document.body.style.overflow = initialOverflow ?? ''
  releaseTouchMove?.()
  releaseTouchMove = undefined
  initialOverflow = undefined
}

function apply() {
  if (initialOverflow === undefined) initialOverflow = document.body.style.overflow
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
  if (scrollbarWidth > 0) {
    document.body.style.paddingRight = `${scrollbarWidth}px`
    document.body.style.marginRight = '0px'
    document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`)
    document.body.style.overflow = 'hidden'
  }
  if (isIOS) {
    document.addEventListener('touchmove', preventTouchMove, { passive: false })
    releaseTouchMove = () => document.removeEventListener('touchmove', preventTouchMove)
  }
  queueMicrotask(() => {
    if (!locked()) return
    document.body.style.overflow = 'hidden'
  })
}

function sync() {
  const next = locked()
  if (next === active) return
  active = next
  if (next) apply()
  else reset()
}

export function useBodyScrollLock(enabled: boolean) {
  const id = useId()
  useEffect(() => {
    locks.set(id, enabled)
    sync()
    return () => {
      locks.delete(id)
      sync()
    }
  }, [id, enabled])
}
