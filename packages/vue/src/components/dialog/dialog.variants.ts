import { tv, type VariantProps } from '../../lib/tv'

export const dialogWrapper = tv({
  base: 'pointer-events-none fixed inset-0 z-(--hn-z-overlay) grid',
  variants: {
    placement: {
      center: 'place-items-center p-4',
      top: 'items-start justify-items-center p-4',
      bottom: 'items-end justify-items-center p-4',
      auto: 'place-items-center p-4 max-sm:items-end max-sm:justify-items-stretch',
    },
  },
  defaultVariants: { placement: 'auto' },
})

export const dialogCard = tv({
  base: 'pointer-events-auto flex w-full flex-col shadow-lg outline-none',
  variants: {
    padded: { true: 'gap-4 py-(--hn-panel-p)' },
    fitViewport: { true: 'max-h-[calc(100dvh-2rem)]' },
    placement: {
      center: 'hn-anim-modal',
      top: 'hn-anim-sheet-top',
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
  defaultVariants: { placement: 'auto', size: 'md', padded: true },
})

export type DialogVariants = VariantProps<typeof dialogCard>
