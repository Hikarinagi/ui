import { nextTick, shallowRef, type Ref } from 'vue'
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
  const phase = shallowRef<LightboxPhase>('closed')
  let generation = 0

  async function show() {
    if (phase.value !== 'closed') return
    phase.value = 'entering'
    const run = ++generation
    options.prepare()
    options.mounted.value = true
    options.locked.value = true
    await nextTick()
    options.layout()
    await motion.enter(options.pose())
    if (run === generation) phase.value = 'open'
  }

  async function reopen() {
    if (phase.value !== 'closing') return
    phase.value = 'entering'
    const run = ++generation
    await motion.resume()
    if (run === generation) phase.value = 'open'
  }

  async function close() {
    if (phase.value === 'closed' || phase.value === 'closing') return
    phase.value = 'closing'
    const run = ++generation
    await motion.leave(options.pose())
    if (run !== generation) return
    phase.value = 'closed'
    options.mounted.value = false
    options.locked.value = false
    if (options.open.value) options.open.value = false
  }

  function interrupt() {
    if (phase.value === 'entering') void close()
    else if (phase.value === 'closing') void reopen()
  }

  return { current: () => phase.value, show, close, reopen, interrupt }
}
