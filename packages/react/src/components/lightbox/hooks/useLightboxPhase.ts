'use client'

import { useEffect, useState } from 'react'
import type { LightboxMotion } from './useLightboxMotion'
import type { Pose } from '../../../../../shared/src/lib/lightbox/pose'
import { useLatest, useRerender } from './useLatest'

export type LightboxPhase = 'closed' | 'entering' | 'open' | 'closing'

export interface LightboxPhaseOptions {
  open: () => boolean
  setOpen: (open: boolean) => void
  mounted: () => boolean
  setMounted: (mounted: boolean) => void
  setLocked: (locked: boolean) => void
  nextTick: () => Promise<void>
  motion: LightboxMotion
  pose: () => Pose | null
  prepare: () => void | Promise<void>
  layout: () => void
}

function createLightboxPhase(options: LightboxPhaseOptions, notify: () => void) {
  const { motion } = options
  let phase: LightboxPhase = 'closed'
  let generation = 0

  function set(value: LightboxPhase) {
    if (phase === value) return
    phase = value
    notify()
  }

  async function show() {
    if (phase !== 'closed') return
    set('entering')
    const run = ++generation
    const preparing = options.prepare()
    if (preparing) await preparing
    if (run !== generation) return
    options.setMounted(true)
    options.setLocked(true)
    await options.nextTick()
    if (run !== generation) return
    options.layout()
    await motion.enter(options.pose())
    if (run === generation) set('open')
  }

  async function reopen() {
    if (phase !== 'closing') return
    set('entering')
    const run = ++generation
    await motion.resume()
    if (run === generation) set('open')
  }

  async function close() {
    if (phase === 'closed' || phase === 'closing') return
    set('closing')
    const run = ++generation
    if (options.mounted()) await motion.leave(options.pose())
    if (run !== generation) return
    set('closed')
    options.setMounted(false)
    options.setLocked(false)
    if (options.open()) options.setOpen(false)
  }

  function interrupt() {
    if (phase === 'entering') void close()
    else if (phase === 'closing') void reopen()
  }

  function dispose() {
    generation++
    motion.stop()
    phase = 'closed'
  }

  return { current: () => phase, show, close, reopen, interrupt, dispose }
}

export type LightboxPhaseController = ReturnType<typeof createLightboxPhase>

export function useLightboxPhase(options: LightboxPhaseOptions) {
  const rerender = useRerender()
  const latest = useLatest({ options, rerender })
  const [phase] = useState(() =>
    createLightboxPhase(
      {
        open: () => latest.current.options.open(),
        setOpen: value => latest.current.options.setOpen(value),
        mounted: () => latest.current.options.mounted(),
        setMounted: value => latest.current.options.setMounted(value),
        setLocked: value => latest.current.options.setLocked(value),
        nextTick: () => latest.current.options.nextTick(),
        motion: options.motion,
        pose: () => latest.current.options.pose(),
        prepare: () => latest.current.options.prepare(),
        layout: () => latest.current.options.layout(),
      },
      () => latest.current.rerender(),
    ),
  )
  useEffect(() => phase.dispose, [phase])
  return phase
}
