import { tv, type VariantProps } from '../../lib/tv'

export const inputHost = tv({
  base: [
    'hn-field text-fg flex w-full min-w-0 items-stretch overflow-hidden rounded-md border font-medium',
    'has-disabled:cursor-not-allowed has-disabled:opacity-50',
  ],
  variants: {
    variant: {
      primary:
        'border-line [--hn-field-bg:var(--hn-surface)] [--hn-field-shadow:var(--hn-shadow-sm)]',
      secondary: 'border-transparent [--hn-field-bg:var(--hn-bg-inset)]',
    },
    size: {
      sm: 'h-[var(--hn-control-h-sm)] text-sm [--hn-input-h:var(--hn-control-h-sm)] [--hn-input-px:var(--hn-control-px-sm)] [--hn-input-icon:0.875rem]',
      md: 'h-[var(--hn-control-h-md)] text-base [--hn-input-h:var(--hn-control-h-md)] [--hn-input-px:var(--hn-control-px-md)] [--hn-input-icon:1rem]',
      lg: 'h-[var(--hn-control-h-lg)] text-md [--hn-input-h:var(--hn-control-h-lg)] [--hn-input-px:var(--hn-control-px-lg)] [--hn-input-icon:1.125rem]',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
})

export const inputControl = tv({
  base: [
    'h-full min-w-0 flex-1 bg-transparent px-[var(--hn-input-px)] text-inherit outline-none [font:inherit]',
    'placeholder:text-faint placeholder:font-normal disabled:cursor-not-allowed',
  ],
  variants: {
    leading: {
      true: 'ps-0',
    },
    trailing: {
      true: 'pe-0',
    },
  },
})

export const inputAdornment = tv({
  base: [
    'text-muted relative flex min-w-[var(--hn-input-h)] shrink-0 cursor-text items-center justify-center px-1',
    '[&>svg]:size-[var(--hn-input-icon)] [&>span_svg]:size-[var(--hn-input-icon)]',
  ],
})

export type InputVariants = VariantProps<typeof inputHost>

export const inputEmbedded = tv({
  base: 'flex min-w-0 flex-1 items-stretch',
})
