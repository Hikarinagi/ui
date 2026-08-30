import { tv, type VariantProps } from '../../lib/tv'

export const tag = tv({
  base: [
    'inline-flex shrink-0 items-center gap-1 rounded-sm border border-transparent',
    'font-medium whitespace-nowrap select-none',
  ],
  variants: {
    variant: {
      soft: '',
      solid: '',
      outline: 'border-line',
    },
    tone: {
      accent: '',
      neutral: '',
      success: '',
      warning: '',
      danger: '',
      info: '',
    },
    size: {
      sm: 'h-5 px-1.5 text-xs [&_svg]:size-3',
      md: 'h-6 px-2 text-sm [&_svg]:size-3.5',
    },
    pill: {
      true: 'rounded-full',
    },
  },
  compoundVariants: [
    { variant: 'soft', tone: 'accent', class: 'bg-accent-soft text-accent-text' },
    { variant: 'soft', tone: 'neutral', class: 'bg-subtle text-fg' },
    { variant: 'soft', tone: 'success', class: 'bg-success-soft text-success-text' },
    { variant: 'soft', tone: 'warning', class: 'bg-warning-soft text-warning-text' },
    { variant: 'soft', tone: 'danger', class: 'bg-danger-soft text-danger-text' },
    { variant: 'soft', tone: 'info', class: 'bg-info-soft text-info-text' },
    { variant: 'solid', tone: 'accent', class: 'bg-accent text-accent-on' },
    { variant: 'solid', tone: 'neutral', class: 'bg-neutral-solid text-neutral-solid-on' },
    { variant: 'solid', tone: 'success', class: 'bg-success text-success-on' },
    { variant: 'solid', tone: 'warning', class: 'bg-warning text-warning-on' },
    { variant: 'solid', tone: 'danger', class: 'bg-danger text-danger-on' },
    { variant: 'solid', tone: 'info', class: 'bg-info text-info-on' },
    { variant: 'outline', tone: 'accent', class: 'text-accent-text' },
    { variant: 'outline', tone: 'neutral', class: 'text-muted' },
    { variant: 'outline', tone: 'success', class: 'text-success-text' },
    { variant: 'outline', tone: 'warning', class: 'text-warning-text' },
    { variant: 'outline', tone: 'danger', class: 'text-danger-text' },
    { variant: 'outline', tone: 'info', class: 'text-info-text' },
  ],
  defaultVariants: {
    variant: 'soft',
    tone: 'neutral',
    size: 'sm',
  },
})

export type TagVariants = VariantProps<typeof tag>
