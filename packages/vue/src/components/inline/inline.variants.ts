import { tv, type VariantProps } from '../../lib/tv'

export const inline = tv({
  base: 'flex',
  variants: {
    gap: {
      none: 'gap-0',
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-[var(--hn-inline-gap)]',
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
    wrap: {
      true: 'flex-wrap',
      false: 'flex-nowrap',
    },
  },
  defaultVariants: {
    gap: 'md',
    align: 'center',
    wrap: true,
  },
})

export type InlineVariants = VariantProps<typeof inline>
