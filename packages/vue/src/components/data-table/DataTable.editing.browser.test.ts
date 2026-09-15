import { afterEach, describe, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { mount, type VueWrapper } from '@vue/test-utils'
import { h } from 'vue'
import DataTable from './DataTable.vue'
import Select from '../select/Select.vue'
import type { DataTableApi, DataTableColumn, DataTableEditorContext, DataTableProps } from './types'
import '../../../test/browser.css'

interface Item {
  id: number
  name: string
  count: number
  status: string
}
const rows: Item[] = Array.from({ length: 30 }, (_, id) => ({
  id,
  name: `Entry ${id}`,
  count: id,
  status: 'draft',
}))
const columns: DataTableColumn<Item>[] = [
  { key: 'name', label: 'Name', editable: true },
  { key: 'status', label: 'Status', editable: true },
  {
    key: 'count',
    label: 'Count',
    align: 'end',
    editable: true,
    parse: Number,
    validate: value => (Number(value) < 0 ? 'Nonnegative' : undefined),
  },
]
const mounted: VueWrapper[] = []
async function render(
  props: Partial<DataTableProps<Item>> & Record<string, unknown> = {},
  slots = {},
) {
  await page.viewport(1000, 800)
  const host = document.createElement('div')
  host.style.width = '700px'
  document.body.append(host)
  const wrapper = mount(DataTable<Item>, {
    props: {
      rows,
      columns,
      rowKey: 'id',
      rowLabel: 'name',
      editMode: 'row',
      layout: 'fixed',
      ...props,
    },
    slots: {
      'editor-status': (context: DataTableEditorContext<Item>) =>
        h(Select, {
          options: [
            { value: 'draft', label: 'Draft' },
            { value: 'active', label: 'Active' },
          ],
          modelValue: String(context.value),
          'aria-label': 'Status',
          'onUpdate:modelValue': context.updateValue,
        }),
      ...slots,
    },
    attachTo: host,
  })
  mounted.push(wrapper)
  await vi.waitFor(() =>
    expect(wrapper.find('[data-overlayscrollbars-viewport]').exists()).toBe(true),
  )
  return wrapper
}
const api = (wrapper: VueWrapper) => (wrapper.vm as unknown as { api: DataTableApi<Item> }).api
const frame = () =>
  new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
afterEach(() => {
  mounted.forEach(wrapper => wrapper.unmount())
  mounted.length = 0
  document.body.innerHTML = ''
  document.documentElement.removeAttribute('data-density')
  document.documentElement.dir = 'ltr'
})

describe('DataTable row editing', () => {
  it.each([
    ['ltr', 'default'],
    ['rtl', 'default'],
    ['ltr', 'compact'],
    ['rtl', 'compact'],
  ])('embeds editors without shifting text or row height (%s, %s)', async (dir, density) => {
    document.documentElement.dir = dir
    document.documentElement.dataset.density = density
    const wrapper = await render()
    const row = wrapper.find('[data-hn-row]')
    const height = row.element.getBoundingClientRect().height
    await userEvent.click(row.find('[data-hn-edit-trigger]').element)
    await vi.waitFor(() => expect(row.find('input').exists()).toBe(true))
    expect(row.element.getBoundingClientRect().height).toBe(height)
    expect(document.activeElement).toBe(row.find('input').element)
    const count = row.find('[data-hn-cell="count"] input').element as HTMLElement
    expect(getComputedStyle(count).textAlign).toBe('end')
    const name = row.find('[data-hn-cell="name"]')
    const input = name.find('input').element
    const cellBox = name.element.getBoundingClientRect()
    expect(
      dir === 'rtl'
        ? cellBox.right - input.getBoundingClientRect().right
        : input.getBoundingClientRect().left - cellBox.left,
    ).toBeCloseTo(parseFloat(getComputedStyle(name.element).paddingInlineStart), 0)
    const select = row.find('[data-hn-select]')
    expect(getComputedStyle(select.element).boxShadow).toBe('none')
    expect(getComputedStyle(select.element).borderWidth).toBe('0px')
    expect(select.element.getBoundingClientRect().height).toBe(input.getBoundingClientRect().height)
    expect(getComputedStyle(row.find('[data-hn-cell="status"]').element).boxShadow).toBe('none')
    await userEvent.click(select.find('[role="combobox"]').element)
    await vi.waitFor(() => expect(document.querySelector('[role="option"]')).toBeTruthy())
    await userEvent.click(document.querySelectorAll('[role="option"]')[1]!)
    await vi.waitFor(() => expect(select.text()).toBe('Active'))
    expect(row.element.getBoundingClientRect().height).toBe(height)
    await userEvent.click(row.find('input').element)
    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(row.find('input').exists()).toBe(false))
    expect(row.text()).toContain('draft')
    expect(document.activeElement).toBe(row.find('[data-hn-edit-trigger]').element)
  })

  it('keeps the editing background continuous across pinned columns', async () => {
    const wrapper = await render({
      columns: columns.map(column => ({
        ...column,
        pin: column.key === 'name' ? 'start' : column.key === 'count' ? 'end' : undefined,
      })),
    })
    const row = wrapper.find('[data-hn-row]')
    const trigger = row.find('[data-hn-edit-trigger]').element
    const cell = trigger.closest('td')!.getBoundingClientRect()
    const button = trigger.getBoundingClientRect()
    expect(button.top + button.height / 2).toBeCloseTo(cell.top + cell.height / 2, 0)
    await userEvent.click(trigger)
    await vi.waitFor(() => expect(row.find('input').exists()).toBe(true))
    const backgrounds = row
      .findAll('td')
      .map(cell => getComputedStyle(cell.element).backgroundImage)
    expect(backgrounds.every(value => value !== 'none')).toBe(true)
    expect(new Set(backgrounds).size).toBe(1)
  })

  it('shows one save error, preserves the draft for retry, and keeps field errors independent', async () => {
    let resolve!: () => void
    const save = vi
      .fn()
      .mockRejectedValueOnce(new Error('Save failed'))
      .mockImplementationOnce(
        () =>
          new Promise<void>(done => {
            resolve = done
          }),
      )
    const wrapper = await render({ onSave: save })
    const row = wrapper.find('[data-hn-row]')
    await userEvent.click(row.find('[data-hn-edit-trigger]').element)
    await row.find('input').setValue('Changed')
    await api(wrapper).commitEdit()
    await vi.waitFor(() => expect(wrapper.findAll('[role="alert"]')).toHaveLength(1))
    expect(wrapper.find('[data-edit-error] [role="alert"]').text()).toBe('Save failed')
    expect(row.findAll('[aria-invalid="true"]')).toHaveLength(0)
    expect((row.find('input').element as HTMLInputElement).value).toBe('Changed')
    expect(rows[0]!.name).toBe('Entry 0')
    const pending = api(wrapper).commitEdit()
    await vi.waitFor(() => expect(save).toHaveBeenCalledTimes(2))
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
    expect(row.find('[role="combobox"]').attributes('disabled')).toBeDefined()
    await api(wrapper).commitEdit()
    expect(save).toHaveBeenCalledTimes(2)
    resolve()
    await pending
    await vi.waitFor(() => expect(row.find('input').exists()).toBe(false))
    expect(wrapper.emitted('edit')).toHaveLength(1)
    expect(save.mock.calls[1]![0].values).toMatchObject({
      name: 'Changed',
      status: 'draft',
      count: 0,
    })
    await userEvent.click(row.find('[data-hn-edit-trigger]').element)
    await row.find('[data-hn-cell="count"] input').setValue('-1')
    await api(wrapper).commitEdit()
    await vi.waitFor(() => expect(row.find('[role="alert"]').text()).toBe('Nonnegative'))
    expect(wrapper.findAll('[role="alert"]')).toHaveLength(1)
    expect(wrapper.find('[data-edit-error]').exists()).toBe(false)
    const input = row.find('[data-hn-cell="count"] input')
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(input.attributes('aria-describedby')).toBe(row.find('[role="alert"]').attributes('id'))
    expect(save).toHaveBeenCalledTimes(2)
  })

  it.each(['ltr', 'rtl'])(
    'keeps save errors visible after horizontal scrolling and container resizing (%s)',
    async dir => {
      document.documentElement.dir = dir
      const wrapper = await render({
        columns: columns.map(column => ({ ...column, width: 300 })),
        onSave: () => Promise.reject(new Error('Save failed. Please try again. '.repeat(12))),
      })
      const viewport = wrapper.find('[data-overlayscrollbars-viewport]').element as HTMLElement
      await userEvent.click(wrapper.find('[data-hn-edit-trigger]').element)
      await api(wrapper).commitEdit()
      await vi.waitFor(() => expect(wrapper.find('[data-edit-error]').exists()).toBe(true))
      viewport.scrollLeft = (dir === 'rtl' ? -1 : 1) * (viewport.scrollWidth - viewport.clientWidth)
      await frame()
      const visible = () => {
        const box = viewport.getBoundingClientRect()
        const message = wrapper
          .find('[data-edit-error] [role="alert"]')
          .element.getBoundingClientRect()
        expect(message.left).toBeGreaterThanOrEqual(box.left)
        expect(message.right).toBeLessThanOrEqual(box.right)
        expect(message.width).toBeGreaterThan(200)
      }
      visible()
      ;(wrapper.element as HTMLElement).parentElement!.style.width = '450px'
      await vi.waitFor(() => expect(viewport.clientWidth).toBeLessThan(450))
      await frame()
      visible()
    },
  )

  it('measures a save error as a separate virtual row and removes its space on cancellation', async () => {
    const wrapper = await render({
      virtualize: true,
      maxHeight: 240,
      onSave: () => Promise.reject(new Error('Try again')),
    })
    const row = wrapper.find('[data-hn-row]')
    await userEvent.click(row.find('[data-hn-edit-trigger]').element)
    await frame()
    const second = wrapper.findAll('[data-hn-row]')[1]!.element
    const top = second.getBoundingClientRect().top
    await api(wrapper).commitEdit()
    await vi.waitFor(() => expect(wrapper.find('[data-edit-error]').exists()).toBe(true))
    await frame()
    const error = wrapper.find('[data-edit-error]').element
    expect(second.getBoundingClientRect().top - top).toBeCloseTo(
      error.getBoundingClientRect().height,
      0,
    )
    expect(wrapper.find('table').attributes('aria-rowcount')).toBe('32')
    api(wrapper).cancelEdit()
    await vi.waitFor(() => expect(wrapper.find('[data-edit-error]').exists()).toBe(false))
    await frame()
    expect(second.getBoundingClientRect().top).toBeCloseTo(top, 0)
    expect(wrapper.find('table').attributes('aria-rowcount')).toBe('31')
  })
})
