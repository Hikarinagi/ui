import { prefersReducedMotion } from '../motion'

function findViewport(nav: HTMLElement, target: HTMLElement) {
  const doc = nav.ownerDocument
  const view = doc.defaultView!
  for (
    let node: HTMLElement | null = nav;
    node && node !== doc.body && node !== doc.documentElement;
    node = node.parentElement
  ) {
    if (node.contains(target)) break
    if (/^(auto|scroll|overlay)$/.test(view.getComputedStyle(node).overflowY)) return node
  }
}

export interface AnchorFollowInput {
  nav: HTMLElement | null | undefined
  current: string | undefined
  lastCovered: string | undefined
  enabled: boolean
}

export interface AnchorFollowResult {
  viewport: HTMLElement | undefined
}

export function createAnchorFollow() {
  let lastCurrent: string | undefined
  let lastEnd: string | undefined

  function follow({
    nav,
    current: id,
    lastCovered,
    enabled,
  }: AnchorFollowInput): AnchorFollowResult | undefined {
    if (!enabled || !nav || !id) return
    const target = nav.ownerDocument.getElementById(id)
    const link = nav.querySelector<HTMLElement>('a[aria-current="location"]')
    if (!target || !link || !link.getClientRects().length) return
    const port = findViewport(nav, target)
    const result = { viewport: port }
    const endId = lastCovered ?? id
    const changed = lastCurrent !== undefined && (lastCurrent !== id || lastEnd !== endId)
    lastCurrent = id
    lastEnd = endId
    if (!port || port.clientHeight <= 0 || port.scrollHeight <= port.clientHeight) return result

    const box = port.getBoundingClientRect()
    let row: Pick<DOMRect, 'top' | 'bottom' | 'height'> = link.getBoundingClientRect()
    const scale = port.offsetHeight ? box.height / port.offsetHeight : 1
    if (scale <= 0) return result
    if (endId !== id) {
      const end = nav.querySelector<HTMLElement>(`a[href="#${CSS.escape(endId)}"]`)
      if (end?.getClientRects().length) {
        const bottom = end.getBoundingClientRect().bottom
        const height = bottom - row.top
        if (height >= row.height && height <= port.clientHeight * scale)
          row = { top: row.top, bottom, height }
      }
    }
    const top = box.top + port.clientTop * scale
    const bottom = top + port.clientHeight * scale
    if (row.top >= top && row.bottom <= bottom) return result
    if (row.top <= top && row.bottom >= bottom) return result

    const style = port.ownerDocument.defaultView!.getComputedStyle(port)
    const margin = Math.min(row.height / scale / 2, port.clientHeight / 4)
    const padding = (value: string) =>
      Math.min(
        Math.max(0, (port.clientHeight - row.height / scale) / 2),
        value === 'auto'
          ? margin
          : (parseFloat(value) || 0) * (value.endsWith('%') ? port.clientHeight / 100 : 1),
      )
    const before = padding(style.scrollPaddingTop)
    const after = padding(style.scrollPaddingBottom)
    const delta =
      row.height > bottom - top || row.top < top
        ? (row.top - top) / scale - before
        : (row.bottom - bottom) / scale + after
    const next = Math.max(
      0,
      Math.min(port.scrollHeight - port.clientHeight, port.scrollTop + delta),
    )
    if (Math.abs(next - port.scrollTop) < 1) return result
    port.scrollTo({
      top: next,
      behavior: changed && !prefersReducedMotion() ? 'smooth' : 'instant',
    })
    return result
  }

  return { follow }
}
