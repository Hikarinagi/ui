import { tv, type VariantProps } from '../../lib/tv'

export const inputHost = tv({
  base: [
    'group/hn-field text-fg flex w-full min-w-0 cursor-text items-stretch overflow-hidden rounded-md border font-medium',
    'data-disabled:cursor-not-allowed data-disabled:opacity-50',
  ],
  variants: {
    variant: {
      primary:
        'hn-field border-line [--hn-field-bg:var(--hn-surface)] [--hn-field-shadow:var(--hn-shadow-sm)]',
      secondary: 'hn-field border-transparent [--hn-field-bg:var(--hn-bg-inset)]',
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

export const textInputHost = tv({
  extend: inputHost,
  variants: {
    variant: {
      bare: 'rounded-none border-0 bg-transparent shadow-none outline-none',
    },
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
    'text-muted relative flex min-w-[var(--hn-input-h)] shrink-0 items-center justify-center self-stretch px-1',
    '[&>svg]:size-[var(--hn-input-icon)] [&>span_svg]:size-[var(--hn-input-icon)]',
  ],
})

export const inputAction = tv({
  base: [
    'hn-interactive hn-state-layer text-fg cursor-pointer outline-none',
    'focus-visible:[outline-offset:calc(var(--hn-focus-ring-offset)*-1)]',
    'disabled:pointer-events-none',
  ],
})

export const inputIndicator = tv({
  base: 'cursor-pointer outline-none',
})

export const inputActionSlot = tv({
  base: 'flex shrink-0 items-stretch self-stretch',
})

export type InputVariants = VariantProps<typeof inputHost>
export type TextInputVariants = VariantProps<typeof textInputHost>

export const inputEmbedded = tv({
  base: [
    'group/hn-field flex min-w-0 flex-1 items-stretch',
    'data-disabled:cursor-not-allowed data-disabled:opacity-50',
    'group-data-disabled/hn-field:data-disabled:opacity-100',
  ],
})
