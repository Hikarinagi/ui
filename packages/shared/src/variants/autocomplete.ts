import { tv } from '../lib/tv'

export const autocompleteContent = tv({
  base: 'w-[var(--hn-overlay-anchor-width)] max-w-none overflow-hidden',
})

export const autocompleteList = tv({
  base: 'max-h-[min(20rem,var(--hn-overlay-available-height,20rem))]',
})
