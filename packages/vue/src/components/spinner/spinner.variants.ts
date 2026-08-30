import { tv, type VariantProps } from '../../lib/tv'

export const spinner = tv({
  base: 'inline-block shrink-0 rounded-full border-current border-e-transparent align-[-0.125em]',
  variants: {
    size: {
      sm: 'size-3.5 border-[1.5px]',
      md: 'size-4 border-2',
      lg: 'size-5 border-2',
    },
  },
  defaultVariants: { size: 'md' },
})

export type SpinnerVariants = VariantProps<typeof spinner>
