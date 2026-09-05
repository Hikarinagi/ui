import { tv, type VariantProps } from '../../lib/tv'

export const ratingRoot = tv({
  base: 'inline-flex items-center gap-0.5 data-disabled:pointer-events-none data-disabled:opacity-50',
  variants: {
    size: {
      sm: '[--hn-rating-size:--spacing(4)]',
      md: '[--hn-rating-size:--spacing(5)]',
      lg: '[--hn-rating-size:--spacing(6)]',
    },
  },
  defaultVariants: { size: 'md' },
})

export const ratingItem = tv({
  base: [
    'relative inline-flex size-[var(--hn-rating-size)] shrink-0 rounded-xs',
    'has-[:focus-visible]:[outline:var(--hn-focus-ring-width)_solid_var(--hn-focus-ring)] has-[:focus-visible]:[outline-offset:var(--hn-focus-ring-offset)]',
  ],
})

export const ratingStep = tv({
  base: [
    'group/hn-rating-step absolute inset-y-0 start-0 cursor-pointer overflow-hidden outline-none',
    '[width:var(--reka-rating-item-step-width)] [opacity:var(--reka-rating-item-step-opacity)] [z-index:var(--reka-rating-item-step-z-index)]',
    'disabled:cursor-not-allowed',
  ],
})

export const ratingStar = tv({
  base: 'text-line-strong size-[var(--hn-rating-size)] shrink-0 fill-transparent transition-[color,fill] duration-(--hn-duration-fast) ease-(--hn-ease-enter)',
  variants: {
    active: {
      true: 'text-warning fill-current',
      false:
        'group-data-[state=active]/hn-rating-step:text-warning group-data-[state=active]/hn-rating-step:fill-current',
    },
  },
  defaultVariants: { active: false },
})

export const ratingFill = tv({
  base: 'absolute inset-y-0 start-0 overflow-hidden',
})

export type RatingVariants = VariantProps<typeof ratingRoot>
