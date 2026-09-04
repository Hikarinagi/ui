import { tv } from '../../lib/tv'
import { calendarCell, calendarDay } from '../calendar/calendar.variants'

export const rangeCalendarCell = tv({
  extend: calendarCell,
  base: [
    'first:rounded-s-md last:rounded-e-md',
    'has-[[data-selected]]:bg-accent-soft has-[[data-highlighted]]:bg-accent-soft',
    'has-[[data-selection-start]]:rounded-s-md has-[[data-highlighted-start]]:rounded-s-md',
    'has-[[data-selection-end]]:rounded-e-md has-[[data-highlighted-end]]:rounded-e-md',
  ],
})

export const rangeCalendarDay = tv({
  extend: calendarDay,
  base: [
    'data-[highlighted]:text-accent-text',
    'data-[highlighted]:not-[[data-highlighted-end]]:[--hn-state-hover-opacity:0]',
    'data-[selected]:not-[[data-selection-start]]:not-[[data-selection-end]]:bg-transparent',
    'data-[selected]:not-[[data-selection-start]]:not-[[data-selection-end]]:text-accent-text',
    'data-[selected]:not-[[data-selection-start]]:not-[[data-selection-end]]:font-normal',
    'data-[selected]:[--hn-state-selected-opacity:0]',
  ],
})
