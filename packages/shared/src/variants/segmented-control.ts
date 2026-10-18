import { tv, type VariantProps } from '../lib/tv'

export const segmentedScroll = tv({
  base: 'bg-inset max-w-full rounded-md select-none',
  variants: {
    orientation: {
      horizontal: '',
      vertical: 'max-h-full',
    },
    block: {
      true: 'w-full',
      false: 'inline-grid w-fit',
    },
    disabled: {
      true: 'cursor-not-allowed opacity-50',
    },
  },
  defaultVariants: { orientation: 'horizontal', block: false },
})

export const segmentedControl = tv({
  base: 'group/hn-segmented relative isolate flex p-1',
  variants: {
    orientation: {
      horizontal: 'flex-row',
      vertical: 'flex-col',
    },
    block: {
      true: 'w-full min-w-fit',
      false: 'w-fit',
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
