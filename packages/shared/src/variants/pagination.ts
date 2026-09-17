import { tv } from '../lib/tv'

export const pagination = tv({
  base: 'flex w-full shrink-0 flex-wrap items-center gap-x-4 gap-y-3',
  variants: {
    align: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
    },
  },
})

export const paginationList = tv({
  base: 'relative isolate flex max-w-full flex-wrap items-center gap-1',
})

export const paginationItem = tv({
  base: 'min-w-0 px-0 tabular-nums [&>span]:min-w-0',
  variants: {
    size: {
      sm: 'size-[var(--hn-control-h-sm)]',
      md: 'size-[var(--hn-control-h-md)]',
      lg: 'size-[var(--hn-control-h-lg)]',
    },
    selected: { true: 'bg-accent text-accent-on' },
  },
  defaultVariants: { size: 'md' },
})

export const paginationArrow = tv({ variants: { dir: { ltr: '', rtl: 'rotate-180' } } })
