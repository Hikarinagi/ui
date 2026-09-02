import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import MultiSelect from './MultiSelect.vue'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

const options = [
  { value: 'gal', label: 'Galgame' },
  { value: 'ln', label: '轻小说' },
  { value: 'manga', label: '漫画' },
  { value: 'anime', label: '动画' },
]

const triggerOf = (w: ReturnType<typeof mount>) => w.find('[data-hn-multi-select]')

describe('触发器', () => {
  it('触发器是可聚焦的 div 宿主（内部要放按钮），role=combobox，无值时显示占位', () => {
    const w = mount(MultiSelect, { props: { options }, attrs: { 'aria-label': '类型' } })
    const trigger = triggerOf(w)
    expect(trigger.element.tagName).toBe('DIV')
    expect(trigger.attributes('role')).toBe('combobox')
    expect(trigger.attributes('tabindex')).toBe('0')
    expect(trigger.attributes('aria-label')).toBe('类型')
    expect(trigger.classes()).toContain('hn-field')
    expect(trigger.text()).toBe('请选择')
    expect(trigger.attributes('data-placeholder')).toBe('')
    expect(trigger.find('button').exists()).toBe(false)
  })

  it('已选项以 Chip 显示，超过 maxVisible 折成 +N；每个 Chip 可移除，清除钮清空并发出 clear', async () => {
    const w = mount(MultiSelect, {
      props: {
        options,
        clearable: true,
        modelValue: ['gal', 'ln', 'manga'],
        'onUpdate:modelValue': (v: Array<string | number>) => w.setProps({ modelValue: v }),
      },
    })
    const trigger = triggerOf(w)
    const chips = trigger.findAll('[data-hn-chip]')
    expect(chips.map(c => c.text())).toEqual(['Galgame', '轻小说', '+1'])
    expect(trigger.attributes('data-placeholder')).toBeUndefined()

    await chips[0]!.find('button').trigger('click')
    expect(w.props('modelValue')).toEqual(['ln', 'manga'])

    const clear = trigger.find('button[aria-label="清除"]')
    expect(clear.exists()).toBe(true)
    await clear.trigger('click')
    expect(w.props('modelValue')).toEqual([])
    expect(w.emitted('clear')).toHaveLength(1)
  })

  it('maxVisible 可调；默认没有整体清除钮，Chip 各有移除钮', () => {
    const w = mount(MultiSelect, {
      props: { options, modelValue: ['gal', 'ln', 'manga'], maxVisible: 3 },
    })
    const trigger = triggerOf(w)
    expect(trigger.findAll('[data-hn-chip]')).toHaveLength(3)
    expect(trigger.findAll('[data-hn-chip] button')).toHaveLength(3)
    expect(trigger.find('button[aria-label="清除"]').exists()).toBe(false)
  })

  it('invalid 与 disabled：禁用后退出 Tab 序列、带 aria-disabled，清除钮不渲染', () => {
    const invalid = triggerOf(mount(MultiSelect, { props: { options, invalid: true } }))
    expect(invalid.attributes('data-invalid')).toBe('')
    expect(invalid.attributes('aria-invalid')).toBe('true')
    const disabled = triggerOf(
      mount(MultiSelect, { props: { options, disabled: true, modelValue: ['gal'] } }),
    )
    expect(disabled.attributes('tabindex')).toBe('-1')
    expect(disabled.attributes('aria-disabled')).toBe('true')
    expect(disabled.find('button[aria-label="清除"]').exists()).toBe(false)
  })

  it('无 a11y 违规', async () => {
    const w = mount(MultiSelect, {
      props: { options, modelValue: ['gal', 'ln'] },
      attrs: { 'aria-label': '类型' },
      attachTo: document.body,
    })
    await expectNoA11yViolations(w.element)
  })
})
