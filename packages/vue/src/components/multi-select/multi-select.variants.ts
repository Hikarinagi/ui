import { tv } from '../../lib/tv'

export const multiSelectTrigger = tv({
  base: [
    'group/hn-disclosure cursor-pointer items-center gap-2 px-[var(--hn-input-px)] text-start',
    'data-placeholder:text-faint data-placeholder:font-normal',
    'data-disabled:cursor-not-allowed data-disabled:opacity-50',
  ],
})

export const multiSelectChips = tv({
  base: 'flex min-w-0 flex-1 items-center gap-1 overflow-hidden',
})
