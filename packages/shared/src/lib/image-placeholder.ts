export interface Size {
  width: number
  height: number
}

export interface PlaceholderSettle {
  scaleX: number
  scaleY: number
  originX: number
  originY: number
}

const backgroundSizes: Record<string, string> = {
  cover: 'cover',
  contain: 'contain',
  fill: '100% 100%',
  none: 'cover',
  'scale-down': 'contain',
}

function pixels(value: string) {
  return parseFloat(value) || 0
}

function insets(style: CSSStyleDeclaration) {
  return {
    top: pixels(style.paddingTop) + pixels(style.borderTopWidth),
    right: pixels(style.paddingRight) + pixels(style.borderRightWidth),
    bottom: pixels(style.paddingBottom) + pixels(style.borderBottomWidth),
    left: pixels(style.paddingLeft) + pixels(style.borderLeftWidth),
  }
}

export function fitPlaceholder(layer: HTMLElement, img: HTMLImageElement) {
  const style = getComputedStyle(img)
  if (!style.objectFit) return
  const inset = insets(style)
  layer.style.backgroundSize = backgroundSizes[style.objectFit] ?? 'cover'
  layer.style.backgroundPosition = style.objectPosition
  layer.style.backgroundOrigin = 'content-box'
  layer.style.backgroundClip = 'content-box'
  layer.style.padding = `${inset.top}px ${inset.right}px ${inset.bottom}px ${inset.left}px`
}

function positionAxes(value: string) {
  const axes: string[] = []
  let depth = 0
  let start = 0
  for (let i = 0; i <= value.length; i++) {
    const char = value[i]
    if (char === '(') depth++
    else if (char === ')') depth--
    else if ((char === ' ' || char === undefined) && depth === 0) {
      if (i > start) axes.push(value.slice(start, i))
      start = i + 1
    }
  }
  return axes
}

function positionAxis(value: string) {
  const body = value.startsWith('calc(') && value.endsWith(')') ? value.slice(5, -1) : value
  let ratio = 0
  let offset = 0
  for (const term of body
    .replace(/([+-])\s+/g, '$1')
    .trim()
    .split(/\s+/)) {
    const match = /^([+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?)(%|px)$/i.exec(term)
    if (!match) return null
    if (match[2] === '%') ratio += Number(match[1]) / 100
    else offset += Number(match[1])
  }
  return { ratio, offset }
}

function settleOrigin(
  axis: { ratio: number; offset: number },
  box: number,
  from: number,
  to: number,
) {
  const scale = to / from
  if (Math.abs(scale - 1) < 1e-9) return axis.ratio * box + axis.offset
  const start = axis.ratio * (box - from) + axis.offset
  const end = axis.ratio * (box - to) + axis.offset
  return (end - scale * start) / (1 - scale)
}

export function settleScale(input: {
  fit: string
  position: string
  box: Size
  image: Size
  thumb: Size
}): PlaceholderSettle | null {
  const { fit, box, image, thumb } = input
  if (fit !== 'contain' && fit !== 'scale-down') return null
  if (!box.width || !box.height || !image.width || !image.height) return null
  if (!thumb.width || !thumb.height) return null
  const axes = positionAxes(input.position).map(positionAxis)
  const [x, y] = axes
  if (axes.length !== 2 || !x || !y) return null

  let scale = Math.min(box.width / image.width, box.height / image.height)
  if (fit === 'scale-down') scale = Math.min(scale, 1)
  const thumbScale = Math.min(box.width / thumb.width, box.height / thumb.height)
  const from = { width: thumb.width * thumbScale, height: thumb.height * thumbScale }
  const to = { width: image.width * scale, height: image.height * scale }
  const scaleX = to.width / from.width
  const scaleY = to.height / from.height
  if (Math.abs(scaleX - 1) < 1e-3 && Math.abs(scaleY - 1) < 1e-3) return null

  return {
    scaleX,
    scaleY,
    originX: settleOrigin(x, box.width, from.width, to.width),
    originY: settleOrigin(y, box.height, from.height, to.height),
  }
}

export function settlePlaceholder(img: HTMLImageElement, thumb: Size) {
  const style = getComputedStyle(img)
  const inset = insets(style)
  const settle = settleScale({
    fit: style.objectFit,
    position: style.objectPosition,
    box: {
      width: img.clientWidth - pixels(style.paddingLeft) - pixels(style.paddingRight),
      height: img.clientHeight - pixels(style.paddingTop) - pixels(style.paddingBottom),
    },
    image: { width: img.naturalWidth, height: img.naturalHeight },
    thumb,
  })
  if (!settle) return null
  return {
    transform: `scale(${settle.scaleX}, ${settle.scaleY})`,
    transformOrigin: `${inset.left + settle.originX}px ${inset.top + settle.originY}px`,
  }
}
