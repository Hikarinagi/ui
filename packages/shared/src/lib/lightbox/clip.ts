import type { Rect } from './pose'

export interface Corner {
  x: number
  y: number
}

export type Corners = [Corner, Corner, Corner, Corner]

function emptyCorners(): Corners {
  return [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ]
}

function length(value: string, size: number): number {
  const number = Number.parseFloat(value) || 0
  return value.endsWith('%') ? (number * size) / 100 : number
}

function cornersOf(style: CSSStyleDeclaration, width: number, height: number): Corners {
  const corners = [
    style.borderTopLeftRadius,
    style.borderTopRightRadius,
    style.borderBottomRightRadius,
    style.borderBottomLeftRadius,
  ].map(value => {
    const [x = '0', y = x] = value.split(/\s+/)
    return { x: length(x, width), y: length(y, height) }
  }) as Corners
  const [tl, tr, br, bl] = corners
  const factor = Math.min(
    1,
    width / (tl.x + tr.x || 1),
    width / (bl.x + br.x || 1),
    height / (tl.y + bl.y || 1),
    height / (tr.y + br.y || 1),
  )
  return corners.map(corner => ({ x: corner.x * factor, y: corner.y * factor })) as Corners
}

function paddingBox(node: Element, style: CSSStyleDeclaration) {
  const box = node.getBoundingClientRect()
  const width = node instanceof HTMLElement ? node.offsetWidth : box.width
  const height = node instanceof HTMLElement ? node.offsetHeight : box.height
  const sx = width ? box.width / width : 1
  const sy = height ? box.height / height : 1
  const left = Number.parseFloat(style.borderLeftWidth) || 0
  const right = Number.parseFloat(style.borderRightWidth) || 0
  const top = Number.parseFloat(style.borderTopWidth) || 0
  const bottom = Number.parseFloat(style.borderBottomWidth) || 0
  const corners = cornersOf(style, width, height)
  const borders = [
    [left, top],
    [right, top],
    [right, bottom],
    [left, bottom],
  ]
  return {
    rect: {
      x: box.x + left * sx,
      y: box.y + top * sy,
      width: Math.max(0, box.width - (left + right) * sx),
      height: Math.max(0, box.height - (top + bottom) * sy),
    },
    corners: corners.map((corner, index) => ({
      x: Math.max(0, corner.x - borders[index]![0]!) * sx,
      y: Math.max(0, corner.y - borders[index]![1]!) * sy,
    })) as Corners,
  }
}

function points(rect: Rect) {
  return [
    [rect.x, rect.y],
    [rect.x + rect.width, rect.y],
    [rect.x + rect.width, rect.y + rect.height],
    [rect.x, rect.y + rect.height],
  ]
}

export function clipOf(el: Element | null | undefined, box: Rect) {
  let rect = { x: box.x, y: box.y, width: box.width, height: box.height }
  const clips: ReturnType<typeof paddingBox>[] = []
  for (let node = el; node; node = node.parentElement) {
    const style = getComputedStyle(node)
    const clipX = node === el || /^(hidden|clip|scroll|auto)$/.test(style.overflowX)
    const clipY = node === el || /^(hidden|clip|scroll|auto)$/.test(style.overflowY)
    if (!clipX && !clipY) continue
    const clip = paddingBox(node, style)
    const x = clipX ? Math.max(rect.x, clip.rect.x) : rect.x
    const y = clipY ? Math.max(rect.y, clip.rect.y) : rect.y
    const right = clipX
      ? Math.min(rect.x + rect.width, clip.rect.x + clip.rect.width)
      : rect.x + rect.width
    const bottom = clipY
      ? Math.min(rect.y + rect.height, clip.rect.y + clip.rect.height)
      : rect.y + rect.height
    rect = { x, y, width: Math.max(0, right - x), height: Math.max(0, bottom - y) }
    if (clipX && clipY) clips.push(clip)
  }
  const corners = emptyCorners()
  const visible = points(rect)
  for (const clip of clips) {
    const edges = points(clip.rect)
    for (let index = 0; index < 4; index += 1) {
      if (visible[index]!.some((value, axis) => Math.abs(value - edges[index]![axis]!) > 0.5))
        continue
      corners[index]!.x = Math.max(corners[index]!.x, clip.corners[index]!.x)
      corners[index]!.y = Math.max(corners[index]!.y, clip.corners[index]!.y)
    }
  }
  return { rect, corners }
}
