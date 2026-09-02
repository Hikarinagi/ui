import { tv } from '../../lib/tv'

export const treeSelectContent = tv({
  base: [
    'hn-anim-pop z-(--hn-z-overlay) flex w-[var(--reka-popover-trigger-width)] min-w-40 flex-col overflow-hidden shadow-md outline-none',
  ],
})

export const treeSelectList = tv({
  base: 'max-h-[min(20rem,var(--reka-popover-content-available-height))]',
})

export const treeSelectRow = tv({
  base: [
    'hn-interactive hn-state-layer hn-press-none relative isolate flex w-full cursor-pointer',
    'items-center gap-1 rounded-md py-2 pe-2.5 text-start text-sm select-none',
    'text-fg [&_svg]:size-4 [&_svg]:shrink-0',
    'data-disabled:pointer-events-none data-disabled:opacity-50',
  ],
})

export const treeSelectToggle = tv({
  base: [
    'text-muted flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-sm',
    '[&>span>svg]:size-3.5',
  ],
})
