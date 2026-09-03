import { tv, type VariantProps } from '../../lib/tv'

export const checkbox = tv({
  base: [
    'text-fg grid w-fit max-w-full cursor-pointer grid-cols-[auto_minmax(0,1fr)] items-center gap-x-[var(--hn-field-gap)] select-none',
    'data-disabled:cursor-not-allowed data-disabled:opacity-50',
  ],
  variants: {
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-md',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export const checkboxBox = tv({
  base: [
    'hn-focus-ring hn-state-layer hn-transition-base relative grid shrink-0 cursor-pointer place-items-center',
    'size-[var(--hn-checkbox-size)] border',
    'border-line bg-surface shadow-sm disabled:cursor-not-allowed',
    '[--hn-state-selected-color:var(--hn-accent-on)] [--hn-state-selected-opacity:0]',
    'data-[state=checked]:border-accent data-[state=checked]:bg-accent data-[state=checked]:text-surface',
    'data-[state=indeterminate]:border-accent data-[state=indeterminate]:bg-accent data-[state=indeterminate]:text-surface',
    'data-invalid:border-danger data-invalid:focus-visible:outline-danger',
    '[&_svg]:col-start-1 [&_svg]:row-start-1 [&_svg]:size-[var(--hn-checkbox-icon)] [&_svg]:stroke-[3]',
  ],
  variants: {
    shape: {
      square: 'rounded-xs',
      round: 'rounded-full',
    },
    size: {
      sm: '[--hn-checkbox-icon:0.625rem] [--hn-checkbox-size:0.875rem]',
      md: '[--hn-checkbox-icon:0.75rem] [--hn-checkbox-size:1rem]',
      lg: '[--hn-checkbox-icon:0.875rem] [--hn-checkbox-size:1.125rem]',
    },
  },
  defaultVariants: {
    shape: 'square',
    size: 'md',
  },
})

export const checkboxTitle = tv({
  base: 'flex min-h-[1lh] min-w-0 items-center',
})

export const checkboxTitleText = tv({
  base: 'block [text-box:trim-both_cap_alphabetic]',
})

export const checkboxDescription = tv({
  base: 'text-muted col-start-2 block',
  variants: {
    size: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export type CheckboxVariants = VariantProps<typeof checkbox>
