import { tv, type VariantProps } from '../../lib/tv'

export const slider = tv({
  base: 'group/hn-slider relative flex w-full min-w-0 flex-col data-disabled:cursor-not-allowed data-disabled:opacity-50',
  variants: {
    size: {
      sm: '[--hn-slider-h:1.25rem] [--hn-slider-thumb:0.75rem]',
      md: '[--hn-slider-h:1.5rem] [--hn-slider-thumb:1rem]',
      lg: '[--hn-slider-h:1.75rem] [--hn-slider-thumb:1.25rem]',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export const sliderRoot = tv({
  base: [
    'bg-line-strong relative flex h-[var(--hn-slider-h)] w-full cursor-pointer touch-none rounded-full select-none',
    'data-disabled:pointer-events-none',
  ],
})

export const sliderTrack = tv({
  base: 'absolute inset-0 overflow-hidden rounded-full',
})

export const sliderRange = tv({
  base: [
    'hn-slider-move bg-accent absolute inset-y-0 start-0 rounded-full group-data-dragging/hn-slider:transition-none',
    'w-[calc((100%-var(--hn-slider-thumb)-0.5rem)*var(--hn-slider-p)+var(--hn-slider-thumb)+0.5rem)]',
  ],
})

export const sliderThumb = tv({
  base: [
    'hn-state-layer hn-slider-move border-line bg-surface text-fg top-1 !block size-[var(--hn-slider-thumb)] cursor-grab rounded-full border shadow-sm outline-none',
    '!start-[calc(0.25rem+var(--hn-slider-thumb)/2+var(--hn-slider-p)*(100%-0.5rem-var(--hn-slider-thumb)))]',
    'data-focus-ring:outline-2 data-focus-ring:outline-offset-2 data-focus-ring:outline-solid data-focus-ring:outline-(--hn-focus-ring)',
    'group-data-dragging/hn-slider:cursor-grabbing group-data-dragging/hn-slider:transition-none data-disabled:cursor-not-allowed',
  ],
})

export const sliderMarks = tv({
  base: 'pointer-events-none absolute inset-x-[calc(var(--hn-slider-thumb)/2+0.25rem)] top-1/2 h-0',
})

export const sliderMark = tv({
  base: 'border-line-strong bg-surface block size-1.5 shrink-0 rounded-full border',
})

export const sliderMarkLabels = tv({
  base: 'text-muted relative mx-[calc(var(--hn-slider-thumb)/2+0.25rem)] h-4 text-xs',
})

export type SliderVariants = VariantProps<typeof slider>
