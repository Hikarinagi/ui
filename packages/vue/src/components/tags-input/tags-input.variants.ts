import { tv, type VariantProps } from '../../lib/tv'

export const tagsInputHost = tv({
  base: 'relative h-auto min-h-[var(--hn-input-h)] gap-1 ps-[var(--hn-input-px)]',
  variants: {
    size: {
      sm: 'py-[calc((0.25rem-2px)/2)]',
      md: 'py-[calc((var(--hn-control-h-md)-var(--hn-control-h-sm)-2px)/2)]',
      lg: 'py-[calc((var(--hn-control-h-lg)-var(--hn-control-h-sm)-2px)/2)]',
    },
    trailing: {
      true: 'pe-[var(--hn-input-h)]',
      false: 'pe-[var(--hn-input-px)]',
    },
  },
  defaultVariants: { size: 'md', trailing: false },
})

export const tagsInputList = tv({
  base: 'flex min-w-0 flex-1 flex-wrap items-center gap-1',
})

export const tagsInputRow = tv({
  base: 'h-[var(--hn-control-h-sm)]',
  variants: {
    size: {
      sm: 'h-[calc(var(--hn-control-h-sm)-0.25rem)]',
      md: '',
      lg: '',
    },
  },
  defaultVariants: { size: 'md' },
})

export const tagsInputControl = tv({
  extend: tagsInputRow,
  base: [
    'min-w-20 flex-1 bg-transparent text-inherit outline-none [font:inherit]',
    'placeholder:text-faint placeholder:font-normal disabled:cursor-not-allowed',
  ],
})

export const tagsInputChip = tv({
  base: 'max-w-full min-w-0 shrink data-disabled:opacity-100',
})

export type TagsInputVariants = VariantProps<typeof tagsInputHost>
