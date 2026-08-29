import { tv, type VariantProps } from '../../lib/tv'

export const card = tv({
  base: 'bg-surface border-line block rounded-lg border shadow-sm',
  variants: {
    padded: {
      true: 'p-[var(--hn-panel-p)]',
    },
  },
  defaultVariants: {
    padded: true,
  },
})

export type CardVariants = VariantProps<typeof card>
