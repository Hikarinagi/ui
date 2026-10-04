import { prefersReducedMotion } from '../motion'

export interface AnchorItem {
  id: string
  label: string
  children?: AnchorItem[]
}

export type AnchorSlotItem<T extends AnchorItem> =
  T | (T extends { children?: AnchorItem[] } ? NonNullable<T['children']>[number] : never)

export interface SpyEntry {
  id: string
  label: string
  depth: number
}

export interface AnchorEntry<T extends AnchorItem> extends SpyEntry {
  item: AnchorSlotItem<T>
}

export const SCROLL_SPY_OPTIONS = {
  rootMargin: '0px 0px -15% 0px',
  threshold: [0, Number.EPSILON],
}

export function anchorEntries<T extends AnchorItem>(items: T[]): AnchorEntry<T>[] {
  return items.flatMap(item => [
    { id: item.id, label: item.label, depth: 0, item: item as AnchorSlotItem<T> },
    ...(item.children ?? []).map(child => ({
      id: child.id,
      label: child.label,
      depth: 1,
      item: child as AnchorSlotItem<T>,
    })),
  ])
}

export function coveredEntries<E extends SpyEntry>(entries: E[], visible: ReadonlySet<string>) {
  return entries.filter(entry => visible.has(entry.id))
}

export function coveredSpan(entries: SpyEntry[], visible: ReadonlySet<string>) {
  const rows = entries.flatMap((entry, index) => (visible.has(entry.id) ? [index] : []))
  return rows.length ? `${rows[0]! + 1} / ${rows.at(-1)! + 2}` : undefined
}

export function sameTargets(next: SpyEntry[], previous: SpyEntry[]) {
  return (
    next.length === previous.length &&
    next.every((entry, index) => entry.id === previous[index]?.id)
  )
}

export function hashTarget(entries: SpyEntry[]) {
  const hash = decodeURIComponent(location.hash.slice(1))
  return hash && entries.some(entry => entry.id === hash) ? hash : undefined
}

export function spyTargets(entries: SpyEntry[]) {
  return entries.map(({ id }) => document.getElementById(id))
}

export function applyIntersections(
  intersecting: Set<string>,
  observed: IntersectionObserverEntry[],
  current: string | undefined,
): ReadonlySet<string> {
  for (const entry of observed) {
    if (entry.isIntersecting && entry.intersectionRatio > 0) intersecting.add(entry.target.id)
    else intersecting.delete(entry.target.id)
  }
  return intersecting.size ? new Set(intersecting) : new Set(current ? [current] : [])
}

export function jumpToAnchor(event: { preventDefault(): void }, id: string) {
  const el = document.getElementById(id)
  if (!el) return false
  event.preventDefault()
  el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
  history.replaceState(history.state, '', `#${id}`)
  return true
}
