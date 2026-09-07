import { tv } from '../../lib/tv'

export const meterGroup = tv({
  base: 'flex w-full min-w-0 flex-col gap-2',
})

export const meterHeader = tv({
  base: 'text-fg flex items-baseline justify-between gap-3 text-sm',
})

export const meterSegment = tv({
  base: 'hn-progress-bar block h-full shrink-0',
  variants: {
    tone: {
      accent: 'bg-accent',
      neutral: 'bg-neutral-solid',
      success: 'bg-success',
      warning: 'bg-warning',
      danger: 'bg-danger',
      info: 'bg-info',
    },
  },
  defaultVariants: {
    tone: 'accent',
  },
})

export const meterLegend = tv({
  base: 'flex flex-wrap gap-x-4 gap-y-1 text-sm',
})

export const meterLegendItem = tv({
  base: 'inline-flex items-center gap-1.5',
})

export const meterValue = tv({
  base: 'text-muted tabular-nums',
})
