import { tv, type VariantProps } from '../../lib/tv'

export const checkbox = tv({
  base: [
    'text-fg inline-flex w-fit max-w-full cursor-pointer items-start gap-[var(--hn-field-gap)] select-none',
    'data-disabled:cursor-not-allowed data-disabled:opacity-50',
  ],
  variants: {
    size: {
      sm: 'text-sm [--hn-checkbox-icon:0.625rem] [--hn-checkbox-size:0.875rem]',
      md: 'text-base [--hn-checkbox-icon:0.75rem] [--hn-checkbox-size:1rem]',
      lg: 'text-md [--hn-checkbox-icon:0.875rem] [--hn-checkbox-size:1.125rem]',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export const checkboxBox = tv({
  base: [
    'hn-focus-ring hn-state-layer hn-transition-base relative grid shrink-0 cursor-pointer place-items-center',
    'mt-[calc((1lh-var(--hn-checkbox-size))/2)] size-[var(--hn-checkbox-size)] rounded-xs border',
    'border-line bg-surface shadow-sm disabled:cursor-not-allowed',
    '[--hn-state-selected-color:currentColor] [--hn-state-selected-opacity:0]',
    'data-[state=checked]:border-accent data-[state=checked]:bg-accent data-[state=checked]:text-accent-on',
    'data-[state=indeterminate]:border-accent data-[state=indeterminate]:bg-accent data-[state=indeterminate]:text-accent-on',
    'data-invalid:border-danger data-invalid:focus-visible:outline-danger',
    '[&_svg]:col-start-1 [&_svg]:row-start-1 [&_svg]:size-[var(--hn-checkbox-icon)] [&_svg]:stroke-[3]',
  ],
})

export const checkboxDescription = tv({
  base: 'text-muted block',
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
