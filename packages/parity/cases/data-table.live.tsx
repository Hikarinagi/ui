import { defineComponent, h, ref, type VNode } from 'vue'
import { useState, type ReactElement } from 'react'
import { userEvent } from 'vitest/browser'
import { vi } from 'vitest'
import VDataTable from '@hina-ui/vue/components/data-table/DataTable.vue'
import VSelect from '@hina-ui/vue/components/select/Select.vue'
import { DataTable } from '@hina-ui/react/components/data-table/DataTable'
import { Select } from '@hina-ui/react/components/select/Select'
import type {
  DataTableColumn,
  DataTableEditorContext,
  DataTableRowContext,
} from '@hina-ui/react/components/data-table/types'
import { defineLiveCases, frames, type LiveCase } from '../src/live'

interface Item {
  id: number
  name: string
  status: string
  count: number
  children?: Item[]
}

const items: Item[] = Array.from({ length: 24 }, (_, index) => ({
  id: index + 1,
  name: `Entry ${String.fromCharCode(65 + index)} with a longer descriptive label`,
  status: index % 3 === 1 ? 'draft' : 'active',
  count: (index * 37 + 18) % 150,
}))

const columns: DataTableColumn<Item>[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'status', label: 'Status' },
  { key: 'count', label: 'Count', align: 'end', sortable: true, aggregate: 'sum' },
]

const pinned: DataTableColumn<Item>[] = [
  { key: 'id', label: 'ID', width: 72, pin: 'start' },
  { key: 'name', label: 'Name', width: 240, minWidth: 120, maxWidth: 360, truncate: true },
  { key: 'status', label: 'Status', width: 200 },
  { key: 'count', label: 'Count', width: 120, align: 'end', pin: 'end' },
]

const editable = columns.map(column => ({
  ...column,
  editable: true,
  parse: column.key === 'count' ? Number : undefined,
  validate:
    column.key === 'count'
      ? (value: unknown) => (Number(value) < 0 ? 'Nonnegative' : undefined)
      : undefined,
}))

const tree: Item[] = items.slice(0, 3).map((row, index) => ({
  ...row,
  children: items.slice(3 + index * 2, 5 + index * 2),
}))

type Props = Record<string, unknown>

function vueTable(props: Props = {}, slots?: Record<string, (context: never) => unknown>) {
  return (): VNode =>
    h(
      VDataTable as never,
      {
        rows: items.slice(0, 6),
        columns,
        rowKey: 'id',
        label: 'Entries',
        style: { width: '640px' },
        ...props,
      } as never,
      slots as never,
    )
}

function reactTable(props: Props = {}) {
  return (): ReactElement => (
    <DataTable<Item>
      rows={items.slice(0, 6)}
      columns={columns}
      rowKey="id"
      label="Entries"
      style={{ width: '640px' }}
      {...(props as object)}
    />
  )
}

const viewport = () => document.querySelector<HTMLElement>('[data-overlayscrollbars-viewport]')!

async function ready() {
  await vi.waitFor(() => {
    if (!document.querySelector('[data-overlayscrollbars-viewport]')) throw new Error('no viewport')
  })
  await frames(6)
}

async function idle() {
  await ready()
  await vi.waitFor(
    () => {
      const running = document
        .getAnimations()
        .filter(
          animation =>
            animation.playState === 'running' &&
            animation.effect?.getTiming().iterations !== Infinity &&
            !((animation.effect as KeyframeEffect | null)?.target as Element | null)?.closest(
              '.os-scrollbar',
            ),
        )
      if (running.length) throw new Error('busy')
    },
    { timeout: 3000 },
  )
  await frames(4)
}

function same(name: string, props: Props, extra: Partial<LiveCase> = {}): LiveCase {
  return { name, vue: vueTable(props), react: reactTable(props), settle: idle, ...extra }
}

const click =
  (selector: string, index = 0) =>
  async () => {
    await ready()
    await userEvent.click(document.querySelectorAll<HTMLElement>(selector)[index]!)
  }

const pointer = (type: string, x: number, y: number) =>
  new PointerEvent(type, { bubbles: true, button: 0, pointerId: 1, clientX: x, clientY: y })

const VueReorder = defineComponent(() => {
  const rows = ref(items.slice(0, 5))
  return () =>
    vueTable({
      rows: rows.value,
      reorderable: true,
      'onUpdate:rows': (value: Item[]) => (rows.value = value),
    })()
})

function ReactReorder() {
  const [rows, setRows] = useState(items.slice(0, 5))
  return reactTable({ rows, reorderable: true, onRowsChange: setRows })()
}

const statusEditor = {
  vue: (context: DataTableEditorContext<Item>) =>
    h(VSelect, {
      options: [
        { value: 'draft', label: 'Draft' },
        { value: 'active', label: 'Active' },
      ],
      modelValue: String(context.value),
      'aria-label': 'Status',
      'onUpdate:modelValue': context.updateValue,
    }),
  react: (context: DataTableEditorContext<Item>) =>
    context.column.key === 'status' ? (
      <Select
        options={[
          { value: 'draft', label: 'Draft' },
          { value: 'active', label: 'Active' },
        ]}
        value={String(context.value)}
        aria-label="Status"
        onValueChange={context.updateValue}
      />
    ) : undefined,
}

const cases: LiveCase[] = [
  same('basic rows after mount', {}),
  same(
    'sticky header after vertical scrolling',
    {
      rows: items,
      stickyHeader: true,
      maxHeight: 240,
    },
    {
      interact: async () => {
        await ready()
        viewport().scrollTop = 200
        await frames(4)
      },
    },
  ),
  same(
    'pinned and truncated columns after horizontal scrolling',
    {
      columns: pinned,
      selectable: true,
      style: { width: '420px' },
    },
    {
      interact: async () => {
        await ready()
        viewport().scrollLeft = 160
        await frames(4)
      },
    },
  ),
  same('pinned columns in rtl', { columns: pinned, dir: 'rtl', style: { width: '420px' } }),
  same('resizable fit columns with measured handles', { columns: pinned, resizable: true }),
  same('resizable expand columns in a narrow container', {
    columns: pinned,
    resizable: true,
    resizeMode: 'expand',
    columnWidths: { name: 300 },
    style: { width: '420px' },
  }),
  same('auto layout measured column widths', {
    columns: columns.map(column => ({
      ...column,
      pin: column.key === 'name' ? 'start' : undefined,
    })),
    selectable: true,
  }),
  same('sorting by clicking a header', {}, { interact: click('thead button', 1) }),
  same(
    'multi sort with shift',
    { multiSort: true },
    {
      interact: async () => {
        await ready()
        await userEvent.click(document.querySelectorAll<HTMLElement>('thead button')[1]!)
        await userEvent.keyboard('{Shift>}')
        await userEvent.click(document.querySelectorAll<HTMLElement>('thead button')[0]!)
        await userEvent.keyboard('{/Shift}')
      },
    },
  ),
  same(
    'row selection',
    { selectable: true },
    {
      interact: click('tbody [role="checkbox"]', 1),
    },
  ),
  same('page selection', { selectable: true }, { interact: click('thead [role="checkbox"]') }),
  same(
    'single selection',
    { selectable: true, selectionMode: 'single' },
    {
      interact: async () => {
        await click('tbody input[type="radio"]', 2)()
        await frames(2)
        await click('tbody input[type="radio"]', 0)()
      },
    },
  ),
  {
    name: 'expanding a row',
    vue: vueTable(
      { expandable: true },
      {
        expansion: (context: DataTableRowContext<Item>) => h('div', `Details ${context.key}`),
      },
    ),
    react: reactTable({
      expandable: true,
      renderExpansion: (context: DataTableRowContext<Item>) => (
        <div>{`Details ${context.key}`}</div>
      ),
    }),
    interact: click('tbody button[aria-expanded]', 1),
    settle: idle,
  },
  same(
    'expanding a tree row',
    {
      rows: tree,
      getChildren: (row: Item) => row.children,
      selectable: true,
    },
    { interact: click('tbody button[aria-expanded]', 0) },
  ),
  same(
    'expanding a group',
    { rows: items, grouping: ['status'] },
    {
      interact: click('tbody .hn-table-group', 0),
    },
  ),
  same(
    'pagination next page',
    { rows: items, pagination: true, pageSize: 5 },
    {
      interact: async () => {
        await ready()
        document
          .querySelectorAll<HTMLElement>('[data-hn-pagination] button:not([disabled])')[1]!
          .click()
      },
    },
  ),
  same(
    'unknown total next page',
    { manual: true, pagination: true, pageSize: 3 },
    {
      interact: click('nav button', 1),
    },
  ),
  same('loading overlay over rows', { loading: true }),
  same('virtualized rows after mount', {
    rows: Array.from({ length: 2000 }, (_, id) => ({
      id,
      name: `Item ${id}`,
      status: 'active',
      count: id,
    })),
    virtualize: true,
    stickyHeader: true,
    height: 320,
  }),
  same(
    'virtualized rows after scrolling',
    {
      rows: Array.from({ length: 2000 }, (_, id) => ({
        id,
        name: `Item ${id}`,
        status: 'active',
        count: id,
      })),
      virtualize: true,
      selectable: true,
      height: 320,
    },
    {
      interact: async () => {
        await ready()
        viewport().scrollTop = 20000
        await frames(4)
        await new Promise(resolve => setTimeout(resolve, 300))
      },
    },
  ),
  same(
    'cell editing opened with Enter',
    { editMode: 'cell', columns: editable },
    {
      interact: async () => {
        await ready()
        document.querySelector<HTMLElement>('[data-hn-cell="name"]')!.focus()
        await userEvent.keyboard('{Enter}')
      },
    },
  ),
  {
    name: 'row editing with a custom editor',
    vue: vueTable(
      { editMode: 'row', columns: editable, rowLabel: 'name' },
      {
        'editor-status': statusEditor.vue,
      },
    ),
    react: reactTable({
      editMode: 'row',
      columns: editable,
      rowLabel: 'name',
      renderEditor: statusEditor.react,
    }),
    interact: click('[data-hn-edit-trigger]', 1),
    settle: idle,
  },
  same(
    'row editing validation error',
    { editMode: 'row', columns: editable },
    {
      interact: async () => {
        await ready()
        await userEvent.click(document.querySelector<HTMLElement>('[data-hn-edit-trigger]')!)
        await vi.waitFor(() => {
          if (!document.querySelector('[data-hn-cell="count"] input')) throw new Error('no editor')
        })
        const input = document.querySelector<HTMLInputElement>('[data-hn-cell="count"] input')!
        await userEvent.fill(input, '-4')
        await userEvent.keyboard('{Enter}')
        await vi.waitFor(() => {
          if (!document.querySelector('[role="alert"]')) throw new Error('no alert')
        })
      },
    },
  ),
  same(
    'row editing save failure',
    {
      editMode: 'row',
      columns: editable,
      onSave: () => Promise.reject(new Error('Save failed')),
    },
    {
      interact: async () => {
        await ready()
        await userEvent.click(document.querySelector<HTMLElement>('[data-hn-edit-trigger]')!)
        await vi.waitFor(() => {
          if (!document.querySelector('tbody input')) throw new Error('no editor')
        })
        await userEvent.keyboard('{Enter}')
        await vi.waitFor(() => {
          if (!document.querySelector('[data-edit-error]')) throw new Error('no error')
        })
      },
    },
  ),
  {
    name: 'keyboard row reorder',
    vue: () => h(VueReorder),
    react: () => <ReactReorder />,
    interact: async () => {
      await ready()
      document.querySelector<HTMLElement>('tbody [data-hn-row-drag]')!.focus()
      await userEvent.keyboard('{ArrowDown}')
    },
    settle: idle,
  },
  same(
    'keyboard column reorder',
    { reorderColumns: true },
    {
      interact: async () => {
        await ready()
        document.querySelector<HTMLElement>('[data-hn-column="name"] button')!.focus()
        await userEvent.keyboard('{Alt>}{ArrowRight}{/Alt}')
      },
    },
  ),
  same(
    'keyboard column resize',
    { columns: pinned, resizable: true },
    {
      interact: async () => {
        await ready()
        document.querySelector<HTMLElement>('[data-hn-column="name"] [role="separator"]')!.focus()
        await userEvent.keyboard('{Shift>}{ArrowRight}{/Shift}')
      },
    },
  ),
  same(
    'column drag in progress',
    { reorderColumns: true },
    {
      interact: async () => {
        await ready()
        const header = document.querySelector<HTMLElement>('[data-hn-column="name"]')!
        const box = header.getBoundingClientRect()
        const target = document.querySelector<HTMLElement>('[data-hn-column="count"]')!
        const end = target.getBoundingClientRect()
        header.setPointerCapture = () => {}
        header.dispatchEvent(pointer('pointerdown', box.x + 20, box.y + 10))
        window.dispatchEvent(pointer('pointermove', end.x + 20, box.y + 10))
        await vi.waitFor(() => {
          if (!document.querySelector('[data-hn-drop-line]')) throw new Error('no drop line')
        })
        await frames(2)
      },
      settle: async () => {
        await frames(2)
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
        await frames(2)
      },
    },
  ),
  same(
    'column resize in progress',
    { columns: pinned, resizable: true },
    {
      interact: async () => {
        await ready()
        const handle = document.querySelector<HTMLElement>(
          '[data-hn-column="name"] [role="separator"]',
        )!
        const box = handle.getBoundingClientRect()
        handle.setPointerCapture = () => {}
        handle.dispatchEvent(pointer('pointerdown', box.x + 2, box.y + 2))
        window.dispatchEvent(pointer('pointermove', box.x + 32, box.y + 2))
        await vi.waitFor(() => {
          if (!document.querySelector('[data-hn-resize-label]')) throw new Error('no guide')
        })
        await frames(4)
      },
      settle: async () => {
        await frames(2)
      },
    },
  ),
]

export default defineLiveCases('DataTable', cases)
