import { h, type VNode } from 'vue'
import type { ReactElement } from 'react'
import * as V from '@hina-ui/vue'
import * as R from '@hina-ui/react'
import { defineCases, type ParityCase } from '../src/cases'

const items = Array.from({ length: 23 }, (_, id) => ({
  id,
  label: `Item ${id}`,
  note: id % 2 ? `Note ${id}` : '',
}))
const many = Array.from({ length: 10000 }, (_, id) => ({ id, label: `Item ${id}`, note: '' }))
type Item = (typeof items)[number]
type Props = Omit<R.DataListProps<Item>, 'items' | 'itemKey'> & {
  items?: readonly Item[]
}

type Slots = {
  default?: (entry: R.DataListItemSlot<Item>) => string
  media?: (entry: R.DataListItemSlot<Item>) => string
  title?: (entry: R.DataListItemSlot<Item>) => string
  description?: (entry: R.DataListItemSlot<Item>) => string
  meta?: (entry: R.DataListItemSlot<Item>) => string
  actions?: (entry: R.DataListItemSlot<Item>) => string
  placeholder?: (entry: R.DataListPlaceholderSlot) => string
  header?: (state: R.DataListState<Item>) => string
  footer?: (state: R.DataListState<Item>) => string
  pagination?: (state: R.DataListState<Item>) => string
  empty?: (state: R.DataListState<Item>) => string
  loading?: (state: R.DataListState<Item>) => string
}

function both(name: string, props: Props, slots: Slots = {}): ParityCase {
  const { className, ...rest } = props
  const vueSlots = Object.fromEntries(
    Object.entries(slots).map(([slot, render]) => [
      slot,
      (scope: never) =>
        h('span', { 'data-slot': slot }, (render as (scope: never) => string)(scope)),
    ]),
  )
  const span = (slot: string, text: string) => <span data-slot={slot}>{text}</span>
  return {
    name,
    vue: (): VNode =>
      h(
        V.DataList<Item>,
        {
          items,
          itemKey: 'id',
          ...(rest as Record<string, unknown>),
          ...(className ? { class: className } : {}),
        },
        vueSlots,
      ),
    react: (): ReactElement => (
      <R.DataList<Item>
        items={items}
        itemKey="id"
        {...rest}
        className={className}
        children={slots.default && (entry => span('default', slots.default!(entry)))}
        renderMedia={slots.media && (entry => span('media', slots.media!(entry)))}
        renderTitle={slots.title && (entry => span('title', slots.title!(entry)))}
        renderDescription={
          slots.description && (entry => span('description', slots.description!(entry)))
        }
        renderMeta={slots.meta && (entry => span('meta', slots.meta!(entry)))}
        renderActions={slots.actions && (entry => span('actions', slots.actions!(entry)))}
        renderPlaceholder={
          slots.placeholder && (entry => span('placeholder', slots.placeholder!(entry)))
        }
        renderHeader={slots.header && (state => span('header', slots.header!(state)))}
        renderFooter={slots.footer && (state => span('footer', slots.footer!(state)))}
        renderPagination={
          slots.pagination && (state => span('pagination', slots.pagination!(state)))
        }
        renderEmpty={slots.empty && (state => span('empty', slots.empty!(state)))}
        renderLoading={slots.loading && (state => span('loading', slots.loading!(state)))}
      />
    ),
  }
}

const label = ({ item, index }: R.DataListItemSlot<Item>) => `${item.label} (${index})`
const summary = (state: R.DataListState<Item>) =>
  `${state.page}/${state.pageCount ?? '?'} ${state.pageSize} ${state.total ?? '?'} ${state.items.length} ${state.layout} ${state.loading} ${state.refreshing} ${state.hasPreviousPage} ${state.hasNextPage}`

export default defineCases('DataList', [
  both('default structured list', { itemTitle: 'label', itemDescription: 'note', label: 'Items' }),
  both('item without fields', {}),
  both('title from a function', {
    itemTitle: (item, index) => `${item.label} #${index}`,
    itemDescription: item => (item.id % 3 ? item.id : null),
  }),
  both('default slot', { label: 'Items' }, { default: label }),
  both(
    'local pagination on page 2',
    { pagination: true, page: 2, pageSize: 10 },
    { default: label },
  ),
  both('local pagination last page', { pagination: true, page: 3 }, { default: label }),
  both('page beyond count is clamped', { pagination: true, page: 9 }, { default: label }),
  both('pagination with one page hides pager', { pagination: true, pageSize: 50 }),
  both(
    'manual remote page',
    { manual: true, pagination: true, page: 5, total: 103, items: items.slice(0, 3) },
    { default: label },
  ),
  both(
    'manual page with unknown total and next page',
    { manual: true, pagination: true, page: 3, hasNextPage: true, items: items.slice(0, 3) },
    { default: label },
  ),
  both(
    'manual first page with unknown total',
    { manual: true, pagination: true, hasNextPage: true, items: items.slice(0, 3) },
    { default: label },
  ),
  both('grid layout', { layout: 'grid', gridMin: '12rem', itemTitle: 'label' }),
  ...(['xs', 'sm', 'md', 'lg', 'xl'] as const).map(gridGap =>
    both(`grid gap ${gridGap}`, { layout: 'grid', gridGap, items: items.slice(0, 3) }),
  ),
  ...(['sm', 'md', 'lg'] as const).map(size =>
    both(`size ${size}`, { size, itemTitle: 'label', items: items.slice(0, 3) }),
  ),
  both('without dividers', { divided: false, itemTitle: 'label', items: items.slice(0, 3) }),
  both(
    'grid custom items are unstructured',
    { layout: 'grid', items: items.slice(0, 3) },
    { default: label },
  ),
  both(
    'virtual list on the server',
    { items: many, virtualize: { estimateSize: 64 }, height: 320, label: 'Items' },
    { default: label },
  ),
  both('virtual default options', { items: many, virtualize: true }, { default: label }),
  both(
    'virtual grid on the server',
    {
      items: many,
      layout: 'grid',
      virtualize: { initialColumns: 3, estimateSize: 100, overscan: 1 },
      height: 200,
    },
    { default: label },
  ),
  both(
    'invalid virtual estimates',
    { items: many, virtualize: { initialColumns: NaN, estimateSize: Infinity, overscan: NaN } },
    { default: label },
  ),
  both('manual virtual list with unknown total', {
    items: items.slice(0, 5),
    manual: true,
    virtualize: true,
  }),
  both('bounded height without virtualization', { height: 200, itemTitle: 'label' }),
  both('percentage height', { height: '100%', virtualize: true, itemTitle: 'label' }),
  both('string min height', { minHeight: '20rem', itemTitle: 'label', items: items.slice(0, 2) }),
  both('initial loading placeholders', { items: [], loading: true, itemTitle: 'label' }),
  both('initial loading with count', {
    items: [],
    loading: true,
    placeholderCount: 2,
    itemTitle: 'label',
    itemDescription: 'note',
  }),
  both('initial loading of a paged list', {
    items: [],
    loading: true,
    pagination: true,
    pageSize: 4,
    itemTitle: 'label',
  }),
  both('initial virtual loading ignores a large page size', {
    items: [],
    loading: true,
    pagination: true,
    pageSize: 10000,
    virtualize: true,
    itemTitle: 'label',
  }),
  both(
    'initial loading placeholders for structured slots',
    { items: [], loading: true, placeholderCount: 2, mediaRatio: 0.75, layout: 'grid' },
    {
      media: () => 'Cover',
      title: () => 'T',
      description: () => 'D',
      meta: () => 'M',
      actions: () => 'A',
    },
  ),
  both(
    'initial loading custom placeholder',
    { items: [], loading: true, placeholderCount: 2 },
    { placeholder: ({ index, layout }) => `${index} ${layout}` },
  ),
  both('initial loading slot', { items: [], loading: true }, { loading: summary }),
  both('refreshing existing rows', { loading: true, items: items.slice(0, 3), itemTitle: 'label' }),
  both(
    'refreshing with loading slot',
    { loading: true, items: items.slice(0, 3), itemTitle: 'label' },
    { loading: summary },
  ),
  both('empty default', { items: [] }),
  both('empty text', { items: [], emptyText: 'Nothing here' }),
  both('empty slot', { items: [] }, { empty: summary }),
  both(
    'structured slots',
    { items: items.slice(0, 2), itemTitle: 'label', mediaRatio: 0.75 },
    {
      media: ({ item }) => `Cover ${item.id}`,
      title: ({ item }) => `Title ${item.id}`,
      description: ({ index }) => `Description ${index}`,
      meta: ({ item }) => `Meta ${item.id}`,
      actions: ({ key }) => `Open ${key}`,
    },
  ),
  both(
    'grid structured slots',
    { items: items.slice(0, 2), layout: 'grid', itemDescription: 'note' },
    { media: () => 'Cover', actions: () => 'Act' },
  ),
  both('layout toggle', { layoutToggle: true, items: items.slice(0, 2) }),
  both('layout toggle in grid', { layoutToggle: true, layout: 'grid', items: items.slice(0, 2) }),
  both('header slot', { items: items.slice(0, 2) }, { header: summary }),
  both(
    'header, footer and pagination',
    { pagination: true, pageSize: 5, page: 2 },
    { header: summary, footer: summary },
  ),
  both('pagination slot', { pagination: true, pageSize: 50 }, { pagination: summary }),
  both('pagination slot when paged', { pagination: true, pageSize: 5 }, { pagination: summary }),
  both('pagination slot without pagination', {}, { pagination: summary, footer: summary }),
  both('classes', {
    className: 'max-w-2xl',
    bodyClass: 'rounded-lg border',
    contentClass: 'p-4',
    itemClass: 'py-1',
    items: items.slice(0, 3),
  }),
  both('item class function', {
    itemClass: (_item, index) => (index === 0 ? 'py-8' : undefined),
    items: items.slice(0, 3),
  }),
  both('root attributes', {
    id: 'list',
    dir: 'rtl',
    style: { width: '600px' },
    'data-test': 'list',
    items: items.slice(0, 2),
  }),
])
