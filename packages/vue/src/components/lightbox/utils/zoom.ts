export interface Size {
  width: number
  height: number
}

export interface Point {
  x: number
  y: number
}

export interface Bounds {
  minX: number
  maxX: number
  minY: number
  maxY: number
}

export const ZOOM_MIN = 1
export const ZOOM_MAX = 6
export const ZOOM_DOUBLE_TAP = 2.5
export const ZOOM_STEP = 1.5
export const OVERSHOOT = 0.55
export const WHEEL_INTENSITY = 0.002

export const ZOOM_EPSILON = 0.001

export function isZoomed(zoom: number): boolean {
  return zoom > ZOOM_MIN + ZOOM_EPSILON
}

export function rotatedSize(size: Size, rotation: number): Size {
  const quarter = Math.round(rotation / 90) % 2
  return quarter === 0 ? size : { width: size.height, height: size.width }
}

export function fitSize(natural: Size, stage: Size, rotation = 0): Size {
  const upright = rotatedSize(natural, rotation)
  if (upright.width <= 0 || upright.height <= 0) return { width: 0, height: 0 }
  const scale = Math.min(stage.width / upright.width, stage.height / upright.height)
  return { width: upright.width * scale, height: upright.height * scale }
}

export function panBounds(displayed: Size, stage: Size): Bounds {
  const x = Math.max(0, (displayed.width - stage.width) / 2)
  const y = Math.max(0, (displayed.height - stage.height) / 2)
  return { minX: x ? -x : 0, maxX: x, minY: y ? -y : 0, maxY: y }
}

export function clampOffset(offset: Point, bounds: Bounds): Point {
  return {
    x: Math.min(Math.max(offset.x, bounds.minX), bounds.maxX),
    y: Math.min(Math.max(offset.y, bounds.minY), bounds.maxY),
  }
}

export function zoomAbout(offset: Point, zoom: number, next: number, focal: Point): Point {
  const ratio = next / zoom
  return {
    x: focal.x - (focal.x - offset.x) * ratio,
    y: focal.y - (focal.y - offset.y) * ratio,
  }
}

function resist(over: number, span: number, coefficient: number): number {
  return (1 - 1 / ((over * coefficient) / span + 1)) * span
}

export function rubberBand(
  value: number,
  min: number,
  max: number,
  span: number,
  coefficient = OVERSHOOT,
): number {
  if (span <= 0) return Math.min(Math.max(value, min), max)
  if (value > max) return max + resist(value - max, span, coefficient)
  if (value < min) return min - resist(min - value, span, coefficient)
  return value
}

export function elasticOffset(offset: Point, bounds: Bounds, stage: Size): Point {
  return {
    x: rubberBand(offset.x, bounds.minX, bounds.maxX, stage.width),
    y: rubberBand(offset.y, bounds.minY, bounds.maxY, stage.height),
  }
}

export function clampZoom(zoom: number, min = ZOOM_MIN, max = ZOOM_MAX): number {
  return Math.min(Math.max(zoom, min), max)
}

export function elasticZoom(zoom: number, min = ZOOM_MIN, max = ZOOM_MAX): number {
  const lo = Math.log(min)
  const hi = Math.log(max)
  return Math.exp(rubberBand(Math.log(zoom), lo, hi, hi - lo))
}

export function pinchZoom(startZoom: number, startDistance: number, distance: number): number {
  if (startDistance <= 0) return startZoom
  return startZoom * (distance / startDistance)
}

export function wheelZoom(zoom: number, deltaY: number, intensity = WHEEL_INTENSITY): number {
  return zoom * Math.exp(-deltaY * intensity)
}

export function doubleTapZoom(zoom: number): number {
  return isZoomed(zoom) ? ZOOM_MIN : ZOOM_DOUBLE_TAP
}

export function stepZoom(zoom: number, direction: 1 | -1): number {
  return clampZoom(zoom * ZOOM_STEP ** direction)
}
