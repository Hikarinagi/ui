import { tv, type VariantProps } from '../lib/tv'

export const masonry = tv({
  base: 'relative w-full min-w-0',
  variants: {
    gap: {
      none: '[--hn-masonry-gap:0px] [--hn-masonry-row-gap:0px]',
      xs: '[--hn-masonry-gap:var(--spacing)] [--hn-masonry-row-gap:var(--spacing)]',
      sm: '[--hn-masonry-gap:calc(var(--spacing)*2)] [--hn-masonry-row-gap:calc(var(--spacing)*2)]',
      md: '[--hn-masonry-gap:var(--hn-inline-gap)] [--hn-masonry-row-gap:var(--hn-stack-gap)]',
      lg: '[--hn-masonry-gap:calc(var(--spacing)*6)] [--hn-masonry-row-gap:calc(var(--spacing)*6)]',
      xl: '[--hn-masonry-gap:calc(var(--spacing)*8)] [--hn-masonry-row-gap:calc(var(--spacing)*8)]',
    },
  },
  defaultVariants: { gap: 'md' },
})
export const masonryList = tv({
  base: 'hn-masonry-list relative m-0 grid list-none items-start gap-x-[var(--hn-masonry-gap)] gap-y-[var(--hn-masonry-row-gap)] p-0',
})
export const masonryMeasure = tv({
  base: 'pointer-events-none invisible absolute start-0 top-0 h-[var(--hn-masonry-row-gap)] w-[var(--hn-masonry-gap)]',
})
export const masonryItem = tv({ base: 'hn-masonry-item flow-root min-w-0' })
export const masonryStatus = tv({
  base: 'text-muted flex items-center justify-center gap-2 py-8 text-sm',
})
export type MasonryGap = NonNullable<VariantProps<typeof masonry>['gap']>
