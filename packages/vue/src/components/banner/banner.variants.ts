import { tv, type VariantProps } from '../../lib/tv'

export const banner = tv({
  base: 'hn-transition-base grid w-full grid-cols-[1fr_auto] items-center gap-3 px-4 py-2.5 text-sm sm:grid-cols-[1fr_auto_1fr] [&_a]:[--hn-link-color:currentColor]',
  variants: {
    tone: {
      neutral: 'bg-neutral-solid text-neutral-solid-on',
      accent: 'bg-accent text-accent-on',
      info: 'bg-info text-info-on',
      success: 'bg-success text-success-on',
      warning: 'bg-warning text-warning-on',
      danger: 'bg-danger text-danger-on',
    },
  },
  defaultVariants: { tone: 'accent' },
})

export const bannerContent = tv({
  base: 'flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 sm:col-start-2 sm:justify-center sm:text-center',
})

export const bannerIcon = tv({
  base: 'size-4 shrink-0',
})

export const bannerActions = tv({
  base: 'flex shrink-0 items-center gap-2',
})

export const bannerItem = tv({
  base: 'flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 sm:justify-center',
})

export const bannerControls = tv({
  base: 'col-start-2 -my-1 -me-1 flex shrink-0 items-center gap-1 justify-self-end sm:col-start-3',
})

export const bannerCounter = tv({
  base: 'text-xs tabular-nums',
})

const slideForward = {
  enterFrom: 'opacity-0 translate-x-4 rtl:-translate-x-4',
  leaveTo: 'opacity-0 -translate-x-4 rtl:translate-x-4',
}

export const bannerSlide = {
  forward: slideForward,
  backward: { enterFrom: slideForward.leaveTo, leaveTo: slideForward.enterFrom },
}

export type BannerVariants = VariantProps<typeof banner>
