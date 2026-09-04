import { tv } from '../../lib/tv'

export const multiComboboxHost = tv({
  base: '',
  variants: {
    clearing: {
      true: 'pe-[calc(2*var(--hn-input-h))]',
    },
  },
})

export const multiComboboxEnd = tv({
  base: 'absolute inset-y-0 end-0 flex items-stretch',
})
