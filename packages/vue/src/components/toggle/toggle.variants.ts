import { tv, type VariantProps } from '../../lib/tv'
import { button } from '../button/button.variants'

export const toggle = tv({
  extend: button,
  base: 'aria-pressed:text-accent-text',
  defaultVariants: { variant: 'ghost', tone: 'neutral', size: 'md' },
})

export type ToggleVariants = VariantProps<typeof toggle>
