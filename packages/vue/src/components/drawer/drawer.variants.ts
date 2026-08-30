import { tv, type VariantProps } from '../../lib/tv'

export const drawerCard = tv({
  base: '',
  variants: {
    side: {
      start: 'start-0',
      end: 'end-0',
    },
    size: {
      sm: 'w-72',
      md: 'w-90',
      lg: 'w-120',
    },
  },
  defaultVariants: { side: 'end', size: 'md' },
})

export type DrawerVariants = VariantProps<typeof drawerCard>
