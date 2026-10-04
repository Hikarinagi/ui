import { defineComponent, h, type VNode } from 'vue'
import type { ReactNode } from 'react'
import VDataTable from '@hina-ui/vue/components/data-table/DataTable.vue'
import { enUS as vueEnUS, provideUiLocale } from '@hina-ui/vue/locale'
import { DataTable } from '@hina-ui/react/components/data-table/DataTable'
import { UiLocaleProvider, enUS } from '@hina-ui/react/locale'
import type {
  DataTableCellContext,
  DataTableColumn,
  DataTableGroupContext,
  DataTableHeaderContext,
  DataTableRowContext,
  DataTableState,
} from '@hina-ui/react/components/data-table/types'
import { defineCases, type ParityCase } from '../src/cases'

interface Item {
  id: number
  name: string
  status: 'active' | 'draft' | 'archived'
  count: number | null
  enabled: boolean
  children?: Item[]
}

const items: Item[] = Array.from({ length: 12 }, (_, index) => ({
  id: index + 1,
  name: `Entry ${String.fromCharCode(65 + index)}`,
  status: index % 5 === 4 ? 'archived' : index % 3 === 1 ? 'draft' : 'active',
  count: index === 3 ? null : (index * 37 + 18) % 150,
  enabled: index % 2 === 0,
}))

const columns: DataTableColumn<Item>[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'status', label: 'Status', filterMode: 'equals' },
  { key: 'count', label: 'Count', sortable: true, align: 'end', aggregate: 'sum' },
]

const tree: Item[] = items.slice(0, 3).map((row, index) => ({
  ...row,
  children: items.slice(3 + index * 2, 5 + index * 2),
}))

const English = defineComponent({
  setup(_, { slots }) {
    provideUiLocale(vueEnUS)
    return () => slots.default?.()
  },
})

type Props = Record<string, unknown>
type VueSlots = Record<string, (context: never) => VNode | VNode[] | string>

function vueTable(props: Props = {}, slots?: VueSlots) {
  const { className, ...rest } = props
  return () =>
    h(
      VDataTable as never,
      {
        rows: items.slice(0, 5),
        columns,
        rowKey: 'id',
        label: 'Entries',
        ...(className ? { class: className } : {}),
        ...rest,
      } as never,
      slots as never,
    )
}

function reactTable(props: Props = {}) {
  return () => (
    <DataTable<Item>
      rows={items.slice(0, 5)}
      columns={columns}
      rowKey="id"
      label="Entries"
      {...(props as object)}
    />
  )
}

function same(name: string, props: Props, extra: Partial<ParityCase> = {}): ParityCase {
  return { name, vue: vueTable(props), react: reactTable(props), ...extra }
}

const layoutColumns: DataTableColumn<Item>[] = [
  { key: 'id', label: 'ID', width: 64, pin: 'start', headerClass: 'pt-2' },
  {
    key: 'name',
    label: 'Name',
    width: 220,
    minWidth: 120,
    maxWidth: 360,
    truncate: true,
    sortable: true,
    cellClass: 'font-medium',
  },
  {
    key: 'status',
    label: 'Status',
    width: '12rem',
    cellClass: (row: Item) => (row.status === 'draft' ? 'text-muted' : undefined),
  },
  { key: 'count', label: 'Count', width: 120, align: 'end', pin: 'end' },
]

const nested: DataTableColumn<Item>[] = [
  {
    key: 'identity',
    label: 'Identity',
    children: [
      { key: 'name', label: 'Name', sortable: true },
      { key: 'status', label: 'Status' },
    ],
  },
  { key: 'count', label: 'Count', align: 'end', aggregate: 'sum', footer: true },
  { key: 'enabled', label: 'Enabled', footer: (rows: Item[]) => `${rows.length} rows` },
]

export default defineCases('DataTable', [
  same('basic rows', {}),
  same('caption and sorted column', {
    caption: 'Entries',
    sorting: [{ key: 'count', desc: false }],
  }),
  same('descending sort with missing values last', {
    rows: items.slice(0, 6),
    sorting: [{ key: 'count', desc: true }],
  }),
  same('multi sort indexes', {
    multiSort: true,
    sorting: [
      { key: 'name', desc: true },
      { key: 'count', desc: false },
    ],
  }),
  same('global filter', { rows: items, filter: 'entry b' }),
  same('column filters', {
    rows: items,
    columnFilters: [{ key: 'status', value: 'draft' }],
  }),
  same('hidden and ordered columns', {
    hiddenColumns: ['status'],
    columnOrder: ['count', 'name'],
  }),
  same('no visible columns', { hiddenColumns: ['name', 'status', 'count'] }),
  same('empty locale text', { rows: [] }),
  same('empty text', { rows: [], emptyText: 'Nothing here' }),
  same('loading without rows', { rows: [], loading: true }),
  same('loading with rows', { loading: true }),
  same('disabled interactions', {
    disabled: true,
    selectable: true,
    pagination: true,
    pageSize: 2,
  }),
  same('multiple selection with a partial page', { selectable: true, selected: [2] }),
  same('multiple selection with every row', {
    selectable: true,
    selected: [1, 2, 3, 4, 5],
    selectAll: 'filtered',
  }),
  same('selection with ineligible rows', {
    selectable: (row: Item) => row.enabled,
    selected: [1],
  }),
  same('single selection', { selectable: true, selectionMode: 'single', selected: [3] }),
  same('expandable rows', { expandable: (row: Item) => row.id !== 2, expanded: [1] }),
  same('tree rows', {
    rows: tree,
    getChildren: (row: Item) => row.children,
    expanded: [1],
    selectable: true,
    selected: [4],
  }),
  same('tree rows without cascading selection', {
    rows: tree,
    getChildren: (row: Item) => row.children,
    expanded: [1, 2],
    selectable: true,
    selectChildren: false,
    selected: [1],
  }),
  same('grouping collapsed', { rows: items, grouping: ['status'] }),
  same('grouping expanded with controls', {
    rows: items,
    grouping: ['status'],
    expandedGroups: ['status:draft'],
    selectable: true,
    editMode: 'row',
  }),
  same('nested grouping', {
    rows: items,
    grouping: ['status', 'enabled'],
    expandedGroups: ['status:active', 'status:active>enabled:true'],
  }),
  same('pagination with a known total', { rows: items, pagination: true, pageSize: 5 }),
  same('pagination on a later page', {
    rows: items,
    pagination: true,
    pageSize: 5,
    page: 3,
  }),
  {
    name: 'pagination clamps an invalid page',
    vue: vueTable({ rows: items, pagination: true, pageSize: 5, page: 9 }),
    react: reactTable({ rows: items, pagination: true, pageSize: 5, defaultPage: 9 }),
  },
  same('manual pagination with a total', {
    manual: true,
    pagination: true,
    total: 40,
    page: 2,
    pageSize: 5,
  }),
  same('manual pagination without a total', {
    manual: true,
    pagination: true,
    page: 2,
    pageSize: 5,
  }),
  same('manual pagination without a next page', {
    manual: true,
    pagination: true,
    pageSize: 3,
    hasNextPage: false,
  }),
  same('column widths, pins and truncation', { columns: layoutColumns }),
  same('column widths with controls', {
    columns: layoutColumns,
    selectable: true,
    expandable: true,
    reorderable: true,
    editMode: 'row',
  }),
  same('fixed layout', { layout: 'fixed' }),
  same('auto layout with static widths', {
    columns: columns.map((column, index) => ({ ...column, width: 100 + index * 40 })),
  }),
  same('resizable fit columns', { columns: layoutColumns, resizable: true }),
  same('resizable expand columns with stored widths', {
    columns: layoutColumns,
    resizable: true,
    resizeMode: 'expand',
    columnWidths: { name: 260 },
  }),
  same('reorderable columns and rows', { reorderColumns: true, reorderable: true }),
  same('locked columns in a resizable reorderable table', {
    reorderColumns: true,
    resizable: true,
    columns: [
      { key: 'name', label: 'Name', reorderable: false, resizable: false },
      { key: 'status', label: 'Status', reorderable: false, width: 160 },
      { key: 'count', label: 'Count', sortable: true, align: 'end', resizable: false },
    ],
  }),
  same('row keys and labels from functions', {
    rowKey: (row: Item) => `row-${row.id}`,
    rowLabel: (row: Item) => row.name,
    selectable: true,
    selected: ['row-2'],
    expandable: true,
  }),
  same('reorderable rows blocked by sorting', {
    reorderable: (row: Item) => row.id !== 1,
    sorting: [{ key: 'name', desc: false }],
  }),
  same('cell editing', {
    editMode: 'cell',
    columns: columns.map(column => ({ ...column, editable: column.key !== 'count' })),
  }),
  same('row editing', {
    editMode: 'row',
    columns: columns.map(column => ({
      ...column,
      editable: (row: Item) => column.key !== 'name' || row.id !== 2,
    })),
  }),
  same('sticky header and footer with a height', {
    stickyHeader: true,
    stickyFooter: true,
    height: 320,
    columns: nested,
  }),
  same('fill with max height', { fill: true, maxHeight: '20rem' }),
  same('nested headers and summaries', { columns: nested, rows: items }),
  same('nested headers with sticky offsets', {
    columns: nested.map(column => ({ ...column, pin: column.key === 'count' ? 'end' : undefined })),
    stickyHeader: true,
  }),
  same('virtualized rows', {
    rows: Array.from({ length: 2000 }, (_, id) => ({
      id,
      name: `Item ${id}`,
      status: 'active',
      count: id,
      enabled: true,
    })),
    virtualize: true,
    selectable: true,
    selected: [3],
  }),
  same('virtualized rows with options and a height', {
    rows: items,
    virtualize: { estimateSize: 36, overscan: 2 },
    height: 240,
    stickyHeader: true,
  }),
  same('secondary variant without hover', {
    variant: 'secondary',
    hover: false,
    className: 'max-w-xl',
    tableClass: 'border-dashed',
    style: { width: '480px' },
    'data-testid': 'table',
  }),
  same('clickable rows with row classes', {
    rowClickable: true,
    rowClass: (row: Item) => (row.enabled ? 'font-medium' : undefined),
    rowLabel: 'name',
  }),
  same('row labels from a function', {
    selectable: true,
    reorderable: true,
    rowLabel: (row: Item) => `Row ${row.name}`,
  }),
  same('custom accessors and formatting', {
    columns: [
      { key: 'title', label: 'Title', field: 'name' },
      {
        key: 'computed',
        label: 'Computed',
        accessor: (row: Item) => row.count,
        format: (value: unknown) => `Count ${value}`,
      },
    ],
  }),
  {
    name: 'cell, header and footer render props',
    vue: vueTable({ columns: nested }, {
      'cell-name': (context: DataTableCellContext<Item>) => h('strong', context.row.name),
      cell: (context: DataTableCellContext<Item>) => h('em', String(context.value)),
      'header-count': (context: DataTableHeaderContext<Item>) =>
        h('span', { class: 'custom' }, `${context.column.label} ${context.sortIndex}`),
      'footer-name': () => 'Total',
    } as VueSlots),
    react: reactTable({
      columns: nested,
      renderCell: (context: DataTableCellContext<Item>) =>
        context.column.key === 'name' ? (
          <strong>{context.row.name}</strong>
        ) : (
          <em>{String(context.value)}</em>
        ),
      renderHeader: (context: DataTableHeaderContext<Item>): ReactNode =>
        context.column.key === 'count' ? (
          <span className="custom">{`${context.column.label} ${context.sortIndex}`}</span>
        ) : undefined,
      renderColumnFooter: ({ column }: { column: DataTableColumn<Item> }): ReactNode =>
        column.key === 'name' ? 'Total' : undefined,
    }),
  },
  {
    name: 'toolbar, footer and summary render props',
    vue: vueTable({ pagination: true }, {
      toolbar: (state: DataTableState<Item>) => h('div', `${state.total} rows`),
      footer: (state: DataTableState<Item>) => h('p', `Page ${state.page}`),
      summary: (state: DataTableState<Item>) => h('tr', [h('td', `${state.rows.length}`)]),
    } as VueSlots),
    react: reactTable({
      pagination: true,
      renderToolbar: (state: DataTableState<Item>) => <div>{`${state.total} rows`}</div>,
      renderFooter: (state: DataTableState<Item>) => <p>{`Page ${state.page}`}</p>,
      renderSummary: (state: DataTableState<Item>) => (
        <tr>
          <td>{`${state.rows.length}`}</td>
        </tr>
      ),
    }),
  },
  {
    name: 'expansion and group render props',
    vue: vueTable(
      {
        rows: items,
        grouping: ['status'],
        expandedGroups: ['status:active'],
        expandable: true,
        expanded: [1],
      },
      {
        expansion: (context: DataTableRowContext<Item>) => h('div', `Details ${context.key}`),
        group: (context: DataTableGroupContext<Item>) =>
          h('span', `${context.column.label} ${String(context.value)} ${context.rows.length}`),
      } as VueSlots,
    ),
    react: reactTable({
      rows: items,
      grouping: ['status'],
      expandedGroups: ['status:active'],
      expandable: true,
      expanded: [1],
      renderExpansion: (context: DataTableRowContext<Item>) => (
        <div>{`Details ${context.key}`}</div>
      ),
      renderGroup: (context: DataTableGroupContext<Item>) => (
        <span>{`${context.column.label} ${String(context.value)} ${context.rows.length}`}</span>
      ),
    }),
  },
  {
    name: 'empty render prop',
    vue: vueTable({ rows: [] }, { empty: () => h('strong', 'Custom empty') } as VueSlots),
    react: reactTable({ rows: [], empty: <strong>Custom empty</strong> }),
  },
  {
    name: 'expanded rows with expansion content',
    vue: vueTable({ expandable: true, expanded: [2, 3] }, {
      expansion: (context: DataTableRowContext<Item>) => h('p', `Expanded ${context.row.name}`),
    } as VueSlots),
    react: reactTable({
      expandable: true,
      expanded: [2, 3],
      renderExpansion: (context: DataTableRowContext<Item>) => (
        <p>{`Expanded ${context.row.name}`}</p>
      ),
    }),
  },
  {
    name: 'english locale',
    vue: () =>
      h(English, null, () =>
        vueTable({ rows: [], selectable: true, pagination: true, manual: true })(),
      ),
    react: () => (
      <UiLocaleProvider messages={enUS}>
        {reactTable({ rows: [], selectable: true, pagination: true, manual: true })()}
      </UiLocaleProvider>
    ),
  },
  {
    name: 'english locale with sorting and editing labels',
    vue: () =>
      h(English, null, () =>
        vueTable({
          sorting: [{ key: 'name', desc: false }],
          editMode: 'row',
          reorderColumns: true,
          columns: columns.map(column => ({ ...column, editable: true })),
        })(),
      ),
    react: () => (
      <UiLocaleProvider messages={enUS}>
        {reactTable({
          sorting: [{ key: 'name', desc: false }],
          editMode: 'row',
          reorderColumns: true,
          columns: columns.map(column => ({ ...column, editable: true })),
        })()}
      </UiLocaleProvider>
    ),
  },
])
