import { tv, type VariantProps } from '../../lib/tv'

export const empty = tv({
  base: 'flex w-full min-w-0 flex-col items-center justify-center text-center',
  variants: {
    size: {
      sm: 'gap-2 px-4 py-6',
      md: 'gap-3 px-6 py-10',
      lg: 'gap-4 px-8 py-14',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export const emptyIcon = tv({
  base: 'bg-subtle text-muted flex shrink-0 items-center justify-center rounded-full [&_svg]:shrink-0',
  variants: {
    size: {
      sm: 'size-10 [&_svg]:size-5',
      md: 'size-12 [&_svg]:size-6',
      lg: 'size-14 [&_svg]:size-7',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export const emptyText = tv({
  base: 'flex max-w-sm flex-col items-center gap-1',
})

export const emptyTitle = tv({
  base: 'text-fg font-medium text-balance',
  variants: {
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export const emptyDescription = tv({
  base: 'text-muted text-balance',
  variants: {
    size: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-sm',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export const emptyActions = tv({
  base: 'flex flex-wrap items-center justify-center gap-2',
})

export type EmptyVariants = VariantProps<typeof empty>
