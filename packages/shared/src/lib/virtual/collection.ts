import type { VirtualizeOptions } from '../../types/virtual'

export const VIRTUAL_RECT = { width: 320, height: 320 }

export function finite(value: number | undefined, fallback: number) {
  return value !== undefined && Number.isFinite(value) ? value : fallback
}

export function virtualConfig(config: VirtualizeOptions | undefined) {
  return typeof config === 'object' ? config : {}
}

export function collectionEstimator<T>(
  items: readonly T[],
  config: Exclude<VirtualizeOptions, boolean>,
  estimate?: (item: T) => number,
) {
  return (index: number) =>
    Math.max(1, finite(config.estimateSize, estimate?.(items[index]!) ?? 36))
}

export function collectionOverscan(config: Exclude<VirtualizeOptions, boolean>) {
  return Math.max(0, Math.floor(finite(config.overscan, 6)))
}

export function centeredOffset(
  index: number,
  count: number,
  estimateSize: (index: number) => number,
  viewport = VIRTUAL_RECT.height,
) {
  if (index < 0 || index >= count) return 0
  let offset = (estimateSize(index) - viewport) / 2
  for (let current = 0; current < index; current++) offset += estimateSize(current)
  return Math.max(0, offset)
}

export function mergeRange(
  indexes: readonly number[],
  retained: readonly number[],
  count: number,
  include?: (indexes: number[]) => number[],
) {
  const merged = [...indexes, ...retained]
  return [...new Set([...merged, ...(include?.(merged) ?? [])])]
    .filter(index => index >= 0 && index < count)
    .sort((a, b) => a - b)
}

export function fallbackRect(rect: { width: number; height: number }) {
  return {
    width: rect.width || VIRTUAL_RECT.width,
    height: rect.height || VIRTUAL_RECT.height,
  }
}

export function layoutTop(element: HTMLElement) {
  let top = 0
  for (let node: HTMLElement | null = element; node; node = node.offsetParent as HTMLElement | null)
    top += node.offsetTop
  return top
}

export function scrollMargin(body: HTMLElement, viewport: HTMLElement) {
  return Math.max(0, layoutTop(body) - layoutTop(viewport))
}

export function overscrolledOffset(scrollTop: number, total: number, clientHeight: number) {
  const max = Math.max(0, total - clientHeight)
  return scrollTop > max ? max : undefined
}
