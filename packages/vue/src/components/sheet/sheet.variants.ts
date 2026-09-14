import { tv } from '../../lib/tv'

export const sheetPanel = tv({
  base: [
    'hn-anim-sheet-bottom hn-transition pointer-events-auto fixed inset-x-0 bottom-0 z-(--hn-z-overlay)',
    'mx-auto flex max-h-[calc(100dvh-3rem)] w-full flex-col gap-4 sm:max-w-xl',
    'rounded-t-xl rounded-b-none border-b-0 shadow-lg outline-none',
    'pb-[max(var(--hn-panel-p),env(safe-area-inset-bottom))]',
    'data-dragging:transition-none',
  ],
  variants: {
    grip: { true: 'pt-2', false: 'pt-(--hn-panel-p)' },
  },
  defaultVariants: { grip: true },
})

export const sheetGrip = tv({
  base: 'flex shrink-0 cursor-grab touch-none flex-col select-none data-dragging:cursor-grabbing',
})

export const sheetHandle = tv({
  base: 'bg-line-strong hn-transition-base mx-auto h-1.5 w-10 rounded-full data-disabled:opacity-50',
  variants: {
    header: { true: 'mb-3', false: '' },
  },
  defaultVariants: { header: true },
})
