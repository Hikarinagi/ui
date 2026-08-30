import { tv, type VariantProps } from '../../lib/tv'

export const callout = tv({
  base: 'flex gap-3 rounded-lg p-4',
  variants: {
    tone: {
      neutral: 'bg-subtle',
      accent: 'bg-accent-soft',
      info: 'bg-info-soft',
      success: 'bg-success-soft',
      warning: 'bg-warning-soft',
      danger: 'bg-danger-soft',
    },
  },
  defaultVariants: { tone: 'neutral' },
})

export const calloutIcon = tv({
  base: 'mt-0.5 size-5 shrink-0',
  variants: {
    tone: {
      neutral: 'text-muted',
      accent: 'text-accent-text',
      info: 'text-info-text',
      success: 'text-success-text',
      warning: 'text-warning-text',
      danger: 'text-danger-text',
    },
  },
  defaultVariants: { tone: 'neutral' },
})

export type CalloutVariants = VariantProps<typeof callout>
