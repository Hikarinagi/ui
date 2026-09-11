import { tv } from '../../lib/tv'

export const inputGroup = tv({
  base: [
    '[&>button]:h-auto [&>button]:rounded-none [&>button]:[--hn-press-scale:1]',
    '[&>button:focus-visible]:-outline-offset-2',
  ],
  variants: {
    divided: {
      true: '[&>*+*]:border-s [&>*+*]:border-s-line',
    },
  },
  defaultVariants: {
    divided: true,
  },
})

export const inputGroupAddon = tv({
  base: 'text-muted flex shrink-0 items-center gap-2 px-[var(--hn-input-px)] whitespace-nowrap [&>svg]:size-[var(--hn-input-icon)]',
})
