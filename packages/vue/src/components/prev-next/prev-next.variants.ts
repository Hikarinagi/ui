import { tv, type VariantProps } from '../../lib/tv'

export const prevNextLink = tv({
  base: [
    'hn-interactive hn-state-layer hn-press-lg flex flex-col gap-1 rounded-lg p-4 text-start',
    'bg-surface border-line border shadow-sm',
  ],
  variants: {
    direction: {
      prev: 'items-start',
      next: 'items-end text-end sm:col-start-2',
    },
  },
  defaultVariants: { direction: 'next' },
})

export const prevNextEyebrow = tv({
  base: 'text-muted inline-flex items-center gap-1 text-sm',
  variants: {
    direction: {
      prev: '',
      next: 'flex-row-reverse',
    },
  },
  defaultVariants: { direction: 'next' },
})

export type PrevNextVariants = VariantProps<typeof prevNextLink>
