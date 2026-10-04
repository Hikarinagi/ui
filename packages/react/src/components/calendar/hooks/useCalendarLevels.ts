'use client'

import { useRef, useState, type RefObject } from 'react'
import type { DateValue } from '@internationalized/date'

export type CalendarLevel = 'day' | 'month' | 'year'

export function useCalendarLevels(
  initial: DateValue,
  root: RefObject<HTMLElement | null>,
  onViewChange?: (view: DateValue) => void,
) {
  const [level, setLevelState] = useState<CalendarLevel>('day')
  const [view, setViewState] = useState<DateValue>(initial)
  const levelRef = useRef(level)
  const viewRef = useRef(view)
  const returning = useRef(false)

  function setLevel(next: CalendarLevel) {
    levelRef.current = next
    setLevelState(next)
  }

  function setView(next: DateValue) {
    viewRef.current = next
    setViewState(next)
    onViewChange?.(next)
  }

  function first(next: DateValue | DateValue[] | undefined) {
    return Array.isArray(next) ? next[0] : next
  }

  function toDay() {
    returning.current = true
    setLevel('day')
  }

  function onEntered() {
    if (levelRef.current !== 'day' || !returning.current) return
    returning.current = false
    root.current
      ?.querySelector<HTMLElement>('[data-radix-calendar-cell-trigger][tabindex="0"]')
      ?.focus()
  }

  function pickMonth(next: DateValue | DateValue[] | undefined) {
    const picked = first(next)
    if (!picked) return
    setView(viewRef.current.set({ year: picked.year, month: picked.month }))
    toDay()
  }

  function pickYear(next: DateValue | DateValue[] | undefined) {
    const picked = first(next)
    if (!picked) return
    setView(viewRef.current.set({ year: picked.year }))
    setLevel('month')
  }

  function followYear(date: DateValue) {
    setView(viewRef.current.set({ year: date.year }))
  }

  function back() {
    if (levelRef.current === 'year') setLevel('month')
    else if (levelRef.current === 'month') toDay()
  }

  return { level, setLevel, view, setView, pickMonth, pickYear, followYear, back, onEntered }
}
