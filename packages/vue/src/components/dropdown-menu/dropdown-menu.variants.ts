import { tv, type VariantProps } from '../../lib/tv'

export const dropdownItem = tv({
  base: [
    'hn-interactive hn-state-layer hn-press-none relative isolate flex w-full cursor-pointer',
    'items-center gap-[var(--hn-control-gap)] rounded-md px-2.5 py-2 text-start text-sm select-none',
    'outline-none [&_svg]:size-4 [&_svg]:shrink-0',
    'data-disabled:pointer-events-none data-disabled:opacity-50',
  ],
  variants: {
    tone: {
      neutral: 'text-fg',
      danger: 'text-danger-text [--hn-state-color:var(--hn-danger)]',
    },
  },
  defaultVariants: { tone: 'neutral' },
})

export type DropdownItemVariants = VariantProps<typeof dropdownItem>
