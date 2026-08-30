import { tv, type VariantProps } from '../../lib/tv'

export const space = tv({
  base: 'shrink-0',
  variants: {
    size: {
      xs: 'size-1',
      sm: 'size-2',
      md: 'size-4',
      lg: 'size-6',
      xl: 'size-8',
      flex: 'flex-1 self-stretch',
    },
  },
  defaultVariants: { size: 'flex' },
})

export type SpaceVariants = VariantProps<typeof space>
