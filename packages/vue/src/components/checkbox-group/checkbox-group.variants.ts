import { tv, type VariantProps } from '../../lib/tv'

export const checkboxGroup = tv({
  base: 'flex min-w-0',
  variants: {
    block: { true: 'w-full' },
    orientation: {
      vertical: 'flex-col gap-2',
      horizontal: 'flex-row flex-wrap gap-x-[var(--hn-inline-gap)] gap-y-2',
    },
  },
  defaultVariants: {
    orientation: 'vertical',
  },
})

export const checkboxGroupItem = tv({
  variants: {
    orientation: { vertical: '', horizontal: '' },
    block: { true: '' },
  },
  compoundVariants: [{ orientation: 'horizontal', block: true, class: 'flex-1' }],
})

export type CheckboxGroupVariants = VariantProps<typeof checkboxGroup>
