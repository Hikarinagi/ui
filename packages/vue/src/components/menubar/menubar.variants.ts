import { tv } from '../../lib/tv'

export const menubarRoot = tv({
  base: 'bg-surface border-line inline-flex items-center gap-0.5 rounded-lg border p-1',
})

export const menubarTrigger = tv({
  base: [
    'hn-interactive hn-state-layer hn-press-none relative isolate inline-flex h-8 shrink-0 items-center',
    'text-fg gap-1.5 rounded-md px-2.5 text-sm font-medium outline-none select-none',
    'data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
  ],
})

export const menubarContent = tv({
  base: 'hn-anim-pop z-(--hn-z-overlay) flex min-w-40 flex-col gap-0.5 p-1 shadow-md outline-none',
})
