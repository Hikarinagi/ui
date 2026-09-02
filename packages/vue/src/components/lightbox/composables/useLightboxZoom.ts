import { onBeforeUnmount, shallowRef } from 'vue'
import { animate } from 'motion-v'
import { prefersReducedMotion, type TransitionName } from '../../../motion'
import type { useLightboxMotion } from './useLightboxMotion'
import { FLING, TRACKPAD_INTENSITY } from '../utils/gesture'
import {
  WHEEL_INTENSITY,
  ZOOM_MIN,
  clampOffset,
  clampZoom,
  doubleTapZoom,
  elasticOffset,
  elasticZoom,
  isZoomed,
  panBounds,
  stepZoom,
  wheelZoom,
  zoomAbout,
  type Bounds,
  type Point,
  type Size,
} from '../utils/zoom'

export interface PinchStart {
  distance: number
  zoom: number
  mid: Point
  offset: Point
}

export function useLightboxZoom(
  motion: ReturnType<typeof useLightboxMotion>,
  geometry: () => { fit: Size; stage: Size; base: number },
) {
  const { x, y, scale } = motion
  const zoomed = shallowRef(false)
  const unsubscribe = scale.on('change', value => {
    zoomed.value = isZoomed(value / geometry().base)
  })
  onBeforeUnmount(unsubscribe)

  const zoom = () => scale.get() / geometry().base
  const offset = (): Point => ({ x: x.get(), y: y.get() })

  function bounds(level = zoom()): Bounds {
    const { fit, stage } = geometry()
    return panBounds({ width: fit.width * level, height: fit.height * level }, stage)
  }

  function place(level: number, next: Point) {
    x.stop()
    y.stop()
    scale.stop()
    scale.set(level * geometry().base)
    x.set(next.x)
    y.set(next.y)
  }

  function target(level: number, focal: Point): { level: number; offset: Point } {
    const clamped = clampZoom(level)
    if (!isZoomed(clamped)) return { level: ZOOM_MIN, offset: { x: 0, y: 0 } }
    return {
      level: clamped,
      offset: clampOffset(zoomAbout(offset(), zoom(), clamped, focal), bounds(clamped)),
    }
  }

  function zoomTo(level: number, focal: Point, name: TransitionName = 'base') {
    const to = target(level, focal)
    const t = motion.transition(name)
    animate(scale, to.level * geometry().base, t)
    animate(x, to.offset.x, t)
    animate(y, to.offset.y, t)
  }

  function step(direction: 1 | -1) {
    zoomTo(stepZoom(zoom(), direction), { x: 0, y: 0 })
  }

  function reset() {
    zoomTo(ZOOM_MIN, { x: 0, y: 0 })
  }

  function wheel(delta: number, focal: Point, trackpad: boolean) {
    const intensity = trackpad ? TRACKPAD_INTENSITY : WHEEL_INTENSITY
    const to = target(wheelZoom(zoom(), delta, intensity), focal)
    place(to.level, to.offset)
  }

  function doubleTap(focal: Point) {
    zoomTo(doubleTapZoom(zoom()), focal)
  }

  function pinch(start: PinchStart, mid: Point, ratio: number) {
    const level = elasticZoom(start.zoom * ratio)
    const about = zoomAbout(start.offset, start.zoom, level, start.mid)
    place(level, { x: about.x + mid.x - start.mid.x, y: about.y + mid.y - start.mid.y })
  }

  function settle(focal: Point) {
    zoomTo(zoom(), focal, 'press')
  }

  function pan(origin: Point, delta: Point) {
    const next = elasticOffset(
      { x: origin.x + delta.x, y: origin.y + delta.y },
      bounds(),
      geometry().stage,
    )
    x.set(next.x)
    y.set(next.y)
  }

  function glide(value: typeof x, min: number, max: number) {
    const from = value.get()
    const velocity = value.getVelocity()
    const target = Math.min(Math.max(from + FLING.power * velocity, min), max)
    if (target === from && velocity === 0) return
    animate(value, target, { type: 'inertia', velocity, min, max, ...FLING })
  }

  function fling() {
    const b = bounds()
    if (prefersReducedMotion()) {
      const clamped = clampOffset(offset(), b)
      x.set(clamped.x)
      y.set(clamped.y)
      return
    }
    glide(x, b.minX, b.maxX)
    glide(y, b.minY, b.maxY)
  }

  return {
    zoomed,
    zoom,
    isZoomed: () => isZoomed(zoom()),
    zoomTo,
    step,
    reset,
    wheel,
    doubleTap,
    pinch,
    settle,
    pan,
    fling,
  }
}
