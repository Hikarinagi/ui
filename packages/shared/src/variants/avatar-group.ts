import { tv, type VariantProps } from '../lib/tv'

export const avatarGroup = tv({
  base: 'flex flex-row-reverse justify-end [&>*]:ring-surface [&>*]:ring-2 [&>*:first-child]:me-0',
  variants: {
    size: {
      sm: '[&>*]:-me-1.5',
      md: '[&>*]:-me-2',
      lg: '[&>*]:-me-2.5',
    },
  },
  defaultVariants: { size: 'md' },
})

export type AvatarGroupVariants = VariantProps<typeof avatarGroup>
