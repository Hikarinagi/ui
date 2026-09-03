import { tv, type VariantProps } from '../../lib/tv'

export const switchTrack = tv({
  base: [
    'hn-focus-ring hn-state-layer hn-transition-base group/hn-switch relative box-border shrink-0 cursor-pointer',
    'h-[var(--hn-switch-h)] w-[var(--hn-switch-w)] rounded-full border border-transparent',
    'bg-line-strong text-fg disabled:cursor-not-allowed',
    '[--hn-state-selected-color:currentColor] [--hn-state-selected-opacity:0]',
    '[--hn-switch-p:0] [--hn-switch-travel:calc(var(--hn-switch-w)-var(--hn-switch-thumb)-8px)] rtl:[--hn-switch-dir:-1]',
    'data-hn-on:bg-accent data-hn-on:text-accent-on data-hn-on:[--hn-switch-p:1]',
    'data-invalid:border-danger data-invalid:focus-visible:outline-danger',
  ],
  variants: {
    size: {
      sm: '[--hn-switch-h:1.25rem] [--hn-switch-thumb:0.75rem] [--hn-switch-w:2rem]',
      md: '[--hn-switch-h:1.5rem] [--hn-switch-thumb:1rem] [--hn-switch-w:2.5rem]',
      lg: '[--hn-switch-h:1.75rem] [--hn-switch-thumb:1.25rem] [--hn-switch-w:3rem]',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export const switchThumb = tv({
  base: [
    'hn-switch-thumb pointer-events-none absolute top-0.75 start-0.75 box-border block rounded-full',
    'size-[var(--hn-switch-thumb)]',
    '[translate:calc(var(--hn-switch-p)*var(--hn-switch-travel)*var(--hn-switch-dir,1))_0]',
    'border-line bg-surface border shadow-sm',
  ],
})

export type SwitchVariants = VariantProps<typeof switchTrack>
