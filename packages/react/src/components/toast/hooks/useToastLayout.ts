'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import {
  TOAST_CARD_CHROME_BLOCK,
  toastCardHeight,
  toastItemStyle,
  toastLayout,
  type ToastSlot,
} from '../../../../../shared/src/lib/toast-layout'
import type { ToastItem } from '../store'

export { VISIBLE_STACK } from '../../../../../shared/src/lib/toast-layout'

type Id = number | string

export function useToastLayout(items: readonly ToastItem[]) {
  const [heights, setHeights] = useState<ReadonlyMap<Id, number>>(() => new Map())
  const observers = useRef(new Map<Id, { observer: ResizeObserver; el: HTMLElement }>())
  const lastLayout = useRef(new Map<Id, ToastSlot>())
  const refs = useRef(new Map<Id, (el: HTMLElement | null) => void>())

  const openItems = items.filter(item => item.open)
  const layout = toastLayout(openItems, id => heights.get(id))
  for (const [id, slot] of layout) lastLayout.current.set(id, slot)
  const front = openItems.at(-1)
  const frontHeight = front ? (heights.get(front.id) ?? 0) : 0

  function slotOf(item: ToastItem) {
    return layout.get(item.id) ?? lastLayout.current.get(item.id) ?? { index: 0, offset: 0 }
  }

  function itemStyle(item: ToastItem) {
    return toastItemStyle(slotOf(item), heights.get(item.id), frontHeight)
  }

  const record = useCallback((id: Id, height: number) => {
    setHeights(previous =>
      previous.get(id) === height ? previous : new Map(previous).set(id, height),
    )
  }, [])

  function setItemRef(id: Id) {
    let callback = refs.current.get(id)
    if (!callback) {
      callback = (el: HTMLElement | null) => {
        if (!(el instanceof HTMLElement)) return
        const existing = observers.current.get(id)
        if (existing?.el === el) return
        existing?.observer.disconnect()
        const observer = new ResizeObserver(() => flushSync(() => record(id, toastCardHeight(el))))
        observer.observe(el)
        record(id, existing ? toastCardHeight(el) : TOAST_CARD_CHROME_BLOCK)
        observers.current.set(id, { observer, el })
      }
      refs.current.set(id, callback)
    }
    return callback
  }

  const alive = items.map(item => item.id).join('\u0000')
  const count = items.length

  useEffect(() => {
    const ids = new Set(items.map(item => item.id))
    let removed = false
    for (const [id, entry] of observers.current) {
      if (ids.has(id)) continue
      entry.observer.disconnect()
      observers.current.delete(id)
      refs.current.delete(id)
      lastLayout.current.delete(id)
      removed = true
    }
    if (!removed) return
    setHeights(previous => {
      const next = new Map(previous)
      for (const id of previous.keys()) if (!ids.has(id)) next.delete(id)
      return next
    })
  }, [count, alive])

  useEffect(() => {
    const current = observers.current
    return () => {
      for (const entry of current.values()) entry.observer.disconnect()
      current.clear()
    }
  }, [])

  return { slotOf, itemStyle, setItemRef }
}
