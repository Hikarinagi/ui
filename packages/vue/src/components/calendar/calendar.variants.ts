import { tv, type VariantProps } from '../../lib/tv'

export const calendarRoot = tv({
  base: 'text-fg inline-flex flex-col select-none [--hn-calendar-row-gap:--spacing(0.5)] data-disabled:pointer-events-none data-disabled:opacity-50',
  variants: {
    size: {
      sm: 'text-sm [--hn-calendar-cell:var(--hn-control-h-sm)]',
      md: 'text-base [--hn-calendar-cell:var(--hn-control-h-md)]',
      lg: 'text-md [--hn-calendar-cell:var(--hn-control-h-lg)]',
    },
  },
  defaultVariants: { size: 'md' },
})

export const calendarPicker = tv({
  base: 'flex w-[calc(7*var(--hn-calendar-cell))] flex-col gap-2 outline-none',
})

export const calendarHeader = tv({
  base: 'flex items-center justify-between gap-2',
})

export const calendarHeading = tv({
  base: 'min-w-0 flex-1 justify-center font-medium whitespace-nowrap tabular-nums',
  variants: {
    still: {
      true: 'inline-flex h-[var(--hn-calendar-cell)] items-center px-[var(--hn-control-px-sm)]',
    },
  },
})

export const calendarGrid = tv({
  base: 'w-full border-separate [border-spacing:0_var(--hn-calendar-row-gap)]',
  variants: {
    units: {
      true: 'table-fixed border-spacing-0',
    },
  },
})

export const calendarUnits = tv({
  base: 'flex h-[calc(7*var(--hn-calendar-cell)+8*var(--hn-calendar-row-gap))] flex-col justify-center',
})

export const calendarHeadCell = tv({
  base: 'text-muted size-[var(--hn-calendar-cell)] p-0 text-center align-middle font-normal',
  variants: {
    size: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-sm',
    },
  },
  defaultVariants: { size: 'md' },
})

export const calendarCell = tv({
  base: 'p-0 text-center align-middle',
})

export const calendarDay = tv({
  base: [
    'hn-interactive hn-state-layer relative inline-flex size-[var(--hn-calendar-cell)] items-center justify-center rounded-md tabular-nums',
    'data-[outside-view]:text-faint data-[today]:not-[[data-selected]]:text-accent-text data-[today]:not-[[data-selected]]:font-semibold',
    'data-[selected]:bg-accent data-[selected]:text-accent-on data-[selected]:font-medium',
    'data-disabled:text-faint data-disabled:pointer-events-none data-[unavailable]:text-faint data-[unavailable]:line-through data-[unavailable]:pointer-events-none',
  ],
})

export const calendarUnitCell = tv({
  base: 'p-1 align-middle',
})

export const calendarUnit = tv({
  base: [
    'hn-interactive hn-state-layer relative flex h-[var(--hn-calendar-cell)] w-full items-center justify-center rounded-md whitespace-nowrap tabular-nums',
    'data-[today]:not-[[data-selected]]:text-accent-text data-[today]:not-[[data-selected]]:font-semibold',
    'data-[selected]:bg-accent data-[selected]:text-accent-on data-[selected]:font-medium',
    'data-disabled:text-faint data-disabled:pointer-events-none data-[unavailable]:text-faint data-[unavailable]:pointer-events-none',
  ],
})

export type CalendarVariants = VariantProps<typeof calendarRoot>
