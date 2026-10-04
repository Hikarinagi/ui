'use client'

import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent } from 'react'
import { flushSync } from 'react-dom'
import {
  SCROLL_SPY_OPTIONS,
  applyIntersections,
  coveredEntries,
  coveredSpan,
  hashTarget,
  jumpToAnchor,
  spyTargets,
  type SpyEntry,
} from '../../../../../shared/src/lib/anchor'

const EMPTY: ReadonlySet<string> = new Set()

export function useScrollSpy<E extends SpyEntry>(entries: E[]) {
  const [visible, setVisibleState] = useState<ReadonlySet<string>>(EMPTY)
  const latest = useRef({ entries, visible })
  latest.current.entries = entries
  const intersecting = useRef(new Set<string>())
  const located = useRef<string | null>(null)

  const setVisible = useCallback((next: ReadonlySet<string>) => {
    latest.current.visible = next
    setVisibleState(next)
  }, [])

  const covered = useMemo(() => coveredEntries(entries, visible), [entries, visible])
  const current = covered[0]?.id
  const span = useMemo(() => coveredSpan(entries, visible), [entries, visible])
  const targetKey = JSON.stringify(entries.map(entry => entry.id))

  useEffect(() => {
    const list = latest.current.entries
    if (located.current === null) {
      const hash = hashTarget(list)
      if (hash) setVisible(new Set([hash]))
    } else if (located.current !== targetKey) setVisible(new Set())
    located.current = targetKey
    intersecting.current.clear()
    if (typeof IntersectionObserver === 'undefined') return
    const targets = spyTargets(list).filter((el): el is HTMLElement => !!el)
    if (!targets.length) return
    const observer = new IntersectionObserver(observed => {
      const now = coveredEntries(latest.current.entries, latest.current.visible)[0]?.id
      flushSync(() => setVisible(applyIntersections(intersecting.current, observed, now)))
    }, SCROLL_SPY_OPTIONS)
    for (const target of targets) observer.observe(target)
    return () => observer.disconnect()
  }, [targetKey, setVisible])

  const jump = useCallback(
    (event: MouseEvent, id: string) => {
      if (jumpToAnchor(event, id)) setVisible(new Set([id]))
    },
    [setVisible],
  )

  return { visible, covered, current, span, jump }
}
