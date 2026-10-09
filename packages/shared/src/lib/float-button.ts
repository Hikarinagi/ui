export type FloatButtonLength = number | string

export type FloatButtonOffset = FloatButtonLength | { x?: FloatButtonLength; y?: FloatButtonLength }

function length(value: FloatButtonLength | undefined) {
  if (typeof value !== 'number') return value
  return Number.isFinite(value) ? `${Math.max(0, value)}px` : undefined
}

export function floatButtonOffset(offset: FloatButtonOffset | undefined) {
  if (typeof offset === 'object' && offset !== null)
    return { '--hn-float-offset-x': length(offset.x), '--hn-float-offset-y': length(offset.y) }
  return { '--hn-float-offset': length(offset) }
}
