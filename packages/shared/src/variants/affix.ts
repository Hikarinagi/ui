import { tv } from '../lib/tv'

export const affix = tv({
  base: 'min-w-0 flow-root',
  variants: {
    position: {
      top: '[inset-block-start:var(--hn-affix-offset)]',
      bottom: '[inset-block-end:var(--hn-affix-offset)]',
    },
    disabled: {
      true: 'relative [inset-block-start:auto] [inset-block-end:auto]',
      false: 'sticky z-10',
    },
  },
  defaultVariants: { position: 'top', disabled: false },
})
