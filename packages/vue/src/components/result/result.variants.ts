import { tv, type VariantProps } from '../../lib/tv'

export const resultIcon = tv({
  base: 'flex shrink-0 items-center justify-center rounded-full [&_svg]:shrink-0',
  variants: {
    status: {
      success: 'bg-success-soft text-success-text',
      error: 'bg-danger-soft text-danger-text',
      warning: 'bg-warning-soft text-warning-text',
      info: 'bg-info-soft text-info-text',
    },
    size: {
      sm: 'size-12 [&_svg]:size-6',
      md: 'size-14 [&_svg]:size-7',
      lg: 'size-18 [&_svg]:size-9',
    },
  },
  defaultVariants: {
    status: 'info',
    size: 'md',
  },
})

export type ResultVariants = VariantProps<typeof resultIcon>
