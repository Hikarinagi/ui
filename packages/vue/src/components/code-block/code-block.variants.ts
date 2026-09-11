import { tv } from '../../lib/tv'

export const codeBlock = tv({
  base: 'relative flex min-h-0 min-w-0 flex-col',
})

export const codeBlockArea = tv({
  base: 'hn-pre min-h-0 grow p-0',
})

export const codeBlockContent = tv({
  base: 'hn-pre-content m-0 w-max min-w-full',
})

export const codeBlockActions = tv({
  base: 'absolute top-2 end-2 flex items-center gap-2',
})

export const codeBlockLabel = tv({
  base: 'text-faint font-mono text-xs select-none',
})
