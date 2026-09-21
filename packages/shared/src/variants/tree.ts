import { tv } from '../lib/tv'

export const tree = tv({
  base: 'flex w-full min-w-0 flex-col outline-none',
})

export const treeRow = tv({
  base: [
    'hn-interactive hn-state-layer hn-press-none relative isolate flex w-full cursor-pointer',
    'items-center gap-(--hn-control-gap) rounded-md py-2 pe-2.5 text-start text-sm select-none',
    'ps-[calc(0.375rem+var(--hn-tree-level)*1.25rem)] text-fg outline-none',
    'data-disabled:pointer-events-none data-disabled:opacity-50',
  ],
})

export const treeToggle = tv({
  base: 'text-muted flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-sm rtl:-scale-x-100 [&>span>svg]:size-3.5',
})

export const treeEmpty = tv({
  base: 'text-muted px-2.5 py-2 text-sm',
})
