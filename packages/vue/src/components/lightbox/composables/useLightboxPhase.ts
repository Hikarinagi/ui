import { nextTick, type Ref } from 'vue'
import type { useLightboxMotion } from './useLightboxMotion'
import type { Pose } from '../utils/pose'

export type LightboxPhase = 'closed' | 'entering' | 'open' | 'closing'

export function useLightboxPhase(options: {
  open: Ref<boolean>
  mounted: Ref<boolean>
  locked: Ref<boolean>
  motion: ReturnType<typeof useLightboxMotion>
  pose: () => Pose | null
  prepare: () => void
  layout: () => void
}) {
  const { motion } = options
  let phase: LightboxPhase = 'closed'
  let generation = 0

  async function show() {
    if (phase !== 'closed') return
    phase = 'entering'
    const run = ++generation
    options.prepare()
    options.mounted.value = true
    options.locked.value = true
    await nextTick()
    options.layout()
    await motion.enter(options.pose())
    if (run === generation) phase = 'open'
  }

  async function reopen() {
    if (phase !== 'closing') return
    phase = 'entering'
    const run = ++generation
    await motion.resume()
    if (run === generation) phase = 'open'
  }

  async function close() {
    if (phase === 'closed' || phase === 'closing') return
    phase = 'closing'
    const run = ++generation
    await motion.leave(options.pose())
    if (run !== generation) return
    phase = 'closed'
    options.mounted.value = false
    options.locked.value = false
    if (options.open.value) options.open.value = false
  }

  function interrupt() {
    if (phase === 'entering') void close()
    else if (phase === 'closing') void reopen()
  }

  return { current: () => phase, show, close, reopen, interrupt }
}
