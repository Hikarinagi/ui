import { tv } from '../../lib/tv'

export const numberInputStepper = tv({
  base: 'flex shrink-0 flex-col',
  variants: {
    divided: {
      true: 'border-line border-s',
    },
    size: {
      sm: '[&_svg]:size-3',
      md: '[&_svg]:size-3',
      lg: '[&_svg]:size-3.5',
    },
  },
  defaultVariants: {
    size: 'md',
    divided: true,
  },
})

export const numberInputStep = tv({
  base: [
    'hn-interactive hn-state-layer hn-press-none text-muted',
    'flex min-h-0 flex-1 basis-0 items-center justify-center px-1.5 outline-none',
    'disabled:pointer-events-none disabled:opacity-40',
  ],
  variants: {
    divided: {
      true: 'border-line border-t',
    },
  },
})
