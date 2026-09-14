import { computed, onBeforeUnmount, shallowRef } from 'vue'
import { animate } from 'motion-v'
import { prefersReducedMotion, type TransitionName } from '../../../motion'
import type { useLightboxMotion } from './useLightboxMotion'
import { FLING, TRACKPAD_INTENSITY } from '../utils/gesture'
import {
  WHEEL_INTENSITY,
  ZOOM_MIN,
  ZOOM_EPSILON,
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
  geometry: () => {
    fit: Size
    frame: Size
    stage: Size
    base: number
    original: number
    secondary: number
    max: number
  },
) {
  const { x, y, scale } = motion
  const raw = shallowRef(scale.get())
  const unsubscribe = scale.on('change', value => {
    raw.value = value
  })
  onBeforeUnmount(unsubscribe)

  const zoom = () => raw.value / geometry().base
  const zoomed = computed(() => isZoomed(zoom()))
  const canZoomIn = computed(() => zoom() < geometry().max - ZOOM_EPSILON)
  const canToggle = computed(() => geometry().secondary > ZOOM_MIN + ZOOM_EPSILON)
  const atOriginal = computed(() => Math.abs(zoom() - geometry().original) < ZOOM_EPSILON)
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
    const clamped = clampZoom(level, ZOOM_MIN, geometry().max)
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
    zoomTo(stepZoom(zoom(), direction, geometry().max), { x: 0, y: 0 })
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
    zoomTo(doubleTapZoom(zoom(), geometry().secondary), focal)
  }

  function pinch(start: PinchStart, mid: Point, ratio: number) {
    const level = elasticZoom(start.zoom * ratio, ZOOM_MIN, geometry().max)
    const about = zoomAbout(start.offset, start.zoom, level, start.mid)
    place(level, { x: about.x + mid.x - start.mid.x, y: about.y + mid.y - start.mid.y })
  }

  function settle(focal: Point) {
    zoomTo(zoom(), focal, 'press')
  }

  function reflow(update: () => void) {
    const before = geometry()
    const wasZoomed = isZoomed(zoom())
    const currentScale = scale.get()
    update()
    const after = geometry()
    if (before.frame.width <= 0 || after.frame.width <= 0) return
    if (
      before.frame.width === after.frame.width &&
      before.frame.height === after.frame.height &&
      before.base === after.base &&
      before.stage.width === after.stage.width &&
      before.stage.height === after.stage.height
    )
      return
    scale.stop()
    scale.set((currentScale * before.frame.width) / after.frame.width)
    zoomTo(wasZoomed ? zoom() : ZOOM_MIN, { x: 0, y: 0 })
  }

  function original() {
    zoomTo(geometry().original, { x: 0, y: 0 })
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
    canZoomIn,
    canToggle,
    atOriginal,
    original,
    reflow,
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
