import { tv, type VariantProps } from '../../lib/tv'

export const progress = tv({
  base: 'flex w-full min-w-0 flex-col gap-1.5',
})

export const progressHeader = tv({
  base: 'text-fg flex items-baseline justify-between gap-3 text-sm',
})

export const progressValue = tv({
  base: 'text-muted ms-auto tabular-nums',
})

export const progressTrack = tv({
  base: 'bg-line-strong relative w-full overflow-hidden rounded-full rtl:[--hn-progress-dir:-1]',
  variants: {
    size: {
      sm: 'h-1',
      md: 'h-2',
      lg: 'h-3',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export const progressBar = tv({
  base: 'hn-progress-bar block h-full w-[calc(var(--hn-progress-p,0)*100%)] rounded-full',
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

export type ProgressVariants = VariantProps<typeof progressTrack> & VariantProps<typeof progressBar>
