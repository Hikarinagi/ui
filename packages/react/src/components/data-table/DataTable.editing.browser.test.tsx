import { afterEach, describe, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { Select } from '../select/Select'
import type { DataTableColumn, DataTableProps } from './types'
import { mountTable } from '../../../test/data-table'
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
const mounted: Array<{ unmount: () => unknown }> = []
async function render(props: Partial<DataTableProps<Item>> = {}) {
  await page.viewport(1000, 800)
  const host = document.createElement('div')
  host.style.width = '700px'
  document.body.append(host)
  const wrapper = await mountTable<Item>(
    {
      rows,
      columns,
      rowKey: 'id',
      rowLabel: 'name',
      editMode: 'row',
      layout: 'fixed',
      renderEditor: context =>
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
      ...props,
    },
    host,
  )
  mounted.push(wrapper)
  await vi.waitFor(() => expect(wrapper.find('[data-overlayscrollbars-viewport]')).not.toBeNull())
  return wrapper
}
type Wrapper = Awaited<ReturnType<typeof render>>
const api = (wrapper: Wrapper) => wrapper.handle.current!.api
const frame = () =>
  new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
async function setValue(input: HTMLInputElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!
  setter.call(input, value)
  input.dispatchEvent(new Event('input', { bubbles: true }))
  await new Promise(resolve => setTimeout(resolve, 0))
}
afterEach(async () => {
  for (const wrapper of mounted.splice(0)) await wrapper.unmount()
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
    const row = wrapper.find('[data-hn-row]')!
    const height = row.getBoundingClientRect().height
    await userEvent.click(row.querySelector('[data-hn-edit-trigger]')!)
    await vi.waitFor(() => expect(row.querySelector('input')).not.toBeNull())
    expect(row.getBoundingClientRect().height).toBe(height)
    expect(document.activeElement).toBe(row.querySelector('input'))
    const count = row.querySelector<HTMLElement>('[data-hn-cell="count"] input')!
    expect(getComputedStyle(count).textAlign).toBe('end')
    const name = row.querySelector<HTMLElement>('[data-hn-cell="name"]')!
    const input = name.querySelector('input')!
    const cellBox = name.getBoundingClientRect()
    expect(
      dir === 'rtl'
        ? cellBox.right - input.getBoundingClientRect().right
        : input.getBoundingClientRect().left - cellBox.left,
    ).toBeCloseTo(parseFloat(getComputedStyle(name).paddingInlineStart), 0)
    const select = row.querySelector<HTMLElement>('[data-hn-select]')!
    expect(getComputedStyle(select).boxShadow).toBe('none')
    expect(getComputedStyle(select).borderWidth).toBe('0px')
    expect(select.getBoundingClientRect().height).toBe(input.getBoundingClientRect().height)
    expect(getComputedStyle(row.querySelector('[data-hn-cell="status"]')!).boxShadow).toBe('none')
    await userEvent.click(select.querySelector('[role="combobox"]')!)
    await vi.waitFor(() => expect(document.querySelector('[role="option"]')).toBeTruthy())
    await userEvent.click(document.querySelectorAll('[role="option"]')[1]!)
    await vi.waitFor(() => expect(select.textContent?.trim()).toBe('Active'))
    expect(row.getBoundingClientRect().height).toBe(height)
    await userEvent.click(row.querySelector('input')!)
    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(row.querySelector('input')).toBeNull())
    expect(row.textContent).toContain('draft')
    expect(document.activeElement).toBe(row.querySelector('[data-hn-edit-trigger]'))
  })

  it.each([
    ['default', 'default'],
    ['system-ui', 'default'],
    ['default', 'compact'],
    ['system-ui', 'compact'],
  ])('centers edit triggers in the cell content box (%s, %s)', async (font, density) => {
    document.documentElement.dataset.density = density
    const wrapper = await render({
      columns: columns.map(column => ({
        ...column,
        pin: column.key === 'name' ? 'start' : column.key === 'count' ? 'end' : undefined,
      })),
    })
    if (font !== 'default') wrapper.element.style.fontFamily = font
    const items = wrapper.findAll('[data-hn-row]')
    for (const index of [0, items.length - 1]) {
      const trigger = items[index]!.querySelector('[data-hn-edit-trigger]')!
      const cell = trigger.closest('td')!
      const box = cell.getBoundingClientRect()
      const button = trigger.getBoundingClientRect()
      const style = getComputedStyle(cell)
      const start = parseFloat(style.borderTopWidth) + parseFloat(style.paddingTop)
      const end = parseFloat(style.borderBottomWidth) + parseFloat(style.paddingBottom)
      expect(parseFloat(style.borderBottomWidth)).toBe(index === 0 ? 1 : 0)
      expect(button.top + button.height / 2).toBeCloseTo(
        (box.top + start + box.bottom - end) / 2,
        0,
      )
    }
  })

  it('keeps the editing background continuous across pinned columns', async () => {
    const wrapper = await render({
      columns: columns.map(column => ({
        ...column,
        pin: column.key === 'name' ? 'start' : column.key === 'count' ? 'end' : undefined,
      })),
    })
    const row = wrapper.find('[data-hn-row]')!
    const trigger = row.querySelector('[data-hn-edit-trigger]')!
    await userEvent.click(trigger)
    await vi.waitFor(() => expect(row.querySelector('input')).not.toBeNull())
    const backgrounds = [...row.querySelectorAll('td')].map(
      cell => getComputedStyle(cell).backgroundImage,
    )
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
    const row = wrapper.find('[data-hn-row]')!
    await userEvent.click(row.querySelector('[data-hn-edit-trigger]')!)
    await setValue(row.querySelector('input')!, 'Changed')
    await api(wrapper).commitEdit()
    await vi.waitFor(() => expect(wrapper.findAll('[role="alert"]')).toHaveLength(1))
    expect(wrapper.find('[data-edit-error] [role="alert"]')!.textContent?.trim()).toBe(
      'Save failed',
    )
    expect(row.querySelectorAll('[aria-invalid="true"]')).toHaveLength(0)
    expect(row.querySelector('input')!.value).toBe('Changed')
    expect(rows[0]!.name).toBe('Entry 0')
    const pending = api(wrapper).commitEdit()
    await vi.waitFor(() => expect(save).toHaveBeenCalledTimes(2))
    expect(wrapper.find('[role="alert"]')).toBeNull()
    expect(row.querySelector('[role="combobox"]')!.hasAttribute('disabled')).toBe(true)
    await api(wrapper).commitEdit()
    expect(save).toHaveBeenCalledTimes(2)
    resolve()
    await pending
    await vi.waitFor(() => expect(row.querySelector('input')).toBeNull())
    expect(wrapper.emitted('edit')).toHaveLength(1)
    expect(save.mock.calls[1]![0].values).toMatchObject({
      name: 'Changed',
      status: 'draft',
      count: 0,
    })
    await userEvent.click(row.querySelector('[data-hn-edit-trigger]')!)
    await setValue(row.querySelector('[data-hn-cell="count"] input')!, '-1')
    await api(wrapper).commitEdit()
    await vi.waitFor(() =>
      expect(row.querySelector('[role="alert"]')?.textContent?.trim()).toBe('Nonnegative'),
    )
    expect(wrapper.findAll('[role="alert"]')).toHaveLength(1)
    expect(wrapper.find('[data-edit-error]')).toBeNull()
    const input = row.querySelector('[data-hn-cell="count"] input')!
    expect(input.getAttribute('aria-invalid')).toBe('true')
    expect(input.getAttribute('aria-describedby')).toBe(
      row.querySelector('[role="alert"]')!.getAttribute('id'),
    )
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
      const viewport = wrapper.find('[data-overlayscrollbars-viewport]')!
      await userEvent.click(wrapper.find('[data-hn-edit-trigger]')!)
      await api(wrapper).commitEdit()
      await vi.waitFor(() => expect(wrapper.find('[data-edit-error]')).not.toBeNull())
      viewport.scrollLeft = (dir === 'rtl' ? -1 : 1) * (viewport.scrollWidth - viewport.clientWidth)
      await frame()
      const visible = () => {
        const box = viewport.getBoundingClientRect()
        const message = wrapper.find('[data-edit-error] [role="alert"]')!.getBoundingClientRect()
        expect(message.left).toBeGreaterThanOrEqual(box.left)
        expect(message.right).toBeLessThanOrEqual(box.right)
        expect(message.width).toBeGreaterThan(200)
      }
      visible()
      wrapper.element.parentElement!.style.width = '450px'
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
    const row = wrapper.find('[data-hn-row]')!
    await userEvent.click(row.querySelector('[data-hn-edit-trigger]')!)
    await frame()
    const second = wrapper.findAll('[data-hn-row]')[1]!
    const top = second.getBoundingClientRect().top
    await api(wrapper).commitEdit()
    await vi.waitFor(() => expect(wrapper.find('[data-edit-error]')).not.toBeNull())
    await frame()
    const error = wrapper.find('[data-edit-error]')!
    expect(second.getBoundingClientRect().top - top).toBeCloseTo(
      error.getBoundingClientRect().height,
      0,
    )
    expect(wrapper.find('table')!.getAttribute('aria-rowcount')).toBe('32')
    api(wrapper).cancelEdit()
    await vi.waitFor(() => expect(wrapper.find('[data-edit-error]')).toBeNull())
    await frame()
    expect(second.getBoundingClientRect().top).toBeCloseTo(top, 0)
    expect(wrapper.find('table')!.getAttribute('aria-rowcount')).toBe('31')
  })
})
