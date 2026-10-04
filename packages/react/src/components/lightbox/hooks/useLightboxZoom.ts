'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import { animate, type MotionValue } from 'motion/react'
import { prefersReducedMotion, type TransitionName } from '../../../motion'
import type { LightboxMotion } from './useLightboxMotion'
import { FLING, TRACKPAD_INTENSITY } from '../../../../../shared/src/lib/lightbox/gesture'
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
} from '../../../../../shared/src/lib/lightbox/zoom'
import { useLatest, useRerender } from './useLatest'

export interface PinchStart {
  distance: number
  zoom: number
  mid: Point
  offset: Point
}

export interface LightboxGeometry {
  fit: Size
  frame: Size
  stage: Size
  base: number
  original: number
  secondary: number
  max: number
}

function flagsOf(raw: number, geometry: LightboxGeometry) {
  const zoom = raw / geometry.base
  return {
    zoomed: isZoomed(zoom),
    canZoomIn: zoom < geometry.max - ZOOM_EPSILON,
    canToggle: geometry.secondary > ZOOM_MIN + ZOOM_EPSILON,
    atOriginal: Math.abs(zoom - geometry.original) < ZOOM_EPSILON,
  }
}

type Flags = ReturnType<typeof flagsOf>

function sameFlags(a: Flags, b: Flags) {
  return (
    a.zoomed === b.zoomed &&
    a.canZoomIn === b.canZoomIn &&
    a.canToggle === b.canToggle &&
    a.atOriginal === b.atOriginal
  )
}

function createLightboxZoom(motion: LightboxMotion, geometry: () => LightboxGeometry) {
  const { x, y, scale } = motion
  const raw = { value: scale.get() }

  const zoom = () => raw.value / geometry().base
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

  function glide(value: MotionValue<number>, min: number, max: number) {
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
    raw,
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

export type LightboxZoom = ReturnType<typeof createLightboxZoom> & Flags

export function useLightboxZoom(
  motion: LightboxMotion,
  geometry: () => LightboxGeometry,
): LightboxZoom {
  const rerender = useRerender()
  const latest = useLatest(geometry)
  const [zoom] = useState(() => createLightboxZoom(motion, () => latest.current()))
  const flags = flagsOf(zoom.raw.value, geometry())
  const rendered = useRef(flags)
  rendered.current = flags

  useLayoutEffect(
    () =>
      motion.scale.on('change', value => {
        zoom.raw.value = value
        if (!sameFlags(flagsOf(value, latest.current()), rendered.current)) rerender()
      }),
    [motion, zoom],
  )

  return Object.assign(zoom, flags)
}
