import type { ImageVariants } from '../../image/image.variants'
import { fitSize, rotatedSize, type Size } from './zoom'

export interface Rect {
  x: number
  y: number
  width: number
  height: number
}

export interface Pose {
  x: number
  y: number
  scale: number
  rotate: number
  clipPath: string
}

export const REST_POSE: Pose = {
  x: 0,
  y: 0,
  scale: 1,
  rotate: 0,
  clipPath: 'inset(0px 0px 0px 0px round 0px)',
}
export const TRAVEL_SPRING = { type: 'spring', visualDuration: 0.3, bounce: 0 } as const
export const RETURN_SPRING = { ...TRAVEL_SPRING, visualDuration: 0.22 } as const
export const DISMISS_SCALE = 0.7
export const DISMISS_TRAVEL = 0.3
export const DISMISS_COMMIT = 0.5
export const DISMISS_VELOCITY = 600

function px(value: number): string {
  return `${Math.round(value * 100) / 100}px`
}

export function fitRect(natural: Size, stage: Size, rotation = 0): Rect {
  const size = fitSize(natural, stage, rotation)
  return {
    x: (stage.width - size.width) / 2,
    y: (stage.height - size.height) / 2,
    width: size.width,
    height: size.height,
  }
}

export function renderedRect(box: Rect, natural: Size, fit: ImageVariants['fit'] = 'cover'): Rect {
  if (fit === 'fill' || natural.width <= 0 || natural.height <= 0) return { ...box }
  const contain = Math.min(box.width / natural.width, box.height / natural.height)
  const cover = Math.max(box.width / natural.width, box.height / natural.height)
  const scale =
    fit === 'cover'
      ? cover
      : fit === 'contain'
        ? contain
        : fit === 'none'
          ? 1
          : Math.min(contain, 1)
  const width = natural.width * scale
  const height = natural.height * scale
  return {
    x: box.x + (box.width - width) / 2,
    y: box.y + (box.height - height) / 2,
    width,
    height,
  }
}

function intersect(a: Rect, b: Rect): Rect {
  const x = Math.max(a.x, b.x)
  const y = Math.max(a.y, b.y)
  const right = Math.min(a.x + a.width, b.x + b.width)
  const bottom = Math.min(a.y + a.height, b.y + b.height)
  return { x, y, width: Math.max(0, right - x), height: Math.max(0, bottom - y) }
}

export function openPose(
  frame: Rect,
  box: Rect,
  natural: Size,
  fit?: ImageVariants['fit'],
  radius = 0,
): Pose {
  const rendered = renderedRect(box, natural, fit)
  if (frame.width <= 0 || frame.height <= 0 || rendered.width <= 0) return REST_POSE
  const scale = rendered.width / frame.width
  const visible = intersect(box, rendered)
  const top = (visible.y - rendered.y) / scale
  const left = (visible.x - rendered.x) / scale
  const right = (rendered.x + rendered.width - visible.x - visible.width) / scale
  const bottom = (rendered.y + rendered.height - visible.y - visible.height) / scale
  const corner = Math.max(0, radius) / scale
  return {
    x: rendered.x + rendered.width / 2 - (frame.x + frame.width / 2),
    y: rendered.y + rendered.height / 2 - (frame.y + frame.height / 2),
    scale,
    rotate: 0,
    clipPath: `inset(${px(top)} ${px(right)} ${px(bottom)} ${px(left)} round ${px(corner)})`,
  }
}

export function baseScale(frame: Size, stage: Size, rotation: number): number {
  const visual = rotatedSize(frame, rotation)
  if (visual.width <= 0 || visual.height <= 0) return 1
  if (rotation % 180 === 0) return 1
  return Math.min(stage.width / visual.width, stage.height / visual.height)
}

export function radiusOf(el: Element | null | undefined): number {
  for (let node = el, depth = 0; node && depth < 2; node = node.parentElement, depth += 1) {
    const value = Number.parseFloat(getComputedStyle(node).borderTopLeftRadius)
    if (value > 0) return value
  }
  return 0
}

export function dismissProgress(offsetY: number, stageHeight: number): number {
  if (stageHeight <= 0) return 0
  return Math.min(1, Math.max(0, offsetY) / (stageHeight * DISMISS_TRAVEL))
}

export function shouldDismiss(offsetY: number, velocityY: number, stageHeight: number): boolean {
  if (offsetY <= 0) return false
  return dismissProgress(offsetY, stageHeight) >= DISMISS_COMMIT || velocityY >= DISMISS_VELOCITY
}
