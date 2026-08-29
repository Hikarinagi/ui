import { tv, type VariantProps } from '../../lib/tv'

export const stack = tv({
  base: 'flex flex-col',
  variants: {
    gap: {
      none: 'gap-0',
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-[var(--hn-stack-gap)]',
      lg: 'gap-6',
      xl: 'gap-8',
    },
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
    },
  },
  defaultVariants: {
    gap: 'md',
  },
})

export type StackVariants = VariantProps<typeof stack>
