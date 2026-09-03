import { tv, type VariantProps } from '../../lib/tv'

export const segmentedControl = tv({
  base: [
    'group/hn-segmented bg-inset relative isolate max-w-full rounded-md p-1 select-none',
    'data-disabled:cursor-not-allowed data-disabled:opacity-50',
  ],
  variants: {
    orientation: {
      horizontal: 'flex-row',
      vertical: 'flex-col',
    },
    block: {
      true: 'flex w-full',
      false: 'inline-flex w-fit',
    },
  },
  defaultVariants: { orientation: 'horizontal', block: false },
})

export const segmentedItem = tv({
  base: [
    'hn-interactive hn-state-layer hn-press-none text-muted relative z-[1] inline-flex shrink-0 items-center justify-center',
    'gap-[var(--hn-control-gap)] rounded-xs font-medium whitespace-nowrap',
    '[--hn-state-selected-opacity:0] [--hn-state-selected-color:var(--hn-fg-muted)] aria-pressed:z-0 aria-pressed:text-fg',
    'disabled:pointer-events-none disabled:not-in-data-disabled:opacity-50',
  ],
  variants: {
    size: {
      sm: 'h-[calc(var(--hn-control-h-sm)-(--spacing(2)))] px-[var(--hn-control-px-sm)] text-sm [&_svg]:size-3.5',
      md: 'h-[calc(var(--hn-control-h-md)-(--spacing(2)))] px-[var(--hn-control-px-md)] text-base [&_svg]:size-4',
      lg: 'h-[calc(var(--hn-control-h-lg)-(--spacing(2)))] px-[var(--hn-control-px-lg)] text-md [&_svg]:size-[1.125rem]',
    },
    block: {
      true: 'flex-1 basis-0',
    },
  },
  defaultVariants: { size: 'md' },
})

export const segmentedThumb = tv({
  base: 'bg-surface absolute inset-0 -z-10 rounded-xs shadow-sm',
})

export type SegmentedControlVariants = VariantProps<typeof segmentedControl>
export type SegmentedItemVariants = VariantProps<typeof segmentedItem>
