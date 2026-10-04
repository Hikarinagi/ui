'use client'

import { useCallback, useEffect, useReducer, useRef, useState, type FocusEvent } from 'react'
import type { ScrollTopProps, ScrollTopTarget } from '../types'
import { usePreferredReducedMotion } from './usePreferredReducedMotion'

type Resolved = ScrollTopTarget | null | undefined

function resolve(target: ScrollTopProps['target']): Resolved {
  if (target === undefined) return window
  return typeof target === 'function' ? target() : target
}

export function useScrollTop(props: ScrollTopProps) {
  const [mounted, setMounted] = useState(false)
  const [, refresh] = useReducer((count: number) => count + 1, 0)
  const [pastThreshold, setPastThreshold] = useState(false)
  const [keyboardFocused, setKeyboardFocused] = useState(false)
  const reducedMotion = usePreferredReducedMotion()
  const target = mounted ? resolve(props.target) : undefined
  const threshold = Number.isFinite(props.threshold) ? Math.max(0, props.threshold!) : 300
  const latest = useRef({ props, target, reducedMotion })
  latest.current = { props, target, reducedMotion }

  useEffect(() => setMounted(true), [])

  const getter = typeof props.target === 'function'
  useEffect(() => {
    if (!mounted || !getter) return
    const doc = window.document
    const check = () => {
      if (resolve(latest.current.props.target) !== latest.current.target) refresh()
    }
    doc.addEventListener('scroll', check, { capture: true, passive: true })
    return () => doc.removeEventListener('scroll', check, { capture: true })
  }, [mounted, getter])

  const previous = useRef(target)
  useEffect(() => {
    if (previous.current === target) return
    previous.current = target
    setKeyboardFocused(false)
  }, [target])

  useEffect(() => {
    setPastThreshold(false)
    const element = target
    if (!element) return
    const update = () => {
      setPastThreshold(('scrollY' in element ? element.scrollY : element.scrollTop) > threshold)
    }
    update()
    element.addEventListener('scroll', update, { passive: true })
    return () => element.removeEventListener('scroll', update)
  }, [target, threshold])

  const visible = !!target && (pastThreshold || keyboardFocused)

  const scrollToTop = useCallback(() => {
    const { props, target, reducedMotion } = latest.current
    if (!target || props.disabled || props.loading) return
    target.scrollTo({
      top: 0,
      behavior: reducedMotion === 'reduce' ? 'instant' : (props.behavior ?? 'smooth'),
    })
    const focusTarget =
      typeof props.focusTarget === 'function' ? props.focusTarget() : props.focusTarget
    focusTarget?.focus({ preventScroll: true })
  }, [])

  const onFocus = useCallback((event: FocusEvent<HTMLElement>) => {
    setKeyboardFocused((event.target as HTMLElement).matches(':focus-visible'))
  }, [])

  const onBlur = useCallback(() => {
    setKeyboardFocused(false)
  }, [])

  return { visible, scrollToTop, onFocus, onBlur }
}
