import { tv, type VariantProps } from '../../lib/tv'

export const navLink = tv({
  base: [
    'hn-interactive hn-state-layer hn-press-none relative isolate flex cursor-pointer items-center',
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
  base: 'shrink-0 whitespace-nowrap',
  variants: {
    rail: {
      true: 'opacity-0 [transition:opacity_calc(var(--hn-duration-fast)/2)_var(--hn-ease-exit)]',
      false: 'opacity-100 [transition:opacity_var(--hn-duration-fast)_var(--hn-ease-enter)]',
    },
  },
  defaultVariants: { rail: false },
})

export type NavLinkVariants = VariantProps<typeof navLink>
