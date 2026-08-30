import { tv, type VariantProps } from '../../lib/tv'

export const link = tv({
  base: 'hn-link cursor-pointer',
  variants: {
    tone: {
      accent: '[--hn-link-color:var(--hn-accent-text)]',
      neutral: '[--hn-link-color:var(--hn-fg-default)]',
    },
  },
  defaultVariants: { tone: 'accent' },
})

export type LinkVariants = VariantProps<typeof link>
