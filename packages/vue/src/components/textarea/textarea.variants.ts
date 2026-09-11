import { tv, type VariantProps } from '../../lib/tv'

export const textarea = tv({
  base: [
    'text-fg flex w-full min-w-0 cursor-text flex-col overflow-hidden rounded-md border font-medium',
    'data-disabled:cursor-not-allowed data-disabled:opacity-50',
  ],
  variants: {
    variant: {
      bare: 'rounded-none border-0 bg-transparent shadow-none outline-none [--hn-textarea-border-w:0px]',
      primary:
        'hn-field border-line [--hn-field-bg:var(--hn-surface)] [--hn-field-shadow:var(--hn-shadow-sm)]',
      secondary: 'hn-field border-transparent [--hn-field-bg:var(--hn-bg-inset)]',
    },
    size: {
      sm: 'text-sm [--hn-textarea-h:var(--hn-control-h-sm)] [--hn-textarea-px:var(--hn-control-px-sm)]',
      md: 'text-base [--hn-textarea-h:var(--hn-control-h-md)] [--hn-textarea-px:var(--hn-control-px-md)]',
      lg: 'text-md [--hn-textarea-h:var(--hn-control-h-lg)] [--hn-textarea-px:var(--hn-control-px-lg)]',
    },
    autosize: {
      true: [
        'min-h-[calc((var(--hn-textarea-rows)_-_1)_*_1lh_+_var(--hn-textarea-h))]',
        'max-h-[calc((var(--hn-textarea-max-rows)_-_1)_*_1lh_+_var(--hn-textarea-h))]',
      ],
      false: 'h-[calc((var(--hn-textarea-rows)_-_1)_*_1lh_+_var(--hn-textarea-h))]',
    },
    resize: {
      none: 'resize-none',
      vertical: 'resize-y',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
    autosize: false,
    resize: 'vertical',
  },
})

export const textareaField = tv({
  base: [
    'block w-full resize-none overflow-hidden bg-transparent text-inherit outline-none [font:inherit]',
    'px-[var(--hn-textarea-px)] py-[calc((var(--hn-textarea-h)_-_1lh)/2_-_var(--hn-textarea-border-w,1px))]',
    'placeholder:text-faint placeholder:font-normal disabled:cursor-not-allowed',
  ],
})

export type TextareaVariants = VariantProps<typeof textarea>
