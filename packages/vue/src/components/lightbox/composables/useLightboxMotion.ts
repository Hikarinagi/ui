import { animate, useMotionValue, type ValueAnimationTransition } from 'motion-v'
import { TRANSITION, prefersReducedMotion, type TransitionName } from '../../../motion'
import { rubberBand } from '../utils/zoom'
import {
  DISMISS_SCALE,
  REST_POSE,
  RETURN_SPRING,
  TRAVEL_SPRING,
  dismissProgress,
  shouldDismiss,
  type Pose,
} from '../utils/pose'

const FADE_POSE: Pose = { ...REST_POSE, scale: 0.98 }

type Timing = ValueAnimationTransition

export function useLightboxMotion(stageHeight: () => number, restScale: () => number) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const scale = useMotionValue(1)
  const rotate = useMotionValue(0)
  const clipPath = useMotionValue(REST_POSE.clipPath)
  const opacity = useMotionValue(1)
  const presence = useMotionValue(0)

  function timing(value: Timing) {
    return prefersReducedMotion() ? { duration: 0 } : value
  }

  function transition(name: TransitionName) {
    return timing(TRANSITION[name])
  }

  function settle(controls: { finished: Promise<unknown> }[]): Promise<void> {
    return Promise.all(controls.map(control => control.finished)).then(() => undefined)
  }

  function stop() {
    x.stop()
    y.stop()
    scale.stop()
    rotate.stop()
    presence.stop()
  }

  function jumpTo(pose: Pose) {
    x.jump(pose.x)
    y.jump(pose.y)
    scale.jump(pose.scale)
    rotate.jump(pose.rotate)
    clipPath.jump(pose.clipPath)
  }

  function nearestTurn(target: number): number {
    return target + Math.round((rotate.get() - target) / 360) * 360
  }

  function poseTo(pose: Pose, t: ReturnType<typeof timing>) {
    return [
      animate(x, pose.x, t),
      animate(y, pose.y, t),
      animate(scale, pose.scale, t),
      animate(rotate, nearestTurn(pose.rotate), t),
      animate(clipPath, pose.clipPath, t),
    ]
  }

  function enter(from: Pose | null): Promise<void> {
    const t = from ? timing(TRAVEL_SPRING) : transition('enterStrong')
    jumpTo(from ?? FADE_POSE)
    opacity.jump(from ? 1 : 0)
    presence.jump(0)
    return settle([...poseTo(REST_POSE, t), animate(opacity, 1, t), animate(presence, 1, t)])
  }

  function resume(): Promise<void> {
    stop()
    const t = timing(TRAVEL_SPRING)
    const rest = { ...REST_POSE, scale: restScale(), rotate: rotate.get() }
    return settle([...poseTo(rest, t), animate(opacity, 1, t), animate(presence, 1, t)])
  }

  function leave(to: Pose | null): Promise<void> {
    stop()
    const t = to ? timing(RETURN_SPRING) : transition('exit')
    const travel = to ? poseTo(to, t) : [animate(scale, FADE_POSE.scale, t), animate(opacity, 0, t)]
    return settle([...travel, animate(presence, 0, t)])
  }

  function dismissMove(offsetY: number) {
    y.set(offsetY < 0 ? rubberBand(offsetY, 0, Infinity, stageHeight()) : offsetY)
    const progress = dismissProgress(offsetY, stageHeight())
    scale.set(restScale() * (1 - (1 - DISMISS_SCALE) * progress))
    presence.set(1 - progress)
  }

  function dismissRelease(offsetY: number, velocityY: number): boolean {
    if (shouldDismiss(offsetY, velocityY, stageHeight())) return true
    const t = transition('press')
    animate(x, 0, t)
    animate(y, 0, t)
    animate(scale, restScale(), t)
    animate(presence, 1, t)
    return false
  }

  function dismissCancel() {
    animate(presence, 1, transition('fast'))
  }

  function turn(degrees: number) {
    const t = transition('base')
    animate(rotate, degrees, t)
    animate(scale, restScale(), t)
    animate(x, 0, t)
    animate(y, 0, t)
  }

  function reset(degrees: number) {
    x.jump(0)
    y.jump(0)
    rotate.jump(degrees)
    scale.jump(restScale())
  }

  return {
    x,
    y,
    scale,
    rotate,
    clipPath,
    opacity,
    presence,
    transition,
    stop,
    enter,
    resume,
    leave,
    dismissMove,
    dismissRelease,
    dismissCancel,
    turn,
    reset,
  }
}
