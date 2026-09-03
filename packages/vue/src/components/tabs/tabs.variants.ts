import { tv, type VariantProps } from '../../lib/tv'

export const tabsList = tv({
  base: 'relative isolate flex',
  variants: {
    variant: {
      underline: 'border-line gap-1',
      soft: 'bg-subtle gap-1 rounded-lg p-1',
    },
    orientation: {
      horizontal: 'flex-row items-center',
      vertical: 'flex-col items-stretch',
    },
  },
  compoundVariants: [
    { variant: 'underline', orientation: 'horizontal', class: 'border-b' },
    { variant: 'underline', orientation: 'vertical', class: 'border-e' },
    { variant: 'soft', orientation: 'horizontal', class: 'inline-flex w-fit' },
    { variant: 'soft', orientation: 'vertical', class: 'h-fit' },
  ],
  defaultVariants: { variant: 'underline', orientation: 'horizontal' },
})

export const tabsScroll = tv({
  base: '',
  variants: {
    variant: {
      underline: '',
      soft: '',
    },
    orientation: {
      horizontal: 'max-w-full',
      vertical: 'max-h-full',
    },
  },
  compoundVariants: [{ variant: 'soft', orientation: 'horizontal', class: 'w-fit' }],
  defaultVariants: { variant: 'underline', orientation: 'horizontal' },
})

export const tabsHighlight = tv({
  base: 'absolute -z-10',
  variants: {
    variant: {
      underline: 'bg-accent rounded-full',
      soft: 'bg-surface inset-0 rounded-md shadow-sm',
    },
    orientation: {
      horizontal: '',
      vertical: '',
    },
  },
  compoundVariants: [
    { variant: 'underline', orientation: 'horizontal', class: 'inset-x-0 bottom-px h-0.5' },
    { variant: 'underline', orientation: 'vertical', class: 'inset-y-0 end-px w-0.5' },
  ],
  defaultVariants: { variant: 'underline', orientation: 'horizontal' },
})

export const tabsTrigger = tv({
  base: [
    'hn-interactive hn-state-layer hn-press-none hn-focus-ring text-muted relative z-[1] inline-flex shrink-0 items-center gap-1.5 text-sm font-medium whitespace-nowrap select-none',
    '[--hn-state-selected-opacity:0] [--hn-state-selected-color:var(--hn-fg-muted)]',
    'data-[state=active]:z-0',
    'disabled:pointer-events-none disabled:opacity-50',
    '[&_svg]:size-4',
  ],
  variants: {
    variant: {
      underline: 'data-[state=active]:text-accent-text [--hn-ripple-color:var(--hn-accent)]',
      soft: 'rounded-md data-[state=active]:text-fg',
    },
    orientation: {
      horizontal: '',
      vertical: 'justify-start',
    },
    size: {
      sm: '',
      md: '',
      lg: '',
    },
  },
  compoundVariants: [
    { variant: 'underline', orientation: 'horizontal', class: '-mb-px rounded-t-sm' },
    { variant: 'underline', orientation: 'vertical', class: '-me-px rounded-s-sm' },
    { variant: 'underline', size: 'sm', class: 'h-8 px-2.5' },
    { variant: 'underline', size: 'md', class: 'h-9 px-3' },
    { variant: 'underline', size: 'lg', class: 'h-10 px-3.5' },
    { variant: 'soft', size: 'sm', class: 'h-7 px-2.5' },
    { variant: 'soft', size: 'md', class: 'h-8 px-3' },
    { variant: 'soft', size: 'lg', class: 'h-9 px-3.5' },
  ],
  defaultVariants: { variant: 'underline', orientation: 'horizontal', size: 'md' },
})

export type TabsVariants = VariantProps<typeof tabsTrigger>
