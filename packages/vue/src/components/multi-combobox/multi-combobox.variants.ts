import { tv } from '../../lib/tv'

export const multiComboboxHost = tv({
  base: [
    '[--hn-multi-combobox-end:calc(--spacing(2)+var(--hn-input-icon)+var(--hn-input-px))]',
    'pe-[calc(var(--hn-multi-combobox-end)+var(--hn-multi-combobox-clear,0px))]',
  ],
  variants: {
    size: {
      sm: '[--hn-multi-combobox-close:--spacing(5)]',
      md: '[--hn-multi-combobox-close:var(--hn-control-h-sm)]',
      lg: '[--hn-multi-combobox-close:var(--hn-control-h-md)]',
    },
    clearing: {
      true: '[--hn-multi-combobox-clear:calc(var(--hn-multi-combobox-close)+--spacing(2))]',
    },
  },
  defaultVariants: { size: 'md' },
})

export const multiComboboxEnd = tv({
  base: 'absolute inset-y-0 end-0 flex items-center',
})

export const multiComboboxClear = tv({
  base: 'flex shrink-0 items-center ps-2',
})
