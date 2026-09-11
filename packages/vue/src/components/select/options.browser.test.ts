import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { mount, type VueWrapper } from '@vue/test-utils'
import { h, toRaw, type Component } from 'vue'
import Select from './Select.vue'
import MultiSelect from '../multi-select/MultiSelect.vue'
import Combobox from '../combobox/Combobox.vue'
import MultiCombobox from '../multi-combobox/MultiCombobox.vue'
import Listbox from '../listbox/Listbox.vue'
import CheckboxGroup from '../checkbox-group/CheckboxGroup.vue'
import RadioGroup from '../radio-group/RadioGroup.vue'
import SegmentedControl from '../segmented-control/SegmentedControl.vue'
import type { SelectOption } from './types'
import '../../../test/browser.css'

const mounted: VueWrapper[] = []
type Option = SelectOption<{ count: number; options: { nested: boolean } }>
const option: Option = { value: 0, label: 'Zero', count: 12, options: { nested: true } }
const cases: Array<[string, Component, boolean, string | null]> = [
  ['Select', Select, false, '[data-hn-select-trigger]'],
  ['MultiSelect', MultiSelect, true, '[data-hn-multi-select]'],
  ['Combobox', Combobox, false, 'input'],
  ['MultiCombobox', MultiCombobox, true, 'input'],
  ['Listbox', Listbox, false, null],
]
afterEach(() => {
  mounted.forEach(w => w.unmount())
  mounted.length = 0
  document.body.innerHTML = ''
})

function render(
  component: Component,
  options: unknown[],
  multiple: boolean,
  slots: Record<string, (props: { option: Option; selected?: boolean }) => unknown>,
) {
  const host = document.createElement('div')
  host.style.cssText = 'width:320px;padding:32px'
  document.body.appendChild(host)
  const w = mount(component, {
    props: { options, modelValue: multiple ? [0] : 0 },
    slots,
    attrs: { 'aria-label': '选项' },
    attachTo: host,
  })
  mounted.push(w)
  return w
}

describe.each([false, true])('分组 %s 的业务字段', grouped => {
  it.each(cases)('%s 的 option 插槽拿到原始业务数据', async (_, component, multiple, trigger) => {
    const seen: Option[] = []
    const options = grouped ? [{ label: 'Group', options: [option] }] : [option]
    const w = render(component, options, multiple, {
      option: ({ option }) => {
        seen.push(toRaw(option))
        return h('span', { 'data-business-option': '' }, option.count.toFixed())
      },
    })
    if (trigger) await userEvent.click(w.get(trigger).element)
    await vi.waitFor(() =>
      expect(document.querySelector('[data-business-option]')?.textContent).toBe('12'),
    )
    expect(seen).toContain(option)
  })
})

describe('其他选项插槽', () => {
  it.each([
    ['CheckboxGroup', CheckboxGroup, true],
    ['RadioGroup', RadioGroup, false],
    ['SegmentedControl', SegmentedControl, false],
  ] as const)('%s 的 option 保留完整数据', (_, component, multiple) => {
    const seen: Option[] = []
    const w = render(component, [option], multiple, {
      option: ({ option }) => {
        seen.push(toRaw(option))
        return h('span', option.count.toFixed())
      },
    })
    expect(w.text()).toContain('12')
    expect(seen).toContain(option)
  })

  it('Select value 与 Listbox trailing 同样保留原始对象和选中状态', async () => {
    let value: Option | undefined
    const select = render(Select, [option], false, {
      value: ({ option }) => {
        value = toRaw(option)
        return h('span', option.count.toFixed())
      },
    })
    expect(select.get('[data-hn-select-trigger]').text()).toBe('12')
    expect(value).toBe(option)
    let trailing: { option: Option; selected?: boolean } | undefined
    render(Listbox, [{ label: 'Group', options: [option] }], false, {
      trailing: props => {
        trailing = { option: toRaw(props.option), selected: props.selected }
        return h('span', props.option.count.toFixed())
      },
    })
    await vi.waitFor(() => expect(trailing?.selected).toBe(true))
    expect(trailing?.option).toBe(option)
  })
})
