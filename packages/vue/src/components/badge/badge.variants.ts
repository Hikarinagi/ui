import { tv, type VariantProps } from '../../lib/tv'

export const badge = tv({
  base: [
    'absolute z-[1] inline-flex items-center justify-center rounded-full will-change-transform',
    'font-medium leading-none whitespace-nowrap select-none',
  ],
  variants: {
    tone: {
      accent: 'bg-accent text-accent-on',
      neutral: 'bg-neutral-solid text-neutral-solid-on',
      success: 'bg-success text-success-on',
      warning: 'bg-warning text-warning-on',
      danger: 'bg-danger text-danger-on',
      info: 'bg-info text-info-on',
    },
    size: {
      sm: 'h-4 min-w-4 px-1 text-xs',
      md: 'h-5 min-w-5 px-1.5 text-xs',
    },
    placement: {
      'top-end': 'top-0 end-0 translate-x-1/2 -translate-y-1/2',
      'top-start': 'top-0 start-0 -translate-x-1/2 -translate-y-1/2',
      'bottom-end': 'bottom-0 end-0 translate-x-1/2 translate-y-1/2',
      'bottom-start': 'bottom-0 start-0 -translate-x-1/2 translate-y-1/2',
    },
    shape: {
      rect: '',
      circle: '',
    },
    outline: {
      true: 'ring-surface ring-2',
      false: '',
    },
  },
  compoundVariants: [
    { shape: 'circle', placement: 'top-end', class: 'top-[14%] end-[14%]' },
    { shape: 'circle', placement: 'top-start', class: 'top-[14%] start-[14%]' },
    { shape: 'circle', placement: 'bottom-end', class: 'bottom-[14%] end-[14%]' },
    { shape: 'circle', placement: 'bottom-start', class: 'bottom-[14%] start-[14%]' },
  ],
  defaultVariants: {
    tone: 'danger',
    size: 'sm',
    placement: 'top-end',
    shape: 'rect',
    outline: true,
  },
})

export type BadgeVariants = VariantProps<typeof badge>
