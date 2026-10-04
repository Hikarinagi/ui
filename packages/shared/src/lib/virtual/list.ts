import { VIRTUAL_RECT } from './collection'

export function nonnegative(value: number) {
  return Number.isFinite(value) ? Math.max(0, value) : 0
}

export function listEstimator<T>(
  items: readonly T[],
  estimate: number | ((item: T, index: number) => number) | undefined,
) {
  const value = estimate ?? 48
  return (index: number) =>
    Math.max(1, nonnegative(typeof value === 'function' ? value(items[index]!, index) : value))
}

export function listInitialRect(
  initialRect: { width: number; height: number } | undefined,
  height: number | string | undefined,
) {
  return (
    initialRect ?? {
      width: VIRTUAL_RECT.width,
      height: typeof height === 'number' ? height : VIRTUAL_RECT.height,
    }
  )
}

export function retainIndex(indexes: number[], retained: number) {
  if (retained >= 0 && !indexes.includes(retained)) indexes.push(retained)
  return indexes.sort((a, b) => a - b)
}

export function listContentStyle(flow: { before: number; after: number }, horizontal: boolean) {
  const { before: start, after: end } = flow
  return horizontal
    ? {
        width: 'max-content',
        height: '100%',
        paddingInlineStart: `${start}px`,
        paddingInlineEnd: `${end}px`,
      }
    : { width: '100%', paddingBlockStart: `${start}px`, paddingBlockEnd: `${end}px` }
}

export function listRootStyle(height: number | string | undefined) {
  return { height: typeof height === 'string' ? height : `${height ?? VIRTUAL_RECT.height}px` }
}

export function listItemStyle(
  entry: { gapBefore: number; size: number },
  horizontal: boolean,
  dynamic: boolean | undefined,
) {
  return horizontal
    ? {
        marginInlineStart: `${entry.gapBefore}px`,
        width: dynamic === false ? `${entry.size}px` : undefined,
      }
    : {
        marginBlockStart: `${entry.gapBefore}px`,
        height: dynamic === false ? `${entry.size}px` : undefined,
      }
}
