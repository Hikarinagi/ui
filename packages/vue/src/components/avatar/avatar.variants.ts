import { tv, type VariantProps } from '../../lib/tv'

export const avatar = tv({
  base: [
    'bg-inset text-muted relative inline-flex shrink-0 items-center justify-center',
    'overflow-hidden rounded-full align-middle font-medium select-none',
  ],
  variants: {
    size: {
      sm: 'size-6 text-xs [&_svg]:size-3.5',
      md: 'size-8 text-sm [&_svg]:size-4',
      lg: 'size-10 text-base [&_svg]:size-5',
    },
  },
  defaultVariants: { size: 'md' },
})

export type AvatarVariants = VariantProps<typeof avatar>
