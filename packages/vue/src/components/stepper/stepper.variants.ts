import { tv } from '../../lib/tv'

export const stepper = tv({
  base: 'flex w-full min-w-0 flex-col gap-(--hn-stack-gap)',
  variants: {
    size: {
      sm: 'text-sm [--hn-stepper-indicator:var(--hn-control-h-sm)]',
      md: 'text-sm [--hn-stepper-indicator:var(--hn-control-h-md)]',
      lg: 'text-base [--hn-stepper-indicator:var(--hn-control-h-lg)]',
    },
  },
  defaultVariants: { size: 'md' },
})

export const stepperTrigger = tv({
  base: [
    'hn-interactive hn-state-layer hn-press-none text-fg relative flex min-w-0 gap-(--hn-inline-gap) rounded-md p-1',
    'disabled:cursor-not-allowed disabled:opacity-50',
    '[--hn-state-selected-opacity:0]',
  ],
  variants: {
    orientation: {
      horizontal: 'w-full flex-col items-center text-center',
      vertical: 'items-start text-start',
    },
  },
})

export const stepperIndicator = tv({
  base: 'hn-transition-base flex size-(--hn-stepper-indicator) shrink-0 items-center justify-center rounded-full border text-sm font-medium tabular-nums [&_svg]:size-[1em]',
  variants: {
    state: {
      inactive: 'border-line text-muted bg-surface',
      active: 'border-accent bg-accent text-accent-on',
      completed: 'border-transparent bg-accent-soft text-accent-text',
      error: 'border-danger bg-danger-soft text-danger-text',
    },
  },
  defaultVariants: { state: 'inactive' },
})
