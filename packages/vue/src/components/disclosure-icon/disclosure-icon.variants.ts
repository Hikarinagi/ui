import { tv, type VariantProps } from '../../lib/tv'

export const disclosureIcon = tv({
  base: 'hn-transition shrink-0',
  variants: {
    direction: {
      down: '',
      end: '',
    },
    state: {
      auto: '',
      open: '',
      closed: '',
    },
  },
  compoundVariants: [
    { direction: 'down', state: 'auto', class: 'group-data-open/hn-disclosure:rotate-180' },
    { direction: 'end', state: 'auto', class: 'group-data-open/hn-disclosure:rotate-90' },
    { direction: 'down', state: 'open', class: 'rotate-180' },
    { direction: 'end', state: 'open', class: 'rotate-90' },
  ],
  defaultVariants: { direction: 'down', state: 'auto' },
})

export type DisclosureIconVariants = VariantProps<typeof disclosureIcon>
