import { afterEach, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { mount, type VueWrapper } from '@vue/test-utils'
import { h } from 'vue'
import DataTable from './DataTable.vue'
import Select from '../select/Select.vue'
import type { DataTableFilter, DataTableHeaderContext } from './types'
import '../../../test/browser.css'

let wrapper: VueWrapper | undefined
afterEach(() => {
  wrapper?.unmount()
  document.body.innerHTML = ''
})
it('restores the unselected header and all rows when a Select filter is cleared', async () => {
  const rows = [
    { id: 1, status: 'draft' },
    { id: 2, status: 'active' },
  ]
  wrapper = mount(DataTable<(typeof rows)[number]>, {
    attachTo: document.body,
    props: {
      rows,
      columns: [{ key: 'status', label: 'Status', filterMode: 'equals' }],
      rowKey: 'id',
      columnFilters: [],
      'onUpdate:columnFilters': (filters: DataTableFilter[]) =>
        wrapper!.setProps({ columnFilters: filters }),
    },
    slots: {
      'header-status': ({
        filterValue,
        setFilter,
      }: DataTableHeaderContext<(typeof rows)[number]>) =>
        h(Select, {
          modelValue: filterValue === undefined ? undefined : String(filterValue),
          options: [
            { value: 'draft', label: 'Draft' },
            { value: 'active', label: 'Active' },
          ],
          placeholder: 'Status',
          'aria-label': 'Status',
          clearable: true,
          'onUpdate:modelValue': setFilter,
        }),
    },
  })
  const trigger = wrapper.find('[data-hn-select-trigger]').element
  await userEvent.click(trigger)
  await vi.waitFor(() => expect(document.querySelector('[role="option"]')).toBeTruthy())
  await userEvent.click(document.querySelector('[role="option"]')!)
  await vi.waitFor(() => expect(wrapper!.findAll('tbody tr')).toHaveLength(1))
  await userEvent.click(wrapper.find('[data-hn-select-clear]').element)
  await vi.waitFor(() => expect(wrapper!.findAll('tbody tr')).toHaveLength(2))
  await vi.waitFor(() => expect(wrapper!.find('[data-hn-select-clear]').exists()).toBe(false))
  expect(trigger.textContent).toBe('Status')
  expect((wrapper.props() as { columnFilters: DataTableFilter[] }).columnFilters).toEqual([])
  await userEvent.click(trigger)
  await vi.waitFor(() => expect(document.querySelectorAll('[role="option"]')).toHaveLength(2))
  expect(document.querySelector('[role="option"][data-state="checked"]')).toBeNull()
})
