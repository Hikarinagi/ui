import { tv, type VariantProps } from '../../lib/tv'

export const ringProgress = tv({
  base: 'inline-flex flex-col items-center gap-1.5',
})

export const ringProgressRoot = tv({
  base: 'relative shrink-0',
  variants: {
    size: {
      sm: 'size-10 text-xs',
      md: 'size-16 text-sm',
      lg: 'size-24 text-lg',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export const ringProgressSvg = tv({
  base: 'hn-ring-spin size-full -rotate-90',
})

export const ringProgressTrack = tv({
  base: 'stroke-line-strong fill-none',
})

export const ringProgressArc = tv({
  base: 'hn-ring-arc fill-none',
  variants: {
    tone: {
      accent: 'stroke-accent',
      neutral: 'stroke-neutral-solid',
      success: 'stroke-success',
      warning: 'stroke-warning',
      danger: 'stroke-danger',
      info: 'stroke-info',
    },
  },
  defaultVariants: {
    tone: 'accent',
  },
})

export const ringProgressCenter = tv({
  base: 'text-fg absolute inset-0 flex items-center justify-center tabular-nums',
})

export const ringProgressLabel = tv({
  base: 'text-muted text-sm',
})

export type RingProgressVariants = VariantProps<typeof ringProgressRoot> &
  VariantProps<typeof ringProgressArc>
