import { tv } from '../lib/tv'

export const lineClampRoot = tv({
  base: 'flex min-w-0 flex-col items-start gap-1',
})

export const lineClampContent = tv({
  base: 'hn-line-clamp w-full min-w-0',
})
