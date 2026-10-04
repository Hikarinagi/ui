'use client'

import { cloneElement, useLayoutEffect, useRef, useState, type ReactElement, type Ref } from 'react'
import { flushSync } from 'react-dom'
import clsx from 'clsx'
import { resolveChild } from '../children'
import { forceReflow, nextFrame, whenTransitionEnds } from './timing'
import { useComposedRefs } from '../../primitives/utils/compose-refs'

export interface TransitionHooks {
  onBeforeEnter?: (element: HTMLElement) => void
  onAfterEnter?: (element: HTMLElement) => void
  onEnterCancelled?: (element: HTMLElement) => void
  onBeforeLeave?: (element: HTMLElement) => void
  onAfterLeave?: (element: HTMLElement) => void
  onLeaveCancelled?: (element: HTMLElement) => void
}

export interface TransitionClasses {
  enterFromClass?: string
  enterActiveClass?: string
  enterToClass?: string
  leaveFromClass?: string
  leaveActiveClass?: string
  leaveToClass?: string
}

export interface TransitionProps extends TransitionHooks, TransitionClasses {
  show: boolean
  name?: string
  appear?: boolean
  children: ReactElement<{ ref?: Ref<HTMLElement>; className?: string }>
}

type Phase = { kind: 'enter' | 'leave'; stop: () => void; cancel: () => void }

function tokens(value?: string) {
  return value ? value.split(/\s+/).filter(Boolean) : []
}

function resolveClasses(props: TransitionProps): Required<TransitionClasses> {
  const name = props.name ?? 'v'
  return {
    enterFromClass: props.enterFromClass ?? `${name}-enter-from`,
    enterActiveClass: props.enterActiveClass ?? `${name}-enter-active`,
    enterToClass: props.enterToClass ?? `${name}-enter-to`,
    leaveFromClass: props.leaveFromClass ?? `${name}-leave-from`,
    leaveActiveClass: props.leaveActiveClass ?? `${name}-leave-active`,
    leaveToClass: props.leaveToClass ?? `${name}-leave-to`,
  }
}

export function Transition(props: TransitionProps) {
  const { show, appear } = props
  const children = resolveChild(props.children)
  const [present, setPresent] = useState(show)
  if (show && !present) setPresent(true)

  const latest = useRef(props)
  latest.current = props
  const snapshot = useRef(children)
  if (show) snapshot.current = children

  const node = useRef<HTMLElement | null>(null)
  const settled = useRef<HTMLElement | null>(null)
  const applied = useRef(new Set<string>())
  const phase = useRef<Phase | null>(null)
  const mounted = useRef(false)
  const handled = useRef<boolean | null>(null)
  const shown = useRef(show)
  const ref = useComposedRefs(snapshot.current.props.ref, node)
  const entering = show && (!shown.current || (!mounted.current && !!appear))

  function add(element: HTMLElement, value?: string) {
    for (const name of tokens(value)) {
      element.classList.add(name)
      applied.current.add(name)
    }
  }

  function remove(element: HTMLElement, value?: string) {
    for (const name of tokens(value)) {
      element.classList.remove(name)
      applied.current.delete(name)
    }
  }

  function enter(element: HTMLElement, fresh: boolean) {
    const classes = resolveClasses(latest.current)
    add(element, classes.enterFromClass)
    add(element, classes.enterActiveClass)
    const beforeEnter = latest.current.onBeforeEnter
    if (fresh && beforeEnter) {
      const transition = element.style.transition
      element.style.transition = 'none'
      beforeEnter(element)
      forceReflow(element)
      element.style.transition = transition
      if (element.getAttribute('style') === '') element.removeAttribute('style')
    } else beforeEnter?.(element)
    let stopEnd: (() => void) | undefined
    let cancelled = false
    const stopFrame = nextFrame(() => {
      remove(element, classes.enterFromClass)
      add(element, classes.enterToClass)
      stopEnd = whenTransitionEnds(element, cancelled ? settle : finish)
    })
    const stop = () => {
      stopFrame()
      stopEnd?.()
    }
    function settle() {
      stopEnd?.()
      remove(element, classes.enterToClass)
      remove(element, classes.enterActiveClass)
    }
    function finish() {
      stop()
      remove(element, classes.enterToClass)
      remove(element, classes.enterActiveClass)
      phase.current = null
      latest.current.onAfterEnter?.(element)
    }
    phase.current = {
      kind: 'enter',
      stop,
      cancel: () => {
        cancelled = true
        stopEnd?.()
        remove(element, classes.enterToClass)
        remove(element, classes.enterActiveClass)
        phase.current = null
        latest.current.onEnterCancelled?.(element)
      },
    }
  }

  function leave(element: HTMLElement, enterCancelled: boolean) {
    const classes = resolveClasses(latest.current)
    latest.current.onBeforeLeave?.(element)
    add(element, classes.leaveFromClass)
    if (enterCancelled) {
      add(element, classes.leaveActiveClass)
      forceReflow(element)
    } else {
      forceReflow(element)
      add(element, classes.leaveActiveClass)
    }
    let stopEnd: (() => void) | undefined
    const stopFrame = nextFrame(() => {
      remove(element, classes.leaveFromClass)
      add(element, classes.leaveToClass)
      stopEnd = whenTransitionEnds(element, finish)
    })
    const stop = () => {
      stopFrame()
      stopEnd?.()
    }
    function finish() {
      stop()
      remove(element, classes.leaveToClass)
      remove(element, classes.leaveActiveClass)
      phase.current = null
      flushSync(() => setPresent(false))
      latest.current.onAfterLeave?.(element)
    }
    phase.current = {
      kind: 'leave',
      stop,
      cancel: () => {
        stop()
        remove(element, classes.leaveFromClass)
        remove(element, classes.leaveToClass)
        remove(element, classes.leaveActiveClass)
        phase.current = null
        latest.current.onLeaveCancelled?.(element)
      },
    }
  }

  useLayoutEffect(() => {
    const element = node.current
    if (!element) return
    for (const name of applied.current) element.classList.add(name)
  })

  useLayoutEffect(() => {
    const initial = handled.current === null
    handled.current = show
    mounted.current = true
    shown.current = show
    if (initial && (!show || !appear)) return
    const element = node.current
    if (!element) return
    const fresh = settled.current !== element
    settled.current = element
    const current = phase.current
    current?.cancel()
    if (show) enter(element, fresh)
    else leave(element, current?.kind === 'enter')
  }, [show])

  useLayoutEffect(
    () => () => {
      phase.current?.stop()
      handled.current = null
    },
    [],
  )

  if (!present) return null
  const classes = resolveClasses(latest.current)
  const className = clsx(
    snapshot.current.props.className,
    [...applied.current],
    entering && [classes.enterFromClass, classes.enterActiveClass],
  )
  return cloneElement(snapshot.current, { ref, className })
}
