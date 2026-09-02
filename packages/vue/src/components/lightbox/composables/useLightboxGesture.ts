import { shallowRef } from 'vue'
import type { useLightboxMotion } from './useLightboxMotion'
import type { PinchStart, useLightboxZoom } from './useLightboxZoom'
import {
  distance,
  dragAxis,
  isDoubleTap,
  isTap,
  midpoint,
  wheelDelta,
  type Touch,
} from '../utils/gesture'
import type { Point } from '../utils/zoom'

export type GestureMode = 'idle' | 'pending' | 'pan' | 'pinch' | 'dismiss' | 'page' | 'none'

export function useLightboxGesture(options: {
  stage: () => HTMLElement | undefined
  motion: ReturnType<typeof useLightboxMotion>
  zoom: ReturnType<typeof useLightboxZoom>
  paging: {
    grab: () => boolean
    move: (offset: number) => void
    release: (offset: number) => void
    settle: () => void
  }
  enabled: () => boolean
  interrupt: () => void
  inside: (target: EventTarget | null) => boolean
  dismiss: () => void
  tapOutside: () => void
}) {
  const { motion, zoom, paging } = options
  const mode = shallowRef<GestureMode>('idle')
  const pointers = new Map<number, Point>()
  let start: Touch = { x: 0, y: 0, time: 0 }
  let origin: Point = { x: 0, y: 0 }
  let delta: Point = { x: 0, y: 0 }
  let pinch: PinchStart | null = null
  let lastMid: Point = { x: 0, y: 0 }
  let lastTap: Touch | null = null
  let startInside = false
  let takeover = false
  let busyTap: Touch | null = null

  function relative(point: Point): Point {
    const rect = options.stage()?.getBoundingClientRect()
    if (!rect) return point
    return { x: point.x - rect.x - rect.width / 2, y: point.y - rect.y - rect.height / 2 }
  }

  function capture(event: PointerEvent, on: boolean) {
    const stage = options.stage()
    if (!stage) return
    try {
      if (on) stage.setPointerCapture(event.pointerId)
      else stage.releasePointerCapture(event.pointerId)
    } catch {
      return
    }
  }

  function isControl(target: EventTarget | null): boolean {
    return (
      target instanceof Element &&
      !!target.closest('button, a, input, [role="button"], [data-hn-chrome]')
    )
  }

  function pair(): [Point, Point] | null {
    const list = [...pointers.values()]
    return list.length >= 2 ? [list[0]!, list[1]!] : null
  }

  function onPointerdown(event: PointerEvent) {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    if (isControl(event.target)) return
    if (!options.enabled()) {
      busyTap = { x: event.clientX, y: event.clientY, time: event.timeStamp }
      return
    }
    capture(event, true)
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY })
    if (pointers.size === 1) {
      motion.stop()
      takeover = paging.grab()
      start = { x: event.clientX, y: event.clientY, time: event.timeStamp }
      origin = { x: motion.x.get(), y: motion.y.get() }
      delta = { x: 0, y: 0 }
      startInside = options.inside(event.target)
      mode.value = 'pending'
      return
    }
    const points = pair()
    if (!points || pointers.size !== 2) return
    if (mode.value === 'dismiss') motion.dismissCancel()
    paging.settle()
    lastMid = relative(midpoint(...points))
    pinch = {
      distance: distance(...points),
      zoom: zoom.zoom(),
      mid: lastMid,
      offset: { x: motion.x.get(), y: motion.y.get() },
    }
    mode.value = 'pinch'
  }

  function onPointermove(event: PointerEvent) {
    if (!pointers.has(event.pointerId)) return
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY })
    if (mode.value === 'pinch') {
      const points = pair()
      if (!points || !pinch) return
      lastMid = relative(midpoint(...points))
      zoom.pinch(pinch, lastMid, distance(...points) / pinch.distance)
      return
    }
    if (pointers.size !== 1) return
    const point = { x: event.clientX, y: event.clientY }
    if (mode.value === 'pending') {
      const axis = dragAxis(start, point)
      if (!axis) return
      mode.value = zoom.isZoomed() ? 'pan' : axis === 'y' ? 'dismiss' : 'page'
      if (mode.value !== 'page') paging.settle()
    }
    delta = { x: point.x - start.x, y: point.y - start.y }
    if (mode.value === 'pan') zoom.pan(origin, delta)
    else if (mode.value === 'dismiss') motion.dismissMove(origin.y + delta.y)
    else if (mode.value === 'page') paging.move(delta.x)
  }

  function finish(event: PointerEvent, cancelled: boolean) {
    if (busyTap) {
      const end: Touch = { x: event.clientX, y: event.clientY, time: event.timeStamp }
      if (!cancelled && isTap(busyTap, end)) options.interrupt()
      busyTap = null
      return
    }
    if (!pointers.has(event.pointerId)) return
    pointers.delete(event.pointerId)
    capture(event, false)
    if (mode.value === 'pinch') {
      zoom.settle(lastMid)
      pinch = null
      mode.value = pointers.size ? 'none' : 'idle'
      return
    }
    if (pointers.size) return
    const current = mode.value
    mode.value = 'idle'
    if (current === 'pan') {
      zoom.fling()
      return
    }
    if (current === 'page') {
      if (cancelled) paging.settle()
      else paging.release(delta.x)
      return
    }
    if (current === 'dismiss') {
      const velocity = cancelled ? 0 : motion.y.getVelocity()
      if (motion.dismissRelease(motion.y.get(), velocity)) options.dismiss()
      return
    }
    paging.release(0)
    if (cancelled || current !== 'pending') return
    const end: Touch = { x: event.clientX, y: event.clientY, time: event.timeStamp }
    if (!isTap(start, end)) return
    if (takeover) {
      lastTap = null
      return
    }
    if (!startInside) {
      lastTap = null
      options.tapOutside()
      return
    }
    if (isDoubleTap(lastTap, end)) {
      lastTap = null
      zoom.doubleTap(relative(end))
    } else {
      lastTap = end
    }
  }

  function onPointerup(event: PointerEvent) {
    finish(event, false)
  }

  function onPointercancel(event: PointerEvent) {
    finish(event, true)
  }

  function onWheel(event: WheelEvent) {
    if (isControl(event.target)) return
    event.preventDefault()
    if (!options.enabled()) return
    const height = options.stage()?.clientHeight ?? 0
    const delta = wheelDelta(event.deltaY, event.deltaMode, height)
    zoom.wheel(delta, relative({ x: event.clientX, y: event.clientY }), event.ctrlKey)
  }

  return { mode, onPointerdown, onPointermove, onPointerup, onPointercancel, onWheel }
}
