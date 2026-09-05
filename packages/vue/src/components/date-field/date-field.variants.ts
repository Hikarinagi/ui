import { tv, type VariantProps } from '../../lib/tv'

export const dateFieldHost = tv({
  base: 'data-disabled:cursor-not-allowed data-disabled:opacity-50',
})

export const dateFieldControl = tv({
  base: 'flex h-full min-w-0 flex-1 items-center px-[var(--hn-input-px)] tabular-nums select-none',
  variants: {
    leading: {
      true: 'ps-0',
    },
    trailing: {
      true: 'pe-0',
    },
  },
})

export const dateFieldSegment = tv({
  base: 'hn-transition rounded-xs outline-none',
  variants: {
    part: {
      literal: 'text-faint px-px',
      editable: [
        'px-0.5 focus:bg-accent-soft focus:text-accent-text',
        'data-placeholder:text-faint data-placeholder:font-normal data-disabled:cursor-not-allowed',
      ],
    },
  },
  defaultVariants: { part: 'editable' },
})

export type DateFieldVariants = VariantProps<typeof dateFieldSegment>
