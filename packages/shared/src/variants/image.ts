import { tv, type VariantProps } from '../lib/tv'

export const imageRoot = tv({
  // An explicit minimum lets WebKit use height + aspect-ratio instead of the
  // image's intrinsic width when sizing shrink-to-fit ancestors.
  base: 'relative isolate block w-full min-w-0 overflow-hidden',
  variants: {
    preview: {
      true: 'hn-focus-ring cursor-zoom-in',
    },
  },
})

export const image = tv({
  base: 'relative z-10 block size-full',
  variants: {
    lazy: {
      true: 'transition-opacity duration-(--hn-duration-base) ease-enter motion-reduce:transition-none',
    },
    placeholder: {
      true: '',
    },
    fit: {
      cover: 'object-cover',
      contain: 'object-contain',
      fill: 'object-fill',
      none: 'object-none',
      'scale-down': 'object-scale-down',
    },
  },
  compoundVariants: [
    {
      lazy: true,
      placeholder: true,
      class: 'transition-[opacity,filter] duration-(--hn-duration-slow)',
    },
  ],
  defaultVariants: { fit: 'cover' },
})

export const imagePlaceholder = tv({
  base: 'bg-center bg-no-repeat',
  variants: {
    fit: {
      cover: 'bg-cover',
      contain: 'bg-contain',
      fill: 'bg-size-[100%_100%]',
      none: 'bg-cover',
      'scale-down': 'bg-contain',
    },
  },
  defaultVariants: { fit: 'cover' },
})

export type ImageVariants = VariantProps<typeof image>
