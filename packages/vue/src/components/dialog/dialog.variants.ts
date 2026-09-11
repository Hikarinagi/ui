import { tv, type VariantProps } from '../../lib/tv'

export const dialogWrapper = tv({
  base: '',
  variants: {
    placement: {
      center: 'place-items-center p-4',
      bottom: 'items-end justify-items-center p-4',
      auto: 'place-items-center p-4 max-sm:items-end max-sm:justify-items-stretch',
    },
  },
  defaultVariants: { placement: 'auto' },
})

export const dialogCard = tv({
  base: '',
  variants: {
    placement: {
      center: 'hn-anim-modal',
      bottom: 'hn-anim-sheet-bottom',
      auto: 'hn-anim-modal max-sm:hn-anim-sheet-bottom max-sm:max-w-none',
    },
    size: {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-xl',
      xl: 'max-w-2xl',
      '2xl': 'max-w-4xl',
    },
  },
  defaultVariants: { placement: 'auto', size: 'md' },
})

export type DialogVariants = VariantProps<typeof dialogCard>
