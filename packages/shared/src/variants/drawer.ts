import { tv, type VariantProps } from '../lib/tv'

export const drawerCard = tv({
  base: [
    'hn-anim-drawer pointer-events-auto fixed inset-y-0 z-(--hn-z-overlay) flex flex-col',
    'max-w-[calc(100vw-3rem)] rounded-none shadow-lg outline-none',
  ],
  variants: {
    padded: { true: 'gap-4 py-(--hn-panel-p)' },
    side: {
      start: 'start-0',
      end: 'end-0',
    },
    size: {
      sm: 'w-72',
      md: 'w-90',
      lg: 'w-120',
    },
  },
  defaultVariants: { side: 'end', size: 'md', padded: true },
})

export type DrawerVariants = VariantProps<typeof drawerCard>
