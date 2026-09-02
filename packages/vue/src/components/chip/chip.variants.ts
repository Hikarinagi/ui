import { tv, type VariantProps } from '../../lib/tv'

export const chip = tv({
  base: [
    'relative inline-flex shrink-0 items-center rounded-full border border-transparent',
    'font-medium whitespace-nowrap select-none',
  ],
  variants: {
    variant: {
      soft: '',
      outline: 'border-line',
    },
    tone: {
      neutral: '',
      accent: '',
    },
    size: {
      sm: 'h-[calc(var(--hn-control-h-sm)-0.25rem)] px-2 text-xs [&_svg]:size-3',
      md: 'h-[var(--hn-control-h-sm)] px-2.5 text-sm [&_svg]:size-3.5',
    },
    interactive: {
      true: 'hn-interactive hn-state-layer',
    },
    selected: {
      true: '',
    },
    disabled: {
      true: 'pointer-events-none opacity-50',
    },
  },
  compoundVariants: [
    { variant: 'soft', tone: 'neutral', class: 'bg-subtle text-fg' },
    { variant: 'soft', tone: 'accent', class: 'bg-accent-soft text-accent-text' },
    { variant: 'outline', tone: 'neutral', class: 'text-fg' },
    { variant: 'outline', tone: 'accent', class: 'text-accent-text' },
    { selected: true, class: 'text-accent-text' },
  ],
  defaultVariants: {
    variant: 'soft',
    tone: 'neutral',
    size: 'md',
  },
})

export const chipIcon = tv({
  base: 'relative inline-flex shrink-0 items-center justify-center',
  variants: {
    size: {
      sm: 'me-1 size-3',
      md: 'me-1.5 size-3.5',
    },
  },
  defaultVariants: { size: 'md' },
})

export const chipRemove = tv({
  base: 'hn-press-none disabled:opacity-100',
  variants: {
    size: {
      sm: 'ms-1 -me-1 size-4 [&_svg]:size-3',
      md: 'ms-1 -me-1.5 [&_svg]:size-3.5',
    },
  },
  defaultVariants: { size: 'md' },
})

export type ChipVariants = VariantProps<typeof chip>
