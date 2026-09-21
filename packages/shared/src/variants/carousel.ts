import { tv, type VariantProps } from '../lib/tv'

export const carousel = tv({
  base: 'hn-carousel @container/hn-carousel relative min-w-0 w-full',
  variants: {
    gap: {
      none: '[--hn-carousel-gap:0px]',
      xs: '[--hn-carousel-gap:--spacing(1)]',
      sm: '[--hn-carousel-gap:--spacing(2)]',
      md: '[--hn-carousel-gap:var(--hn-inline-gap)]',
      lg: '[--hn-carousel-gap:--spacing(6)]',
      xl: '[--hn-carousel-gap:--spacing(8)]',
    },
  },
  defaultVariants: { gap: 'md' },
})
export const carouselViewport = tv({
  base: 'hn-carousel-viewport min-w-0 rounded-xl focus-visible:outline-2 focus-visible:outline-accent focus-visible:-outline-offset-2',
})
export const carouselTrack = tv({ base: 'hn-carousel-track flex items-stretch' })
export const carouselItem = tv({ base: 'hn-carousel-item min-w-0 shrink-0 grow-0 basis-full' })
export const carouselControls = tv({
  base: 'mt-3 flex min-h-[var(--hn-control-h-md)] flex-wrap items-center justify-center gap-2',
})
export const carouselIndicators = tv({
  base: 'flex min-w-0 flex-wrap items-center justify-center',
  variants: { custom: { false: 'bg-subtle rounded-full px-1', true: 'gap-1' } },
  defaultVariants: { custom: false },
})
export const carouselIndicator = tv({
  base: 'hn-interactive hn-state-layer hn-press-none relative isolate inline-flex min-h-8 min-w-8 shrink-0 items-center justify-center',
  variants: { custom: { false: 'size-8 rounded-full', true: 'rounded-lg p-1' } },
  defaultVariants: { custom: false },
})
export const carouselDot = tv({
  base: 'bg-line-strong h-1.5 w-1.5 rounded-full transition-[width,background-color] duration-(--hn-duration-base) ease-move data-current:w-6 data-current:bg-accent motion-reduce:transition-none',
})
export const carouselStatus = tv({
  base: 'text-muted flex items-center justify-center py-8 text-sm',
})
export type CarouselGap = NonNullable<VariantProps<typeof carousel>['gap']>
