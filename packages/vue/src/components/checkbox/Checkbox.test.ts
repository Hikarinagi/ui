import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Checkbox from './Checkbox.vue'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

describe('结构', () => {
  it('根是 label，盒是 role=checkbox 的按钮，文字与描述在盒之后；attrs 落在盒上，class 落在根上', () => {
    const w = mount(Checkbox, {
      props: { description: '每周一封', class: 'w-64' },
      attrs: { id: 'letter', 'data-x': '1' },
      slots: { default: '订阅周报' },
    })
    expect(w.element.tagName).toBe('LABEL')
    expect(w.attributes('data-hn-checkbox')).toBe('')
    expect(w.attributes('data-hn-state-group')).toBe('')
    expect(w.classes()).toContain('w-64')
    const box = w.find('[role="checkbox"]')
    expect(box.element.tagName).toBe('BUTTON')
    expect(box.attributes('type')).toBe('button')
    expect(box.attributes('id')).toBe('letter')
    expect(box.attributes('data-x')).toBe('1')
    expect(box.attributes('aria-checked')).toBe('false')
    expect(box.attributes('data-state')).toBe('unchecked')
    expect(box.find('svg').exists()).toBe(false)
    expect(w.text()).toContain('订阅周报')
    expect(w.text()).toContain('每周一封')
    expect(w.find('.text-muted').text()).toBe('每周一封')
  })

  it('无文字时只有盒，名称经 aria-label 落在盒上', () => {
    const w = mount(Checkbox, { attrs: { 'aria-label': '全选' } })
    expect(w.find('[role="checkbox"]').attributes('aria-label')).toBe('全选')
    expect(w.findAll(':scope > span')).toHaveLength(0)
  })

  it('选中与半选：aria-checked 与 data-state 随值变化，盒内的图标只在有值时存在', () => {
    const checked = mount(Checkbox, { props: { modelValue: true } })
    const box = checked.find('[role="checkbox"]')
    expect(box.attributes('aria-checked')).toBe('true')
    expect(box.attributes('data-state')).toBe('checked')
    expect(box.find('svg.lucide-check').exists()).toBe(true)
    const mixed = mount(Checkbox, { props: { modelValue: 'indeterminate' } })
    const mixedBox = mixed.find('[role="checkbox"]')
    expect(mixedBox.attributes('aria-checked')).toBe('mixed')
    expect(mixedBox.attributes('data-state')).toBe('indeterminate')
    expect(mixedBox.find('svg.lucide-minus').exists()).toBe(true)
    expect(mixedBox.find('svg.lucide-check').exists()).toBe(false)
  })

  it('三档尺寸落在根上的字号与尺寸变量，描述随档位小一号', () => {
    const sm = mount(Checkbox, { props: { size: 'sm', description: 'd' } })
    expect(sm.classes()).toContain('text-sm')
    expect(sm.classes()).toContain('[--hn-checkbox-size:0.875rem]')
    expect(sm.find('.text-muted').classes()).toContain('text-xs')
    const lg = mount(Checkbox, { props: { size: 'lg', description: 'd' } })
    expect(lg.classes()).toContain('text-md')
    expect(lg.classes()).toContain('[--hn-checkbox-size:1.125rem]')
    expect(lg.find('.text-muted').classes()).toContain('text-base')
  })

  it('disabled 落在根与盒上；invalid 只落在盒上', () => {
    const disabled = mount(Checkbox, { props: { disabled: true } })
    expect(disabled.attributes('data-disabled')).toBe('')
    const box = disabled.find('[role="checkbox"]')
    expect(box.attributes('disabled')).toBeDefined()
    expect(box.attributes('data-disabled')).toBe('')
    const invalid = mount(Checkbox, { props: { invalid: true } })
    expect(invalid.attributes('data-invalid')).toBeUndefined()
    const invalidBox = invalid.find('[role="checkbox"]')
    expect(invalidBox.attributes('data-invalid')).toBe('')
    expect(invalidBox.attributes('aria-invalid')).toBe('true')
  })
})

describe('交互', () => {
  it('点击盒切换值；半选点一下变为选中；禁用时不响应', async () => {
    const w = mount(Checkbox, {
      props: { modelValue: false, 'onUpdate:modelValue': v => w.setProps({ modelValue: v }) },
    })
    await w.find('[role="checkbox"]').trigger('click')
    expect(w.emitted('update:modelValue')?.[0]).toEqual([true])
    await w.find('[role="checkbox"]').trigger('click')
    expect(w.emitted('update:modelValue')?.[1]).toEqual([false])

    const mixed = mount(Checkbox, { props: { modelValue: 'indeterminate' } })
    await mixed.find('[role="checkbox"]').trigger('click')
    expect(mixed.emitted('update:modelValue')?.[0]).toEqual([true])

    const disabled = mount(Checkbox, { props: { disabled: true } })
    await disabled.find('[role="checkbox"]').trigger('click')
    expect(disabled.emitted('update:modelValue')).toBeUndefined()
  })
})

describe('无障碍', () => {
  it('有文字、有描述、仅 aria-label 三种形态均无违规', async () => {
    const labelled = mount(Checkbox, {
      props: { modelValue: true, description: '每周一封' },
      slots: { default: '订阅周报' },
      attachTo: document.body,
    })
    await expectNoA11yViolations(labelled.element)
    const bare = mount(Checkbox, { attrs: { 'aria-label': '全选' }, attachTo: document.body })
    await expectNoA11yViolations(bare.element)
  })
})
