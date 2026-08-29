import { tv, type VariantProps } from '../../lib/tv'

export const text = tv({
  variants: {
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      md: 'text-md',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
    },
    tone: {
      default: 'text-fg',
      muted: 'text-muted',
      faint: 'text-faint',
      disabled: 'text-disabled',
      accent: 'text-accent-text',
      success: 'text-success-text',
      warning: 'text-warning-text',
      danger: 'text-danger-text',
      info: 'text-info-text',
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
    },
    truncate: {
      true: 'truncate',
    },
  },
  defaultVariants: {
    size: 'base',
    tone: 'default',
    weight: 'normal',
  },
})

export type TextVariants = VariantProps<typeof text>
