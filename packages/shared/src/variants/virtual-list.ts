import { tv } from '../lib/tv'

export const virtualList = tv({
  base: 'relative flex w-full min-h-0 min-w-0 flex-col',
})

export const virtualListContent = tv({
  base: 'relative m-0 list-none p-0 [overflow-anchor:none]',
})

export const virtualListItem = tv({
  base: 'absolute start-0 top-0 flow-root min-w-0',
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
