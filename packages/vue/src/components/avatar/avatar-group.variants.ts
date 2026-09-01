import { tv, type VariantProps } from '../../lib/tv'

export const avatarGroupItem = tv({
  base: 'ring-surface first:me-0 ring-2',
  variants: {
    size: {
      sm: '-me-1.5',
      md: '-me-2',
      lg: '-me-2.5',
    },
  },
  defaultVariants: { size: 'md' },
})

export type AvatarGroupVariants = VariantProps<typeof avatarGroupItem>
