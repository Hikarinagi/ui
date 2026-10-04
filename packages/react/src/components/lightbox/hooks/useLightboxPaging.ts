'use client'

import { useLayoutEffect, useState } from 'react'
import { animate, motionValue, type ValueAnimationTransition } from 'motion/react'
import { prefersReducedMotion } from '../../../motion'
import {
  clampIndex,
  edgePosition,
  pageSteps,
  shortestDelta,
  wrapIndex,
} from '../../../../../shared/src/lib/lightbox/paging'
import { TRAVEL_SPRING } from '../../../../../shared/src/lib/lightbox/pose'
import { useLatest, useRerender } from './useLatest'

const PAGE_EPSILON = 0.001

export interface LightboxPagingOptions {
  index: () => number
  setIndex: (index: number) => void
  count: () => number
  width: () => number
  loop: () => boolean
}

function createLightboxPaging(options: LightboxPagingOptions, notify: () => void) {
  const stripX = motionValue(0)
  const state = { position: 0, low: 0, high: 0 }
  let origin = 0

  function looping(): boolean {
    return options.loop() && options.count() > 1
  }

  function rest(at: number): number {
    return -at * options.width()
  }

  function setPosition(value: number) {
    if (state.position === value) return
    state.position = value
    notify()
  }

  function track(value: number) {
    const width = options.width()
    const page = width > 0 ? -value / width : state.position
    const nextLow = Math.floor(page + PAGE_EPSILON)
    const nextHigh = Math.ceil(page - PAGE_EPSILON)
    if (nextLow === state.low && nextHigh === state.high) return
    state.low = nextLow
    state.high = nextHigh
    notify()
  }

  function sync() {
    setPosition(options.index())
    stripX.jump(rest(state.position))
    track(stripX.get())
  }

  function range(): [number, number] {
    return [state.low, state.high]
  }

  function grab(): boolean {
    stripX.stop()
    origin = stripX.get()
    return Math.abs(origin - rest(state.position)) > PAGE_EPSILON
  }

  function move(offset: number) {
    const raw = origin + offset
    stripX.set(looping() ? raw : edgePosition(raw, options.count(), options.width()))
  }

  function travel(to: number, transition: ValueAnimationTransition<number>): boolean {
    const count = options.count()
    const target = looping() ? to : clampIndex(to, count)
    const real = looping() ? wrapIndex(target, count) : target
    const changed = real !== options.index()
    setPosition(target)
    if (changed) options.setIndex(real)
    animate(stripX, rest(target), transition)
    return changed
  }

  function withVelocity(velocity: number): ValueAnimationTransition<number> {
    return prefersReducedMotion() ? { duration: 0 } : { ...TRAVEL_SPRING, velocity }
  }

  function go(to: number): boolean {
    const target = looping()
      ? state.position + shortestDelta(to - options.index(), options.count())
      : to
    return travel(target, withVelocity(0))
  }

  function release(offset: number) {
    const width = options.width()
    const velocity = stripX.getVelocity()
    const from = width > 0 ? Math.round(-origin / width) : state.position
    travel(from + pageSteps(offset, velocity, width), withVelocity(velocity))
  }

  function settle() {
    if (stripX.get() !== rest(state.position)) travel(state.position, withVelocity(0))
  }

  return {
    stripX,
    get position() {
      return state.position
    },
    track,
    range,
    sync,
    grab,
    move,
    release,
    go,
    settle,
  }
}

export type LightboxPaging = ReturnType<typeof createLightboxPaging>

export function useLightboxPaging(options: LightboxPagingOptions) {
  const rerender = useRerender()
  const latest = useLatest({ options, rerender })
  const [paging] = useState(() =>
    createLightboxPaging(
      {
        index: () => latest.current.options.index(),
        setIndex: index => latest.current.options.setIndex(index),
        count: () => latest.current.options.count(),
        width: () => latest.current.options.width(),
        loop: () => latest.current.options.loop(),
      },
      () => latest.current.rerender(),
    ),
  )
  useLayoutEffect(() => paging.stripX.on('change', paging.track), [paging])
  return paging
}
