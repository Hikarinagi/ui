import { tv, type VariantProps } from '../lib/tv'
export const dataList = tv({ base: '@container/hn-data-list flex w-full min-w-0 flex-col gap-4' })
export const dataListHeader = tv({
  base: 'flex min-w-0 flex-wrap items-center justify-between gap-3',
})
export const dataListBody = tv({ base: 'relative isolate grid min-h-0 min-w-0 grid-cols-1' })
export const dataListFooter = tv({
  base: 'flex min-w-0 flex-wrap items-center justify-between gap-3',
})
export const dataListPager = tv({ base: 'ms-auto min-w-0 max-w-full' })
export const dataListAnnouncement = tv({ base: 'sr-only' })
export const dataListLoading = tv({ base: '[border-radius:inherit]' })
export const dataListViewport = tv({ base: 'h-full min-h-0 [border-radius:inherit]' })
export const dataListContent = tv({
  base: 'm-0 min-w-0 list-none p-0',
  variants: {
    layout: {
      list: 'flex flex-col',
      grid: 'grid grid-cols-[repeat(auto-fill,minmax(min(100%,var(--hn-data-list-min)),1fr))]',
    },
    gap: {
      none: 'gap-0',
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-x-[var(--hn-inline-gap)] gap-y-[var(--hn-stack-gap)]',
      lg: 'gap-6',
      xl: 'gap-8',
    },
  },
})
export const dataListSpacer = tv({ base: 'pointer-events-none col-span-full list-none' })
export const dataListItem = tv({
  base: 'min-w-0',
  variants: {
    layout: { list: '', grid: '' },
    divided: { true: '', false: '' },
    size: {
      sm: 'text-sm [--hn-data-list-media:calc(var(--hn-control-h-sm)*2)] [--hn-data-list-padding:calc(var(--hn-stack-gap)*0.75)]',
      md: 'text-base [--hn-data-list-media:calc(var(--hn-control-h-md)*2)] [--hn-data-list-padding:var(--hn-stack-gap)]',
      lg: 'text-base [--hn-data-list-media:calc(var(--hn-control-h-lg)*2)] [--hn-data-list-padding:calc(var(--hn-stack-gap)*1.5)]',
    },
    structured: { true: '', false: '' },
  },
  compoundVariants: [
    { layout: 'list', class: 'py-(--hn-data-list-padding)' },
    { layout: 'list', divided: true, class: 'border-line not-last:border-b' },
    {
      layout: 'grid',
      structured: true,
      class: 'rounded-lg border border-line bg-surface',
    },
  ],
  defaultVariants: { layout: 'list', divided: true, size: 'md' },
})
export const dataListAnatomy = tv({
  base: 'flex min-w-0',
  variants: {
    layout: { list: 'items-center gap-(--hn-stack-gap)', grid: 'h-full flex-col' },
  },
})
export const dataListMedia = tv({
  base: 'bg-inset shrink-0 overflow-hidden',
  variants: {
    layout: {
      list: 'aspect-square w-(--hn-data-list-media) rounded-md',
      grid: 'aspect-[16/10] w-full rounded-t-lg',
    },
  },
})
export const dataListDetails = tv({
  base: 'flex min-w-0 flex-1 gap-(--hn-inline-gap)',
  variants: {
    layout: {
      list: 'flex-col @lg/hn-data-list:flex-row @lg/hn-data-list:items-center @lg/hn-data-list:gap-6',
      grid: 'flex-col p-(--hn-data-list-padding)',
    },
  },
})
export const dataListCopy = tv({ base: 'flex min-w-0 flex-1 flex-col gap-1' })
export const dataListTitle = tv({ base: 'font-medium text-fg [overflow-wrap:anywhere]' })
export const dataListDescription = tv({ base: 'text-sm text-muted [overflow-wrap:anywhere]' })
export const dataListMeta = tv({
  base: 'mt-1 flex min-w-0 flex-wrap items-center gap-2 text-xs text-muted',
})
export const dataListActions = tv({
  base: 'flex max-w-full shrink-0 flex-wrap items-center gap-2',
  variants: { layout: { list: '', grid: 'mt-auto' } },
})
export const dataListStatus = tv({
  base: 'flex h-full min-h-0 items-center justify-center px-4 py-6 text-muted',
})
export const dataListPagination = tv({ base: 'flex max-w-full items-center justify-end gap-2' })
export const dataListPlaceholder = tv({
  variants: {
    part: {
      media: 'size-full',
      title: 'h-lh w-1/2 rounded-sm',
      description: 'h-lh w-3/4 rounded-sm',
      meta: 'h-lh w-1/3 rounded-sm',
      action: 'h-(--hn-control-h-sm) w-16 rounded-md',
    },
  },
})
export type DataListContentVariants = VariantProps<typeof dataListContent>
export type DataListItemVariants = VariantProps<typeof dataListItem>
