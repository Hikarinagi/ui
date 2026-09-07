import { tv, type VariantProps } from '../../lib/tv'

export const statistic = tv({
  base: 'flex min-w-0 items-start justify-between gap-4',
})

export const statisticBody = tv({
  base: 'flex min-w-0 flex-col gap-1',
})

export const statisticLabel = tv({
  base: 'text-muted text-sm',
})

export const statisticValue = tv({
  base: 'text-fg flex items-baseline gap-1 font-semibold tracking-tight tabular-nums',
  variants: {
    size: {
      sm: 'text-xl',
      md: 'text-2xl',
      lg: 'text-3xl',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export const statisticAffix = tv({
  base: 'text-muted text-sm font-normal',
})

export const statisticDelta = tv({
  base: 'flex flex-wrap items-center gap-x-1 text-sm whitespace-nowrap [&_svg]:size-4 [&_svg]:shrink-0',
  variants: {
    tone: {
      success: 'text-success-text',
      danger: 'text-danger-text',
      neutral: 'text-muted',
    },
  },
  defaultVariants: {
    tone: 'neutral',
  },
})

export const statisticIcon = tv({
  base: 'bg-subtle text-muted flex size-10 shrink-0 items-center justify-center rounded-md [&_svg]:size-5',
})

export type StatisticVariants = VariantProps<typeof statisticValue>
