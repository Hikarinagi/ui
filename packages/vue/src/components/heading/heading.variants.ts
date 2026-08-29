import { tv, type VariantProps } from '../../lib/tv'

export const heading = tv({
  base: 'text-fg',
  variants: {
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      md: 'text-md',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
    },
    truncate: {
      true: 'truncate',
    },
  },
  compoundVariants: [{ size: ['xl', '2xl'], class: 'tracking-tight' }],
  defaultVariants: {
    weight: 'semibold',
  },
})

export type HeadingVariants = VariantProps<typeof heading>
