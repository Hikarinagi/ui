import { afterEach, describe, expect, it } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createCommentVNode, Fragment, h, nextTick, reactive } from 'vue'
import Listbox from './Listbox.vue'
import type { SelectOption } from '../select/types'

const mounted: VueWrapper[] = []
afterEach(() => mounted.splice(0).forEach(w => w.unmount()))
const options = [
  { value: 0, label: 'Zero' },
  { value: '0', label: 'String zero' },
  {
    label: 'Group',
    options: [
      { value: '', label: 'Empty string' },
      { value: 'grouped', label: 'Grouped' },
    ],
  },
]
type SlotProps = { option: SelectOption; selected: boolean }
function build(
  props: Record<string, unknown> = {},
  slots: Partial<Record<'option' | 'trailing', (props: SlotProps) => unknown>> = {},
) {
  const w = mount(Listbox, { props: { options, ...props }, slots })
  mounted.push(w)
  return w
}
function states(w: VueWrapper, selector: string) {
  return w.findAll(selector).map(el => el.attributes('data-selected'))
}
const stateSlot = ({ option, selected }: SlotProps) =>
  h('span', { 'data-selected': String(selected) }, option.label)

describe('Listbox trailing slots', () => {
  it('option and trailing agree with aria-selected for numeric, string, empty and cleared single values', async () => {
    const w = build({ modelValue: 0 }, { option: stateSlot, trailing: stateSlot })
    for (const value of [0, '0', '', 'grouped', null, undefined]) {
      await w.setProps({ modelValue: value })
      const expected = [0, '0', '', 'grouped'].map(v => String(v === value))
      expect(states(w, '[role="option"] > span:first-child > span')).toEqual(expected)
      expect(states(w, '[role="option"] > span:last-child')).toEqual(expected)
      expect(w.findAll('[role="option"]').map(row => row.attributes('aria-selected'))).toEqual(
        expected,
      )
    }
  })

  it('multi-selection and external updates reach grouped and plain custom content', async () => {
    const w = build({ multiple: true, modelValue: [0, 'grouped'] }, { trailing: stateSlot })
    expect(states(w, '[data-selected]')).toEqual(['true', 'false', 'false', 'true'])
    await w.setProps({ modelValue: ['0', ''] })
    expect(states(w, '[data-selected]')).toEqual(['false', 'true', 'true', 'false'])
    await w.setProps({ modelValue: [] })
    expect(states(w, '[data-selected]')).toEqual(['false', 'false', 'false', 'false'])
  })

  it('without trailing, the default indicator remains even when only option is customised', () => {
    const w = build({ modelValue: 'grouped' }, { option: stateSlot })
    const rows = w.findAll('[role="option"]')
    expect(rows.every(row => row.element.children.length === 2)).toBe(true)
    expect(rows[3]!.find('svg').exists()).toBe(true)
    expect(rows[0]!.find('svg').exists()).toBe(false)
  })

  for (const [name, empty] of [
    ['empty array', () => []],
    ['conditional comment', () => createCommentVNode('v-if')],
    ['empty fragment', () => h(Fragment, [])],
  ] as const) {
    it(`${name} intentionally removes the tail, including on selected rows`, () => {
      const w = build({ modelValue: 'grouped' }, { trailing: empty })
      expect(w.findAll('[role="option"]').every(row => row.element.children.length === 1)).toBe(
        true,
      )
      expect(w.find('svg').exists()).toBe(false)
    })
  }

  it('reactive counts and per-option empty content update without reselecting', async () => {
    const counts = reactive<Record<string, number>>({ '0': 12, '': 6, grouped: 4 })
    const hidden = reactive({ value: false })
    const w = build(
      { modelValue: 0 },
      {
        trailing: ({ option, selected }: SlotProps) =>
          hidden.value || option.value === ''
            ? createCommentVNode('v-if')
            : h('span', { 'data-tail': '' }, selected ? 'check' : counts[option.value]),
      },
    )
    expect(w.findAll('[data-tail]').map(el => el.text())).toEqual(['check', '12', '4'])
    counts.grouped = 999
    await nextTick()
    expect(w.findAll('[data-tail]').at(-1)!.text()).toBe('999')
    hidden.value = true
    await nextTick()
    expect(w.findAll('[role="option"]').every(row => row.element.children.length === 1)).toBe(true)
    hidden.value = false
    await nextTick()
    expect(w.findAll('[data-tail]')).toHaveLength(3)
  })
})

it('updates option data and the presence of a trailing slot without changing selection', async () => {
  const state = reactive({ custom: false, label: 'Before' })
  const w = mount({
    render: () =>
      h(
        Listbox,
        {
          options: [{ value: 'one', label: state.label }],
          modelValue: 'one',
        },
        state.custom
          ? { trailing: ({ option }: SlotProps) => h('span', { 'data-tail': '' }, option.label) }
          : {},
      ),
  })
  mounted.push(w)
  expect(w.find('svg').exists()).toBe(true)
  state.custom = true
  await nextTick()
  expect(w.get('[data-tail]').text()).toBe('Before')
  expect(w.find('svg').exists()).toBe(false)
  state.label = 'After'
  await nextTick()
  expect(w.get('[data-tail]').text()).toBe('After')
  state.custom = false
  await nextTick()
  expect(w.find('[data-tail]').exists()).toBe(false)
  expect(w.find('svg').exists()).toBe(true)
})
