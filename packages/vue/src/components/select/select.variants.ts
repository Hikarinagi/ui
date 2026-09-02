import { tv } from '../../lib/tv'

export const selectTrigger = tv({
  base: [
    'group/hn-disclosure cursor-pointer items-center gap-2 px-[var(--hn-input-px)] text-start',
    'data-placeholder:text-faint data-placeholder:font-normal',
    'disabled:cursor-not-allowed disabled:opacity-50',
    '[&_svg]:size-[var(--hn-input-icon)] [&_svg]:shrink-0',
  ],
})

export const selectContent = tv({
  base: [
    'hn-anim-pop z-(--hn-z-overlay) flex w-[var(--reka-select-trigger-width)] min-w-40 flex-col p-1 shadow-md outline-none',
  ],
})

export const selectList = tv({
  base: 'max-h-[min(20rem,var(--reka-select-content-available-height))]',
})

export const selectItem = tv({
  base: [
    'hn-interactive hn-state-layer hn-press-none relative isolate flex w-full cursor-pointer',
    'items-center gap-[var(--hn-control-gap)] rounded-md px-2.5 py-2 text-start text-sm select-none',
    'text-fg outline-none [&_svg]:size-4 [&_svg]:shrink-0',
    'data-disabled:pointer-events-none data-disabled:opacity-50',
  ],
})

export const selectLabel = tv({
  base: 'text-muted px-2.5 py-1.5 text-xs font-medium',
})

export const selectEmpty = tv({
  base: 'text-muted px-2.5 py-2 text-sm',
})
