import { tv } from '../lib/tv'

export const commandWrapper = tv({
  base: 'pointer-events-none fixed inset-0 z-(--hn-z-overlay) grid items-start justify-items-center p-4 pt-[15dvh] max-sm:pt-4',
})

export const commandCard = tv({
  base: 'flex w-full max-w-xl flex-col overflow-hidden outline-none',
  variants: {
    inline: {
      false: 'hn-anim-modal pointer-events-auto shadow-lg',
    },
  },
  defaultVariants: {
    inline: false,
  },
})

export const commandInputRow = tv({
  base: 'border-line text-muted flex h-12 shrink-0 items-center gap-2.5 border-b px-4 [&>svg]:size-4 [&>svg]:shrink-0',
})

export const commandInput = tv({
  base: 'text-fg placeholder:text-faint h-full min-w-0 flex-1 bg-transparent text-sm outline-none',
})

export const commandList = tv({
  base: 'max-h-[min(24rem,60dvh)]',
})

export const commandItemBody = tv({
  base: 'flex min-w-0 flex-1 flex-col',
})

export const commandItemMatch = tv({
  base: 'text-accent-text font-medium',
})

export const commandItemHint = tv({
  base: 'ms-auto flex shrink-0 items-center gap-1',
})

export const commandEmpty = tv({
  base: 'text-muted px-4 py-8 text-center text-sm',
})

export const commandHeading = tv({
  base: 'text-muted flex min-h-7 items-center justify-between gap-2 px-2.5 text-xs font-medium',
})

export const commandGrid = tv({
  base: 'grid grid-cols-[minmax(0,1fr)] p-1',
})

export const commandGridRows = tv({
  base: 'col-start-1 grid grid-rows-subgrid',
})

export const commandStatus = tv({
  base: 'border-line text-muted shrink-0 border-t px-4 py-2 text-center text-sm',
})
