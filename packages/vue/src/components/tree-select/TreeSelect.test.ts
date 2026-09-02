import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import TreeSelect from './TreeSelect.vue'
import { findNode, pathTo } from './types'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

const items = [
  {
    value: 'jp',
    label: '日本',
    children: [
      { value: 'tokyo', label: '东京', children: [{ value: 'shibuya', label: '涩谷' }] },
      { value: 'osaka', label: '大阪' },
    ],
  },
  { value: 'cn', label: '中国', children: [{ value: 'shanghai', label: '上海', disabled: true }] },
]

const triggerOf = (w: ReturnType<typeof mount>) => w.find('[data-hn-tree-select]')

describe('触发器', () => {
  it('触发器就是输入面宿主，role=combobox，无值显示占位并标 data-placeholder，有值显示节点文字', async () => {
    const w = mount(TreeSelect, { props: { items }, attrs: { 'aria-label': '地区' } })
    const trigger = triggerOf(w)
    expect(trigger.attributes('role')).toBe('combobox')
    expect(trigger.attributes('aria-label')).toBe('地区')
    expect(trigger.classes()).toContain('hn-field')
    expect(trigger.classes()).toContain('group/hn-disclosure')
    expect(trigger.text()).toBe('请选择')
    expect(trigger.attributes('data-placeholder')).toBe('')
    await w.setProps({ modelValue: 'shibuya', placeholder: '选择地区' })
    expect(triggerOf(w).text()).toBe('涩谷')
    expect(triggerOf(w).attributes('data-placeholder')).toBeUndefined()
  })

  it('双形态与档位类与 Input 同源；invalid 与 disabled 落到触发器', () => {
    expect(triggerOf(mount(TreeSelect, { props: { items } })).classes()).toContain(
      '[--hn-field-shadow:var(--hn-shadow-sm)]',
    )
    expect(
      triggerOf(mount(TreeSelect, { props: { items, variant: 'secondary' } })).classes(),
    ).toContain('border-transparent')
    expect(
      triggerOf(mount(TreeSelect, { props: { items, size: 'lg' } }))
        .classes()
        .join(' '),
    ).toContain('control-h-lg')
    const invalid = triggerOf(mount(TreeSelect, { props: { items, invalid: true } }))
    expect(invalid.attributes('data-invalid')).toBe('')
    expect(invalid.attributes('aria-invalid')).toBe('true')
    expect(
      (
        triggerOf(mount(TreeSelect, { props: { items, disabled: true } }))
          .element as HTMLButtonElement
      ).disabled,
    ).toBe(true)
  })

  it('无 a11y 违规', async () => {
    const w = mount(TreeSelect, {
      props: { items, modelValue: 'osaka' },
      attrs: { 'aria-label': '地区' },
      attachTo: document.body,
    })
    await expectNoA11yViolations(w.element)
  })
})

describe('树数据', () => {
  it('按值找节点，求到根的路径', () => {
    expect(findNode(items, 'shibuya')?.label).toBe('涩谷')
    expect(findNode(items, 'nope')).toBeUndefined()
    expect(pathTo(items, 'shibuya')).toEqual(['jp', 'tokyo'])
    expect(pathTo(items, 'jp')).toEqual([])
    expect(pathTo(items, 'nope')).toBeNull()
  })
})
