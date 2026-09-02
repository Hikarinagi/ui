import { tv } from '../../lib/tv'

export const comboboxContent = tv({
  base: [
    'hn-anim-pop z-(--hn-z-overlay) flex w-[var(--reka-combobox-trigger-width)] min-w-40 flex-col overflow-hidden shadow-md outline-none',
    '[&[data-hn-fresh]_[data-highlighted]:not(:hover)]:[--hn-state-hover-opacity:0]',
  ],
})

export const comboboxList = tv({
  base: 'max-h-[min(20rem,var(--reka-combobox-content-available-height))]',
})

export const comboboxToggle = tv({
  base: [
    'text-muted flex shrink-0 cursor-pointer items-center self-stretch ps-2 pe-[var(--hn-input-px)] outline-none',
    'disabled:pointer-events-none data-disabled:pointer-events-none',
  ],
})
