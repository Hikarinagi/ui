import { tv, type VariantProps } from '../../lib/tv'

export const image = tv({
  base: 'block size-full',
  variants: {
    fit: {
      cover: 'object-cover',
      contain: 'object-contain',
      fill: 'object-fill',
      none: 'object-none',
      'scale-down': 'object-scale-down',
    },
  },
  defaultVariants: { fit: 'cover' },
})

export type ImageVariants = VariantProps<typeof image>
