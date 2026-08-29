import { tv, type VariantProps } from '../../lib/tv'

export const simpleGrid = tv({
  base: 'grid',
  variants: {
    fit: {
      false: 'grid-cols-[repeat(auto-fill,minmax(var(--hn-simple-grid-min),1fr))]',
      true: 'grid-cols-[repeat(auto-fit,minmax(var(--hn-simple-grid-min),1fr))]',
    },
    gap: {
      none: 'gap-0',
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-x-[var(--hn-inline-gap)] gap-y-[var(--hn-stack-gap)]',
      lg: 'gap-6',
      xl: 'gap-8',
    },
  },
  defaultVariants: {
    fit: false,
    gap: 'md',
  },
})

export type SimpleGridVariants = VariantProps<typeof simpleGrid>
