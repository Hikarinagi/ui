'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import { usePaginationContext } from '../context'

export function usePaginationJump() {
  const context = usePaginationContext()
  const [draft, setDraft] = useState(() => String(context.state.page))
  const latest = useRef(context)
  latest.current = context
  const reset = () => setDraft(String(latest.current.state.page))
  const page = context.state.page
  const blocked = context.blocked
  const previousPage = useRef(page)
  const previousBlocked = useRef(blocked)

  useLayoutEffect(() => {
    if (Object.is(previousPage.current, page)) return
    previousPage.current = page
    reset()
  }, [page])

  useLayoutEffect(() => {
    if (Object.is(previousBlocked.current, blocked)) return
    previousBlocked.current = blocked
    if (blocked) reset()
  }, [blocked])

  function commit() {
    if (context.blocked) return reset()
    const value = Number(draft.trim())
    if (!draft.trim() || !Number.isFinite(value)) return reset()
    const next = Math.min(context.state.pageCount, Math.max(1, Math.trunc(value)))
    setDraft(String(next))
    context.update(next)
  }

  return { draft, setDraft, commit, reset, size: context.size, blocked: context.blocked }
}
