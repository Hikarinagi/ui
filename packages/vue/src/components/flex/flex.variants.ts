import { tv, type VariantProps } from '../../lib/tv'

export const flex = tv({
  base: 'flex',
  variants: {
    direction: {
      row: 'flex-row',
      col: 'flex-col',
      'row-reverse': 'flex-row-reverse',
      'col-reverse': 'flex-col-reverse',
    },
    gap: {
      none: 'gap-0',
      xs: 'gap-1',
      sm: 'gap-2',
      md: '',
      lg: 'gap-6',
      xl: 'gap-8',
    },
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      baseline: 'items-baseline',
      stretch: 'items-stretch',
    },
    justify: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    },
    wrap: {
      true: 'flex-wrap',
      false: 'flex-nowrap',
    },
  },
  compoundVariants: [
    { direction: ['row', 'row-reverse'], gap: 'md', class: 'gap-[var(--hn-inline-gap)]' },
    { direction: ['col', 'col-reverse'], gap: 'md', class: 'gap-[var(--hn-stack-gap)]' },
  ],
  defaultVariants: {
    direction: 'row',
  },
})

export type FlexVariants = VariantProps<typeof flex>
