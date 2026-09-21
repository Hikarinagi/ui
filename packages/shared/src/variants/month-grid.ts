import { tv, type VariantProps } from '../lib/tv'

export const monthGrid = tv({
  base: '@container/hn-month-grid bg-surface text-fg border-line w-full min-w-0 overflow-clip rounded-xl border',
  variants: {
    size: {
      sm: '[--hn-calendar-cell:var(--hn-control-h-sm)] [--hn-month-grid-cell:--spacing(16)] text-sm',
      md: '[--hn-calendar-cell:var(--hn-control-h-md)] [--hn-month-grid-cell:--spacing(24)] text-sm',
      lg: '[--hn-calendar-cell:var(--hn-control-h-lg)] [--hn-month-grid-cell:--spacing(32)] text-base',
    },
  },
  defaultVariants: { size: 'md' },
})
export const monthGridHeader = tv({ base: 'flex min-w-0 flex-wrap items-center gap-2 p-3' })
export const monthGridActions = tv({
  base: 'flex min-w-0 flex-wrap items-center gap-2 @max-[520px]/hn-month-grid:basis-full',
})
export const monthGridTable = tv({ base: 'w-full table-fixed border-collapse' })
export const monthGridWeekday = tv({
  base: 'text-muted border-line border-b px-1 py-2 text-center text-xs font-normal',
})
export const monthGridCell = tv({
  base: 'border-line border-e border-b p-0 align-top last:border-e-0 [overflow-wrap:anywhere]',
})
export const monthGridDay = tv({
  base: 'flex min-h-[var(--hn-month-grid-cell)] min-w-0 flex-col gap-1 [--hn-month-grid-default-padding:--spacing(1)] @min-[400px]/hn-month-grid:[--hn-month-grid-default-padding:--spacing(2)] p-[var(--hn-month-grid-padding,var(--hn-month-grid-default-padding))]',
})
export const monthGridDayHeader = tv({
  base: 'flex min-w-0 items-center justify-between gap-1',
})
export const monthGridDate = tv({
  base: 'inline-flex size-6 shrink-0 items-center justify-center rounded-full text-sm tabular-nums data-[outside]:text-faint data-disabled:text-faint data-[today]:bg-accent-soft data-[today]:text-accent-text data-[today]:font-medium',
})
export type MonthGridSize = NonNullable<VariantProps<typeof monthGrid>['size']>
