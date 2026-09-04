import { ref, shallowRef, type Ref } from 'vue'
import type { DateValue } from '@internationalized/date'

export type CalendarLevel = 'day' | 'month' | 'year'

export function useCalendarLevels(initial: DateValue, root: Ref<{ $el: HTMLElement } | null>) {
  const level = ref<CalendarLevel>('day')
  const view = shallowRef<DateValue>(initial)
  const returning = ref(false)

  function first(next: DateValue | DateValue[] | undefined) {
    return Array.isArray(next) ? next[0] : next
  }

  function toDay() {
    returning.value = true
    level.value = 'day'
  }

  function onEntered() {
    if (level.value !== 'day' || !returning.value) return
    returning.value = false
    root.value?.$el
      .querySelector<HTMLElement>('[data-reka-calendar-cell-trigger][tabindex="0"]')
      ?.focus()
  }

  function pickMonth(next: DateValue | DateValue[] | undefined) {
    const picked = first(next)
    if (!picked) return
    view.value = view.value.set({ year: picked.year, month: picked.month })
    toDay()
  }

  function pickYear(next: DateValue | DateValue[] | undefined) {
    const picked = first(next)
    if (!picked) return
    view.value = view.value.set({ year: picked.year })
    level.value = 'month'
  }

  function followYear(date: DateValue) {
    view.value = view.value.set({ year: date.year })
  }

  function back() {
    if (level.value === 'year') level.value = 'month'
    else if (level.value === 'month') toDay()
  }

  return { level, view, pickMonth, pickYear, followYear, back, onEntered }
}
