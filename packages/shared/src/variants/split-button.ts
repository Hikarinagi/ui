import { tv } from '../lib/tv'

export const splitButton = tv({
  base: 'max-w-full',
  variants: { block: { true: 'flex w-full', false: 'inline-flex' } },
  defaultVariants: { block: false },
})

export const splitButtonAction = tv({
  base: 'min-w-0 flex-1 shrink [&>span]:min-w-0',
})
