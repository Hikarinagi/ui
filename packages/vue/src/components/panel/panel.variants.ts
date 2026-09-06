import { tv, type VariantProps } from '../../lib/tv'

export const panelHeader = tv({
  base: 'flex items-start justify-between gap-4 px-(--hn-panel-p) pt-(--hn-panel-p)',
})

export const panelTitle = tv({
  base: 'flex min-w-0 items-center gap-2',
})

export const panelIcon = tv({
  base: 'text-muted flex shrink-0 [&_svg]:size-4.5',
})

export const panelActions = tv({
  base: 'flex shrink-0 items-center gap-2',
})

export const panelBody = tv({
  base: 'pt-4',
  variants: {
    padded: {
      true: 'px-(--hn-panel-p) pb-(--hn-panel-p)',
    },
  },
  defaultVariants: { padded: true },
})

export type PanelVariants = VariantProps<typeof panelBody>
