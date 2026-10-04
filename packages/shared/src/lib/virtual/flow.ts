export interface VirtualSpan {
  start: number
  end: number
}

export type VirtualFlowEntry<T extends VirtualSpan> = T & { gapBefore: number }

export function virtualFlow<T extends VirtualSpan>(items: readonly T[], total: number, margin = 0) {
  return {
    entries: items.map((item, index): VirtualFlowEntry<T> => ({
      ...item,
      gapBefore: index ? Math.max(0, item.start - items[index - 1]!.end) : 0,
    })),
    before: Math.max(0, (items[0]?.start ?? margin) - margin),
    after: Math.max(0, total - ((items.at(-1)?.end ?? margin) - margin)),
  }
}

export function measuredSize(size: number, cached: number | undefined, estimate: () => number) {
  return size > 0 ? size : (cached ?? estimate())
}

export function scrollPosition(
  offset: number,
  adjustments: number,
  horizontal: boolean | undefined,
  rtl: boolean | undefined,
) {
  return {
    [horizontal ? 'left' : 'top']: (offset + adjustments) * (horizontal && rtl ? -1 : 1),
  } as { left?: number; top?: number }
}
