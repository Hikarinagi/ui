import { tv, type VariantProps } from '../../lib/tv'

export const pinInput = tv({
  base: 'inline-flex max-w-full gap-2',
})

export const pinInputCell = tv({
  base: [
    'hn-field text-fg shrink-0 rounded-md border text-center font-medium tabular-nums outline-none [font-family:inherit]',
    'placeholder:text-faint placeholder:font-normal',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ],
  variants: {
    variant: {
      primary:
        'border-line [--hn-field-bg:var(--hn-surface)] [--hn-field-shadow:var(--hn-shadow-sm)]',
      secondary: 'border-transparent [--hn-field-bg:var(--hn-bg-inset)]',
    },
    size: {
      sm: 'size-[var(--hn-control-h-sm)] text-sm',
      md: 'size-[var(--hn-control-h-md)] text-base',
      lg: 'size-[var(--hn-control-h-lg)] text-md',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
})

export type PinInputVariants = VariantProps<typeof pinInputCell>
