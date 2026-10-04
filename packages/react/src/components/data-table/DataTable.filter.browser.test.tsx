import { afterEach, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { Select } from '../select/Select'
import type { DataTableFilter } from './types'
import { mountTable } from '../../../test/data-table'
import '../../../test/browser.css'

let wrapper: Awaited<ReturnType<typeof mountTable<{ id: number; status: string }>>> | undefined
afterEach(async () => {
  await wrapper?.unmount()
  document.body.innerHTML = ''
})
it('restores the unselected header and all rows when a Select filter is cleared', async () => {
  const rows = [
    { id: 1, status: 'draft' },
    { id: 2, status: 'active' },
  ]
  const host = document.createElement('div')
  document.body.append(host)
  wrapper = await mountTable<(typeof rows)[number]>(
    {
      rows,
      columns: [{ key: 'status', label: 'Status', filterMode: 'equals' }],
      rowKey: 'id',
      columnFilters: [],
      renderHeader: ({ column, filterValue, setFilter }) =>
        column.key === 'status' ? (
          <Select
            value={filterValue === undefined ? null : String(filterValue)}
            options={[
              { value: 'draft', label: 'Draft' },
              { value: 'active', label: 'Active' },
            ]}
            placeholder="Status"
            aria-label="Status"
            clearable
            onValueChange={setFilter}
          />
        ) : undefined,
    },
    host,
  )
  const trigger = wrapper.find('[data-hn-select-trigger]')!
  await userEvent.click(trigger)
  await vi.waitFor(() => expect(document.querySelector('[role="option"]')).toBeTruthy())
  await userEvent.click(document.querySelector('[role="option"]')!)
  await vi.waitFor(() => expect(wrapper!.findAll('tbody tr')).toHaveLength(1))
  await userEvent.click(wrapper.find('[data-hn-select-clear]')!)
  await vi.waitFor(() => expect(wrapper!.findAll('tbody tr')).toHaveLength(2))
  await vi.waitFor(() => expect(wrapper!.find('[data-hn-select-clear]')).toBeNull())
  expect(trigger.textContent).toBe('Status')
  expect((wrapper.props.value as { columnFilters: DataTableFilter[] }).columnFilters).toEqual([])
  await userEvent.click(trigger)
  await vi.waitFor(() => expect(document.querySelectorAll('[role="option"]')).toHaveLength(2))
  expect(document.querySelector('[role="option"][data-state="checked"]')).toBeNull()
})
