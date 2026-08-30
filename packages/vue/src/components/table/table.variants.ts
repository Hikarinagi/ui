import { tv, type VariantProps } from '../../lib/tv'

export const tableWrapper = tv({
  base: [
    'max-w-full rounded-lg',
    '[&_th]:h-(--hn-row-h) [&_td]:h-(--hn-row-h)',
    '[&_th]:py-0 [&_td]:py-0',
    '[&_caption>span]:sticky [&_caption>span]:start-[0.75em] [&_caption>span]:inline-block',
    '[&_tbody_tr:last-child_td]:border-b-0',
  ],
  variants: {
    variant: {
      primary:
        'bg-surface border-line border shadow-sm [&_thead_th]:bg-subtle [--hn-table-bg:var(--hn-surface)] [--hn-table-head-bg:var(--hn-bg-subtle)]',
      secondary:
        '[&_thead_th]:bg-inset [&_thead_th:first-child]:rounded-ss-md [&_thead_th:last-child]:rounded-se-md [--hn-table-bg:var(--hn-bg-canvas)] [--hn-table-head-bg:var(--hn-bg-inset)]',
    },
    hover: {
      true: '[&_tbody_tr]:hn-state-layer',
      false: '',
    },
    stickyHeader: {
      true: '[&_thead_th]:sticky [&_thead_th]:top-0 [&_thead_th]:z-[2]',
      false: '',
    },
  },
  defaultVariants: { variant: 'primary', hover: true, stickyHeader: false },
})

export type TableVariants = VariantProps<typeof tableWrapper>

export const tableCell = tv({
  base: '',
  variants: {
    align: {
      start: '',
      center: 'text-center',
      end: 'text-end',
    },
    sticky: {
      true: 'border-line sticky start-0 z-[1] border-e',
      false: '',
    },
    head: {
      true: '',
      false: '',
    },
  },
  compoundVariants: [
    { sticky: true, head: false, class: 'bg-(--hn-table-bg)' },
    { sticky: true, head: true, class: 'bg-(--hn-table-head-bg) z-[3]!' },
  ],
  defaultVariants: { align: 'start', sticky: false, head: false },
})

export type TableCellVariants = VariantProps<typeof tableCell>
