import { tv, type VariantProps } from '../../lib/tv'

export const input = tv({
  base: [
    'hn-field text-fg w-full min-w-0 rounded-md border font-medium',
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
      sm: 'h-[var(--hn-control-h-sm)] px-[var(--hn-control-px-sm)] text-sm',
      md: 'h-[var(--hn-control-h-md)] px-[var(--hn-control-px-md)] text-base',
      lg: 'h-[var(--hn-control-h-lg)] px-[var(--hn-control-px-lg)] text-md',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
})

export type InputVariants = VariantProps<typeof input>
