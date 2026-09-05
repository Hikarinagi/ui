import { tv, type VariantProps } from '../../lib/tv'

export const formLayoutRoot = tv({
  base: 'm-0 min-w-0 border-0 p-0',
})

export const formLayoutLegend = tv({
  base: 'text-fg p-0 text-base font-medium',
})

export const formLayoutDescription = tv({
  base: 'text-muted mt-1 text-sm',
})

export const formLayoutGrid = tv({
  base: 'grid gap-4',
  variants: {
    columns: {
      1: 'grid-cols-1',
      2: 'grid-cols-1 sm:grid-cols-2',
      3: 'grid-cols-1 sm:grid-cols-3',
      4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    },
    headed: {
      true: 'mt-4',
    },
  },
  defaultVariants: {
    columns: 1,
  },
})

export type FormLayoutVariants = VariantProps<typeof formLayoutGrid>
