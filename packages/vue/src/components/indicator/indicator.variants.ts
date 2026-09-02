import { tv, type VariantProps } from '../../lib/tv'

export const indicator = tv({
  base: 'relative inline-flex shrink-0 rounded-full align-middle',
  variants: {
    tone: {
      accent: 'bg-accent',
      neutral: 'bg-neutral-solid',
      success: 'bg-success',
      warning: 'bg-warning',
      danger: 'bg-danger',
      info: 'bg-info',
    },
    size: {
      sm: 'size-1.5',
      md: 'size-2',
      lg: 'size-2.5',
    },
  },
  defaultVariants: {
    tone: 'neutral',
    size: 'md',
  },
})

export type IndicatorVariants = VariantProps<typeof indicator>
