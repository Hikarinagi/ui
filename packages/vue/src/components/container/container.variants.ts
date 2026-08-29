import { tv, type VariantProps } from '../../lib/tv'

export const container = tv({
  base: 'mx-auto w-full px-4 sm:px-6',
  variants: {
    size: {
      sm: 'max-w-3xl',
      md: 'max-w-5xl',
      lg: 'max-w-6xl',
      xl: 'max-w-7xl',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export type ContainerVariants = VariantProps<typeof container>
