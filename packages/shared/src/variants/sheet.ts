import { tv } from '../lib/tv'

export const sheetPanel = tv({
  base: [
    'hn-anim-sheet-bottom hn-transition pointer-events-auto fixed inset-x-0 bottom-0 z-(--hn-z-overlay)',
    'mx-auto flex max-h-[calc(100dvh-3rem)] w-full flex-col sm:max-w-xl',
    'rounded-t-xl rounded-b-none border-b-0 shadow-lg outline-none',
    'data-dragging:transition-none',
  ],
  variants: {
    padded: { true: 'gap-4 pb-[max(var(--hn-panel-p),env(safe-area-inset-bottom))]' },
    grip: { true: '', false: '' },
  },
  compoundVariants: [
    { padded: true, grip: true, class: 'pt-2' },
    { padded: true, grip: false, class: 'pt-(--hn-panel-p)' },
  ],
  defaultVariants: { grip: true, padded: true },
})

export const sheetGrip = tv({
  base: 'flex shrink-0 cursor-grab touch-none flex-col select-none data-dragging:cursor-grabbing',
  variants: { standalone: { true: 'py-2' } },
})

export const sheetHandle = tv({
  base: 'bg-line-strong hn-transition-base mx-auto h-1.5 w-10 rounded-full data-disabled:opacity-50',
  variants: {
    header: { true: 'mb-3', false: '' },
  },
  defaultVariants: { header: true },
})
