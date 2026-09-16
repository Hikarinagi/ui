import { tv } from '../../lib/tv'

export const navigationMenu = tv({
  base: 'relative w-fit max-w-full',
})

export const navigationMenuList = tv({
  base: 'm-0 flex list-none gap-1 p-0',
  variants: {
    orientation: {
      horizontal: 'flex-wrap items-center',
      vertical: 'flex-col items-stretch',
    },
  },
})

export const navigationMenuControl = tv({
  base: [
    'hn-interactive hn-state-layer hn-press-none relative isolate flex cursor-pointer items-center',
    'text-fg gap-(--hn-control-gap) rounded-md text-start font-medium no-underline outline-none select-none [&_svg]:shrink-0',
    'data-[state=open]:bg-inset data-active:text-accent-text data-active:bg-accent-soft',
    'data-disabled:pointer-events-none data-disabled:opacity-50',
  ],
  variants: {
    size: {
      sm: 'min-h-(--hn-control-h-sm) px-(--hn-control-px-sm) text-xs [&_svg]:size-3.5',
      md: 'min-h-(--hn-control-h-md) px-(--hn-control-px-md) text-sm [&_svg]:size-4',
      lg: 'min-h-(--hn-control-h-lg) px-(--hn-control-px-lg) text-base [&_svg]:size-[1.125rem]',
    },
    orientation: {
      horizontal: '',
      vertical: 'w-full',
    },
  },
  defaultVariants: { size: 'md' },
})

export const navigationMenuTrigger = tv({
  base: 'group/hn-disclosure',
})

export const navigationMenuIcon = tv({
  base: 'inline-flex shrink-0 items-center justify-center gap-1',
})

export const navigationMenuDisclosure = tv({
  base: 'inline-flex shrink-0 text-muted',
  variants: {
    orientation: { horizontal: '', vertical: 'rtl:-scale-x-100' },
  },
})

export const navigationMenuLink = tv({
  base: 'py-2',
})

export const navigationMenuContent = tv({
  base: 'hn-anim-navigation-content absolute start-0 top-0 w-80 max-w-[min(calc(100vw-2rem),var(--hn-navigation-max-width,100vw))] outline-none rtl:start-auto rtl:end-0',
  variants: {
    padded: { true: 'p-2', false: '' },
  },
  defaultVariants: { padded: true },
})

export const navigationMenuViewport = tv({
  base: [
    'hn-navigation-viewport bg-surface border-line absolute z-(--hn-z-overlay) overflow-hidden rounded-lg border shadow-md',
    'h-(--reka-navigation-menu-viewport-height) w-(--reka-navigation-menu-viewport-width)',
  ],
  variants: {
    orientation: {
      horizontal:
        'top-full mt-2 [left:clamp(var(--hn-navigation-min-x,0px),var(--reka-navigation-menu-viewport-left),calc(var(--hn-navigation-bound-end,100vw)-var(--reka-navigation-menu-viewport-width)-2px))]',
      vertical: '[top:var(--reka-navigation-menu-viewport-top)]',
    },
    side: { start: '', end: '' },
  },
  compoundVariants: [
    { orientation: 'vertical', side: 'end', class: 'start-full ms-2' },
    { orientation: 'vertical', side: 'start', class: 'end-full me-2' },
  ],
})
