import { tv, type VariantProps } from '../../lib/tv'

export const buttonGroup = tv({
  base: ['isolate align-middle', '[&>*]:[--hn-press-scale:1]', '[&>*:focus-visible]:z-10'],
  variants: {
    orientation: {
      horizontal: [
        '[&>*:not(:first-child)]:-ms-px',
        '[&>*:not(:first-child)]:rounded-s-none',
        '[&>*:not(:last-child)]:rounded-e-none',
      ],
      vertical: [
        'flex-col',
        '[&>*:not(:first-child)]:-mt-px',
        '[&>*:not(:first-child)]:rounded-t-none',
        '[&>*:not(:last-child)]:rounded-b-none',
      ],
    },
    block: {
      true: 'flex w-full [&>*]:flex-1',
      false: 'inline-flex',
    },
    divider: {
      true: [
        '[&>*:not(:first-child)]:before:absolute',
        '[&>*:not(:first-child)]:before:bg-current',
        '[&>*:not(:first-child)]:before:opacity-25',
      ],
    },
  },
  compoundVariants: [
    {
      divider: true,
      orientation: 'horizontal',
      class:
        '[&>*:not(:first-child)]:before:start-0 [&>*:not(:first-child)]:before:inset-y-1/4 [&>*:not(:first-child)]:before:w-px',
    },
    {
      divider: true,
      orientation: 'vertical',
      class:
        '[&>*:not(:first-child)]:before:top-0 [&>*:not(:first-child)]:before:inset-x-1/4 [&>*:not(:first-child)]:before:h-px',
    },
  ],
  defaultVariants: {
    orientation: 'horizontal',
    block: false,
  },
})

export type ButtonGroupVariants = VariantProps<typeof buttonGroup>
