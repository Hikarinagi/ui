import { tv } from '../lib/tv'

export const toolbar = tv({
  base: 'inline-flex max-w-full gap-(--hn-control-gap) rounded-lg',
  variants: {
    orientation: {
      horizontal: 'flex-row flex-wrap items-center',
      vertical: 'flex-col items-stretch',
    },
    variant: {
      primary: 'border-line bg-surface border p-1',
      secondary: 'bg-inset p-1',
      bare: '',
    },
  },
  defaultVariants: { orientation: 'horizontal', variant: 'primary' },
})

export const toolbarGroup = tv({
  base: 'inline-flex gap-(--hn-control-gap)',
  variants: {
    orientation: {
      horizontal: 'flex-wrap items-center',
      vertical: 'flex-col items-stretch',
    },
  },
})

export const toolbarSeparator = tv({
  base: 'bg-line shrink-0 self-stretch',
  variants: {
    orientation: {
      horizontal: 'mx-1 my-1 w-px',
      vertical: 'mx-1 my-1 h-px',
    },
  },
})
