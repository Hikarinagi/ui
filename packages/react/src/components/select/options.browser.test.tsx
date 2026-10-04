import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { render } from 'vitest-browser-react'
import type { ComponentType, ReactNode } from 'react'
import { Select } from './Select'
import { MultiSelect } from '../multi-select/MultiSelect'
import { Listbox } from '../listbox/Listbox'
import { CheckboxGroup } from '../checkbox-group/CheckboxGroup'
import { RadioGroup } from '../radio-group/RadioGroup'
import { SegmentedControl } from '../segmented-control/SegmentedControl'
import type { SelectOption } from './types'
import '../../../test/browser.css'

const mounted: Array<{ unmount: () => Promise<void> | void }> = []
type Option = SelectOption<{ count: number; options: { nested: boolean } }>
const option: Option = { value: 0, label: 'Zero', count: 12, options: { nested: true } }
type Slots = Record<string, (props: { option: Option; selected?: boolean }) => ReactNode>
type AnyComponent = ComponentType<Record<string, unknown>>
const cases: Array<[string, AnyComponent, boolean, string | null]> = [
  ['Select', Select as unknown as AnyComponent, false, '[data-hn-select-trigger]'],
  ['MultiSelect', MultiSelect as unknown as AnyComponent, true, '[data-hn-multi-select]'],
  ['Listbox', Listbox as unknown as AnyComponent, false, null],
]
afterEach(async () => {
  for (const w of mounted.splice(0)) await w.unmount()
  document.body.innerHTML = ''
})

async function renderComponent(
  Component: AnyComponent,
  options: unknown[],
  multiple: boolean,
  slots: Slots,
) {
  const host = document.createElement('div')
  host.style.cssText = 'width:320px;padding:32px'
  document.body.appendChild(host)
  const renderers = Object.fromEntries(
    Object.entries(slots).map(([name, slot]) => [
      `render${name[0]!.toUpperCase()}${name.slice(1)}`,
      slot,
    ]),
  )
  const screen = await render(
    <Component options={options} value={multiple ? [0] : 0} aria-label="选项" {...renderers} />,
    { container: host },
  )
  mounted.push(screen)
  return host
}

describe.each([false, true])('分组 %s 的业务字段', grouped => {
  it.each(cases)('%s 的 option 插槽拿到原始业务数据', async (_, component, multiple, trigger) => {
    const seen: Option[] = []
    const options = grouped ? [{ label: 'Group', options: [option] }] : [option]
    const w = await renderComponent(component, options, multiple, {
      option: ({ option }) => {
        seen.push(option)
        return <span data-business-option="">{option.count.toFixed()}</span>
      },
    })
    if (trigger) await userEvent.click(w.querySelector<HTMLElement>(trigger)!)
    await vi.waitFor(() =>
      expect(document.querySelector('[data-business-option]')?.textContent).toBe('12'),
    )
    expect(seen).toContain(option)
  })
})

describe('其他选项插槽', () => {
  it.each([
    ['CheckboxGroup', CheckboxGroup as unknown as AnyComponent, true],
    ['RadioGroup', RadioGroup as unknown as AnyComponent, false],
    ['SegmentedControl', SegmentedControl as unknown as AnyComponent, false],
  ] as const)('%s 的 option 保留完整数据', async (_, component, multiple) => {
    const seen: Option[] = []
    const w = await renderComponent(component, [option], multiple, {
      option: ({ option }) => {
        seen.push(option)
        return <span>{option.count.toFixed()}</span>
      },
    })
    expect(w.textContent).toContain('12')
    expect(seen).toContain(option)
  })

  it('Select value 与 Listbox trailing 同样保留原始对象和选中状态', async () => {
    let value: Option | undefined
    const select = await renderComponent(Select as unknown as AnyComponent, [option], false, {
      value: ({ option }) => {
        value = option
        return <span>{option.count.toFixed()}</span>
      },
    })
    expect(select.querySelector('[data-hn-select-trigger]')!.textContent).toBe('12')
    expect(value).toBe(option)
    let trailing: { option: Option; selected?: boolean } | undefined
    await renderComponent(
      Listbox as unknown as AnyComponent,
      [{ label: 'Group', options: [option] }],
      false,
      {
        trailing: props => {
          trailing = { option: props.option, selected: props.selected }
          return <span>{props.option.count.toFixed()}</span>
        },
      },
    )
    await vi.waitFor(() => expect(trailing?.selected).toBe(true))
    expect(trailing?.option).toBe(option)
  })
})
