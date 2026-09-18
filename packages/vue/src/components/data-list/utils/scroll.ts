import type { VirtualListScrollOptions } from '../../virtual-list/types'

export function scrollDataListItem(
  element: HTMLElement,
  viewport: HTMLElement | undefined,
  { align = 'auto', behavior }: VirtualListScrollOptions,
) {
  if (!viewport) {
    element.scrollIntoView({ block: align === 'auto' ? 'nearest' : align, behavior })
    return
  }
  const rect = element.getBoundingClientRect()
  const start =
    rect.top - viewport.getBoundingClientRect().top - viewport.clientTop + viewport.scrollTop
  const end = start + rect.height - viewport.clientHeight
  const nearest = Math.min(Math.max(viewport.scrollTop, Math.min(start, end)), Math.max(start, end))
  const offset =
    align === 'start'
      ? start
      : align === 'end'
        ? end
        : align === 'center'
          ? (start + end) / 2
          : nearest
  viewport.scrollTo({ top: offset, behavior })
}
