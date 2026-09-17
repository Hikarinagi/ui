import { tv, type VariantProps } from '../lib/tv'

export const navLink = tv({
  base: [
    'hn-interactive hn-state-layer hn-press-none relative isolate flex cursor-pointer items-center',
    'data-disabled:pointer-events-none data-disabled:opacity-50',
    'h-9 gap-[var(--hn-control-gap)] rounded-md ps-2.5 pe-2 text-sm select-none',
    '[&_svg]:size-4 [&_svg]:shrink-0',
  ],
  variants: {
    active: {
      true: 'text-fg font-medium',
      false: 'text-muted',
    },
  },
  defaultVariants: { active: false },
})

export const navLinkLabel = tv({
  base: 'hn-sidebar-label shrink-0 whitespace-nowrap',
})
