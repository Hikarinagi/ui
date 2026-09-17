import { tv, type VariantProps } from '../lib/tv'

export const timeline = tv({
  base: 'hn-timeline text-fg m-0 grid w-full min-w-0 list-none p-0',
  variants: {
    size: {
      sm: 'text-xs [--hn-timeline-gap:var(--hn-stack-gap)]',
      md: 'text-sm [--hn-timeline-gap:calc(var(--hn-stack-gap)*1.5)]',
      lg: 'text-base [--hn-timeline-gap:calc(var(--hn-stack-gap)*2)]',
    },
  },
  defaultVariants: { size: 'md' },
})

export const timelineMarker = tv({
  base: 'hn-timeline-marker flex shrink-0 items-center justify-center [&_svg]:size-[1em]',
  variants: {
    tone: {
      accent: 'text-accent-text',
      neutral: 'text-muted',
      success: 'text-success-text',
      warning: 'text-warning-text',
      danger: 'text-danger-text',
      info: 'text-info-text',
    },
  },
  defaultVariants: { tone: 'accent' },
})

export type TimelineVariants = VariantProps<typeof timeline>
export type TimelineMarkerVariants = VariantProps<typeof timelineMarker>
