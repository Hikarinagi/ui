import { tv } from '../../lib/tv'

export const pagination = tv({
  base: 'max-w-full',
})

export const paginationList = tv({
  base: 'flex flex-wrap items-center gap-1',
})

export const paginationItem = tv({
  base: 'tabular-nums',
  variants: {
    size: {
      sm: 'min-w-[var(--hn-control-h-sm)]',
      md: 'min-w-[var(--hn-control-h-md)]',
      lg: 'min-w-[var(--hn-control-h-lg)]',
    },
  },
  defaultVariants: { size: 'md' },
})

export const paginationArrow = tv({
  variants: { dir: { ltr: '', rtl: 'rotate-180' } },
})
