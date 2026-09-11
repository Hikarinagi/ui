import { tv, type VariantProps } from '../../lib/tv'

export const listbox = tv({
  base: [
    'flex w-full min-w-0 flex-col overflow-hidden rounded-md data-disabled:opacity-50',
    '[&:not(:focus-within)_[data-highlighted]:not(:hover)]:[--hn-state-hover-opacity:0]',
  ],
  variants: {
    variant: {
      primary: 'border-line bg-surface border shadow-sm',
      secondary: 'bg-inset',
      bare: 'rounded-none border-0 bg-transparent shadow-none',
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
})

export const listboxContent = tv({
  base: 'flex flex-col outline-none',
  variants: {
    padded: { true: 'p-1', false: 'p-0' },
  },
  defaultVariants: { padded: true },
})

export type ListboxVariants = VariantProps<typeof listbox>
