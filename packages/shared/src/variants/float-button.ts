import { tv } from '../lib/tv'

export const floatButton = tv({
  base: 'hn-float-button z-20 max-w-full shadow-md [&>span]:min-w-0',
  variants: {
    variant: { solid: '', soft: '', outline: 'bg-surface' },
    position: { fixed: 'fixed', absolute: 'absolute', static: 'relative' },
    shape: { circle: 'rounded-full', square: 'rounded-xl' },
    size: {
      sm: 'h-10 [&_svg]:size-4',
      md: 'h-12 [&_svg]:size-5',
      lg: 'h-14 [&_svg]:size-6',
    },
    extended: { true: 'px-5', false: 'aspect-square px-0' },
  },
  defaultVariants: { position: 'fixed', shape: 'circle', size: 'md', extended: false },
})
