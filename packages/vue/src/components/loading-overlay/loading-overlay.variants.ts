import { tv, type VariantProps } from '../../lib/tv'

export const loadingOverlay = tv({
  base: 'bg-veil flex flex-col items-center justify-center gap-3',
  variants: {
    fixed: {
      true: 'fixed inset-0 z-(--hn-z-overlay)',
      false: 'absolute inset-0 z-10',
    },
  },
  defaultVariants: { fixed: false },
})

export const loadingBlocker = tv({
  base: '',
  variants: {
    fixed: {
      true: 'fixed inset-0 z-(--hn-z-overlay)',
      false: 'absolute inset-0 z-10',
    },
  },
  defaultVariants: { fixed: false },
})

export type LoadingOverlayVariants = VariantProps<typeof loadingOverlay>
