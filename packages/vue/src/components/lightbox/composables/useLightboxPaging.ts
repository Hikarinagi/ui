import { onBeforeUnmount, shallowRef, type Ref } from 'vue'
import { animate, useMotionValue, type ValueAnimationTransition } from 'motion-v'
import { prefersReducedMotion } from '../../../motion'
import { clampIndex, edgePosition, pageSteps, shortestDelta, wrapIndex } from '../utils/paging'
import { TRAVEL_SPRING } from '../utils/pose'

const PAGE_EPSILON = 0.001

export function useLightboxPaging(options: {
  index: Ref<number>
  count: () => number
  width: () => number
  loop: () => boolean
}) {
  const stripX = useMotionValue(0)
  const position = shallowRef(0)
  const low = shallowRef(0)
  const high = shallowRef(0)
  let origin = 0

  function looping(): boolean {
    return options.loop() && options.count() > 1
  }

  function rest(at: number): number {
    return -at * options.width()
  }

  function track(value: number) {
    const width = options.width()
    const page = width > 0 ? -value / width : position.value
    const nextLow = Math.floor(page + PAGE_EPSILON)
    const nextHigh = Math.ceil(page - PAGE_EPSILON)
    if (nextLow !== low.value) low.value = nextLow
    if (nextHigh !== high.value) high.value = nextHigh
  }

  const untrack = stripX.on('change', track)
  onBeforeUnmount(untrack)

  function sync() {
    position.value = options.index.value
    stripX.jump(rest(position.value))
    track(stripX.get())
  }

  function range(): [number, number] {
    return [low.value, high.value]
  }

  function grab(): boolean {
    stripX.stop()
    origin = stripX.get()
    return Math.abs(origin - rest(position.value)) > PAGE_EPSILON
  }

  function move(offset: number) {
    const raw = origin + offset
    stripX.set(looping() ? raw : edgePosition(raw, options.count(), options.width()))
  }

  function travel(to: number, transition: ValueAnimationTransition<number>): boolean {
    const count = options.count()
    const target = looping() ? to : clampIndex(to, count)
    const real = looping() ? wrapIndex(target, count) : target
    const changed = real !== options.index.value
    position.value = target
    if (changed) options.index.value = real
    animate(stripX, rest(target), transition)
    return changed
  }

  function withVelocity(velocity: number): ValueAnimationTransition<number> {
    return prefersReducedMotion() ? { duration: 0 } : { ...TRAVEL_SPRING, velocity }
  }

  function go(to: number): boolean {
    const target = looping()
      ? position.value + shortestDelta(to - options.index.value, options.count())
      : to
    return travel(target, withVelocity(0))
  }

  function release(offset: number) {
    const width = options.width()
    const velocity = stripX.getVelocity()
    const from = width > 0 ? Math.round(-origin / width) : position.value
    travel(from + pageSteps(offset, velocity, width), withVelocity(velocity))
  }

  function settle() {
    if (stripX.get() !== rest(position.value)) travel(position.value, withVelocity(0))
  }

  return { stripX, position, range, sync, grab, move, release, go, settle }
}
