import { tv, type VariantProps } from '../lib/tv'

export const pinInput = tv({
  base: 'relative inline-flex max-w-full gap-2',
  variants: {
    size: {
      sm: '[--hn-pin-size:var(--hn-control-h-sm)]',
      md: '[--hn-pin-size:var(--hn-control-h-md)]',
      lg: '[--hn-pin-size:var(--hn-control-h-lg)]',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export const pinInputCell = tv({
  base: [
    'hn-field text-fg inline-flex size-[var(--hn-pin-size)] shrink-0 items-center justify-center rounded-md border font-medium tabular-nums select-none',
    'not-data-filled:text-faint not-data-filled:font-normal',
    'data-active:[--hn-field-ring-w:2px] data-invalid:data-active:[--hn-field-ring-w:1px]',
    'data-disabled:opacity-50',
  ],
  variants: {
    variant: {
      primary:
        'border-line [--hn-field-bg:var(--hn-surface)] [--hn-field-shadow:var(--hn-shadow-sm)]',
      secondary: 'border-transparent [--hn-field-bg:var(--hn-bg-inset)]',
    },
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-md',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
})

export const pinInputNative = tv({
  base: 'hn-pin-native',
})

export const pinInputCaret = tv({
  base: 'hn-pin-caret',
})

export type PinInputVariants = VariantProps<typeof pinInputCell>
