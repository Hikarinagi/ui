import type { MonthGridSize } from './month-grid.variants'

export interface MonthGridProps {
  month?: string
  dir?: 'ltr' | 'rtl'
  min?: string
  max?: string
  today?: string
  timeZone?: string
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  weekdayFormat?: 'narrow' | 'short' | 'long'
  fixedWeeks?: boolean
  showOutsideDays?: boolean
  showToday?: boolean
  showHeader?: boolean
  disabled?: boolean
  size?: MonthGridSize
  dayMinHeight?: number | string
  dayPadding?: number | string
  cellClass?: string | ((day: MonthGridDay) => string | undefined)
  dayClass?: string | ((day: MonthGridDay) => string | undefined)
  label?: string
  class?: string
}

export interface MonthGridDay {
  date: string
  day: number
  dayLabel: string
  weekday: 0 | 1 | 2 | 3 | 4 | 5 | 6
  label: string
  isToday: boolean
  isPast: boolean
  isFuture: boolean
  isOutside: boolean
  isDisabled: boolean
}

export interface MonthGridRange {
  month: string
  start: string
  end: string
}

export interface MonthGridHeader extends MonthGridRange {
  label: string
  canPrev: boolean
  canNext: boolean
  canToday: boolean
  prev: () => void
  next: () => void
  goToToday: () => void
}

export interface MonthGridWeekday {
  day: number
  label: string
  fullLabel: string
}

export interface MonthGridExpose {
  range: MonthGridRange
  prev: () => void
  next: () => void
  goToToday: () => void
}
