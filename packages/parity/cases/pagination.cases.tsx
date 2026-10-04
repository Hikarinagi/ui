import { defineComponent, h, type VNode } from 'vue'
import type { ReactElement } from 'react'
import * as V from '@hina-ui/vue'
import { enUS as vueEnUS, provideUiLocale } from '@hina-ui/vue/locale'
import * as R from '@hina-ui/react'
import { UiLocaleProvider, enUS } from '@hina-ui/react/locale'
import { defineCases, type ParityCase } from '../src/cases'

const English = defineComponent({
  setup(_, { slots }) {
    provideUiLocale(vueEnUS)
    return () => slots.default?.()
  },
})

type Props = Omit<R.PaginationProps, 'children'>

function vueProps(props: Props) {
  const { total, value, pageSize, className, renderList, renderPage, renderEllipsis, ...rest } =
    props
  void renderList
  void renderPage
  void renderEllipsis
  return {
    total,
    ...(rest as Record<string, unknown>),
    ...(value !== undefined ? { modelValue: value } : {}),
    ...(pageSize !== undefined ? { pageSize } : {}),
    ...(className ? { class: className } : {}),
  }
}

function both(name: string, props: Props, options: { english?: boolean } = {}): ParityCase {
  return {
    name,
    vue: (): VNode => {
      const node = h(V.Pagination, vueProps(props))
      return options.english ? h(English, null, () => node) : node
    },
    react: (): ReactElement => {
      const node = <R.Pagination {...props} />
      return options.english ? <UiLocaleProvider messages={enUS}>{node}</UiLocaleProvider> : node
    },
  }
}

export default defineCases('Pagination', [
  both('default first page', { total: 200 }),
  both('first and last controls', { total: 200, showFirstLast: true }),
  both('middle page with both ellipses', { total: 200, value: 10 }),
  both('middle page with sibling count 0', { total: 200, value: 10, siblingCount: 0 }),
  both('sibling count 2', { total: 400, value: 20, siblingCount: 2, showFirstLast: true }),
  both('edges hidden', { total: 200, value: 10, showEdges: false }),
  both('edges hidden at start', { total: 200, value: 1, showEdges: false }),
  both('near the end', { total: 250, value: 24 }),
  both('last page with first and last', { total: 250, value: 25, showFirstLast: true }),
  both('empty total', { total: 0, value: 3, showFirstLast: true }),
  both('invalid numbers', {
    total: Number.NaN,
    pageSize: 0,
    value: Number.POSITIVE_INFINITY,
  }),
  both('fractional numbers', { total: 21.9, pageSize: 10.9, value: 2.8 }),
  both('page beyond count is clamped', { total: 72, value: 15 }),
  both('negative page is clamped', { total: 72, value: -4 }),
  both('custom label', { total: 200, label: 'Results pages' }),
  both('english locale', { total: 200, value: 10, showFirstLast: true }, { english: true }),
  both(
    'english info, size and jump',
    { total: 246, showInfo: true, showJump: true, pageSizeOptions: [10, 20, 50] },
    { english: true },
  ),
  both('rtl', { total: 200, value: 10, dir: 'rtl', showFirstLast: true }),
  both('ltr explicit', { total: 50, value: 3, dir: 'ltr' }),
  ...(['sm', 'md', 'lg'] as const).map(size =>
    both(`size ${size}`, { total: 50, value: 3, size, showJump: true, pageSizeOptions: [10] }),
  ),
  ...(['start', 'center', 'end', 'between'] as const).map(align =>
    both(`align ${align}`, { total: 50, align }),
  ),
  both('disabled', { total: 50, value: 3, disabled: true, showFirstLast: true }),
  both('pending', { total: 50, value: 3, pending: true, showInfo: true, showJump: true }),
  both('info, size and jump', {
    total: 246,
    value: 8,
    showInfo: true,
    showJump: true,
    pageSizeOptions: [10, 20, 50],
  }),
  both('page size outside options', {
    total: 246,
    pageSize: 25,
    pageSizeOptions: [50, 10, 20, 0, 2.5],
  }),
  both('empty page size options', { total: 246, pageSizeOptions: [] }),
  both('jump only', { total: 246, value: 3, showJump: true }),
  both('item count narrows info', { total: 250, value: 10, itemCount: 4, showInfo: true }),
  both('item count zero', { total: 250, value: 10, itemCount: 0, showInfo: true }),
  both('empty info', { total: 0, showInfo: true }),
  both('hide single page', { total: 5, hideSinglePage: true }),
  both('hide single page with multiple pages', { total: 50, hideSinglePage: true }),
  both('large page numbers', { total: 2000000, value: 100000, size: 'sm' }),
  both('root attributes', {
    total: 50,
    className: 'w-80',
    id: 'pages',
    style: { width: '264px' },
    'data-test': 'pagination',
  }),
  {
    name: 'custom page slot',
    vue: () =>
      h(
        V.Pagination,
        { total: 30, modelValue: 2 },
        {
          page: ({ page, selected }: { page: number; selected: boolean }) =>
            h('span', { 'data-active': selected }, 'P' + page),
        },
      ),
    react: () => (
      <R.Pagination
        total={30}
        value={2}
        renderPage={({ page, selected }) => (
          <span data-active={String(selected)}>{'P' + page}</span>
        )}
      />
    ),
  },
  {
    name: 'custom ellipsis slot',
    vue: () =>
      h(
        V.Pagination,
        { total: 200, modelValue: 10 },
        {
          ellipsis: ({ side, expanded }: { side: string; expanded: boolean }) =>
            h('span', { 'data-expanded': expanded }, side),
        },
      ),
    react: () => (
      <R.Pagination
        total={200}
        value={10}
        renderEllipsis={({ side, expanded }) => (
          <span data-expanded={String(expanded)}>{side}</span>
        )}
      />
    ),
  },
  {
    name: 'list slot',
    vue: () =>
      h(
        V.Pagination,
        { total: 50, modelValue: 2 },
        { list: (state: { from: number; to: number }) => h('p', `${state.from}-${state.to}`) },
      ),
    react: () => (
      <R.Pagination
        total={50}
        value={2}
        renderList={state => <p>{`${state.from}-${state.to}`}</p>}
      />
    ),
  },
  {
    name: 'list slot while pending',
    vue: () =>
      h(
        V.Pagination,
        { total: 50, pending: true },
        { list: () => h('button', { type: 'button' }, 'Item') },
      ),
    react: () => (
      <R.Pagination total={50} pending renderList={() => <button type="button">Item</button>} />
    ),
  },
  {
    name: 'list slot with hidden single page',
    vue: () =>
      h(
        V.Pagination,
        { total: 5, hideSinglePage: true },
        { list: () => h('span', '列表插槽始终保留。') },
      ),
    react: () => (
      <R.Pagination total={5} hideSinglePage renderList={() => <span>列表插槽始终保留。</span>} />
    ),
  },
  {
    name: 'composed default slot',
    vue: () =>
      h(
        V.Pagination,
        { total: 140, modelValue: 3, pageSizeOptions: [10, 20], align: 'between' },
        {
          default: () => [
            h(
              V.PaginationInfo,
              {},
              {
                default: (state: { from: number; to: number }) =>
                  h('span', 'Range ' + state.from + '–' + state.to),
              },
            ),
            h(V.PaginationContent),
            h(V.PaginationSize),
            h(V.PaginationJump),
          ],
        },
      ),
    react: () => (
      <R.Pagination total={140} value={3} pageSizeOptions={[10, 20]} align="between">
        <R.PaginationInfo>
          {state => <span>{'Range ' + state.from + '–' + state.to}</span>}
        </R.PaginationInfo>
        <R.PaginationContent />
        <R.PaginationSize />
        <R.PaginationJump />
      </R.Pagination>
    ),
  },
  {
    name: 'default slot receives state',
    vue: () =>
      h(
        V.Pagination,
        { total: 90, modelValue: 4 },
        {
          default: (state: { page: number; pageCount: number }) =>
            h('span', `${state.page} of ${state.pageCount}`),
        },
      ),
    react: () => (
      <R.Pagination total={90} value={4}>
        {state => <span>{`${state.page} of ${state.pageCount}`}</span>}
      </R.Pagination>
    ),
  },
  {
    name: 'parts with classes and attributes',
    vue: () =>
      h(
        V.Pagination,
        { total: 90, modelValue: 4, pageSizeOptions: [10, 30] },
        {
          default: () => [
            h(V.PaginationInfo, { class: 'text-xs', 'data-part': 'info' }),
            h(V.PaginationContent, { class: 'gap-2', 'data-part': 'content' }),
            h(V.PaginationSize, { class: 'w-32', 'data-part': 'size' }),
            h(V.PaginationJump, { class: 'gap-1', 'data-part': 'jump' }),
          ],
        },
      ),
    react: () => (
      <R.Pagination total={90} value={4} pageSizeOptions={[10, 30]}>
        <R.PaginationInfo className="text-xs" data-part="info" />
        <R.PaginationContent className="gap-2" data-part="content" />
        <R.PaginationSize className="w-32" data-part="size" />
        <R.PaginationJump className="gap-1" data-part="jump" />
      </R.Pagination>
    ),
  },
  {
    name: 'info slot with page count',
    vue: () =>
      h(
        V.Pagination,
        { total: 180, modelValue: 4 },
        {
          default: () => [
            h(
              V.PaginationInfo,
              {},
              {
                default: ({ page, pageCount }: { page: number; pageCount: number }) =>
                  `${page} / ${pageCount}`,
              },
            ),
          ],
        },
      ),
    react: () => (
      <R.Pagination total={180} value={4}>
        <R.PaginationInfo>{({ page, pageCount }) => `${page} / ${pageCount}`}</R.PaginationInfo>
      </R.Pagination>
    ),
  },
])
