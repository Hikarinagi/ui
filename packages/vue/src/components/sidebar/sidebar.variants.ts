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
    footer: { true: 'border-line w-full border-t' },
  },
})

export const sidebarLabel = tv({
  base: 'hn-sidebar-label min-w-0',
})

export const sidebarBrand = tv({
  base: 'flex min-h-8 items-center gap-2',
})

export const sidebarIcon = tv({
  base: 'flex size-8 shrink-0 items-center justify-center overflow-hidden [&>*]:size-full [&_img]:size-full [&_img]:object-contain [&_svg]:size-full',
})

export const sidebarWordmark = tv({
  base: 'flex flex-1 items-center [&_img]:max-h-8 [&_img]:max-w-full [&_img]:object-contain [&_svg]:max-h-8 [&_svg]:max-w-full',
})
