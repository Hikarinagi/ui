import { tv } from '../../lib/tv'

export const sidebarRoot = tv({
  base: 'flex h-full min-h-0 shrink-0 flex-col overflow-hidden',
  variants: {
    inDrawer: {
      true: 'w-full',
      false:
        'hn-sidebar border-line w-64 border-e data-[state=rail]:w-14 data-[state=hidden]:w-0 data-[state=hidden]:border-e-transparent',
    },
  },
})

export const sidebarRegion = tv({
  base: 'shrink-0 py-3',
  variants: {
    inDrawer: { true: 'w-full', false: 'w-[calc(16rem-1px)] px-3' },
    footer: { true: 'border-line border-t' },
  },
})

export const sidebarLabel = tv({
  base: 'hn-sidebar-label min-w-0',
})
