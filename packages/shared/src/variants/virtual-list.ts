import { tv } from '../lib/tv'

export const virtualList = tv({
  base: 'relative flex w-full min-h-0 min-w-0 flex-col overflow-hidden',
})

export const virtualListContent = tv({
  base: 'relative m-0 flex list-none p-0 [overflow-anchor:none]',
  variants: {
    orientation: {
      vertical: 'flex-col',
      horizontal: 'flex-row',
    },
  },
})

export const virtualListItem = tv({
  base: 'flow-root min-w-0 shrink-0',
  variants: {
    orientation: {
      vertical: 'w-full',
      horizontal: 'h-full w-max',
    },
  },
})

export const virtualListStatus = tv({
  base: 'text-muted flex shrink-0 items-center justify-center gap-2 p-4 text-sm',
})
