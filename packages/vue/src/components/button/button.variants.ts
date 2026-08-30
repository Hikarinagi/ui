import { tv, type VariantProps } from '../../lib/tv'

export const button = tv({
  base: [
    'hn-interactive relative isolate inline-flex shrink-0 items-center justify-center',
    'gap-[var(--hn-control-gap)] rounded-md border border-transparent',
    'font-medium whitespace-nowrap select-none',
    'disabled:pointer-events-none disabled:opacity-50',
    'data-disabled:pointer-events-none data-disabled:opacity-50',
  ],
  variants: {
    variant: {
      solid: 'hn-state-layer',
      soft: 'hn-state-layer',
      outline: 'hn-state-layer border-line hover:border-line-strong',
      ghost: 'hn-state-layer',
      link: 'hn-link hn-press-none',
    },
    tone: {
      accent: '',
      neutral: '',
      danger: '',
    },
    size: {
      sm: 'h-[var(--hn-control-h-sm)] px-[var(--hn-control-px-sm)] text-sm [&_svg]:size-3.5',
      md: 'h-[var(--hn-control-h-md)] px-[var(--hn-control-px-md)] text-base [&_svg]:size-4',
      lg: 'h-[var(--hn-control-h-lg)] px-[var(--hn-control-px-lg)] text-md [&_svg]:size-[1.125rem]',
    },
    iconOnly: {
      true: 'aspect-square px-0',
    },
    block: {
      true: 'w-full',
    },
    pill: {
      true: 'rounded-full',
    },
  },
  compoundVariants: [
    {
      variant: 'solid',
      tone: 'accent',
      class: 'bg-accent text-accent-on',
    },
    {
      variant: 'solid',
      tone: 'neutral',
      class: 'bg-neutral-solid text-neutral-solid-on',
    },
    {
      variant: 'solid',
      tone: 'danger',
      class: 'bg-danger text-danger-on',
    },
    {
      variant: 'soft',
      tone: 'accent',
      class: 'bg-accent-soft text-accent-text',
    },
    { variant: 'soft', tone: 'neutral', class: 'bg-subtle text-fg' },
    {
      variant: 'soft',
      tone: 'danger',
      class: 'bg-danger-soft text-danger-text',
    },
    {
      variant: 'outline',
      tone: 'accent',
      class: 'text-accent-text',
    },
    { variant: 'outline', tone: 'neutral', class: 'text-fg' },
    {
      variant: 'outline',
      tone: 'danger',
      class: 'text-danger-text',
    },
    {
      variant: 'ghost',
      tone: 'accent',
      class: 'text-accent-text',
    },
    { variant: 'ghost', tone: 'neutral', class: 'text-fg' },
    {
      variant: 'ghost',
      tone: 'danger',
      class: 'text-danger-text',
    },
    { variant: 'link', tone: 'accent', class: '[--hn-link-color:var(--hn-accent-text)]' },
    { variant: 'link', tone: 'neutral', class: '[--hn-link-color:var(--hn-fg-default)]' },
    { variant: 'link', tone: 'danger', class: '[--hn-link-color:var(--hn-danger-text)]' },
    { variant: 'link', class: 'h-auto rounded-none border-0 px-0' },
    { size: 'lg', iconOnly: true, class: 'hn-press-lg' },
  ],
  defaultVariants: {
    variant: 'solid',
    tone: 'accent',
    size: 'md',
  },
})

export const buttonIconBox = tv({
  base: 'relative inline-flex shrink-0 items-center justify-center',
  variants: {
    size: {
      sm: 'size-3.5',
      md: 'size-4',
      lg: 'size-[1.125rem]',
    },
  },
  defaultVariants: { size: 'md' },
})

export type ButtonVariants = VariantProps<typeof button>
