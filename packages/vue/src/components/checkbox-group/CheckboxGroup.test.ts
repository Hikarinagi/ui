import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import CheckboxGroup from './CheckboxGroup.vue'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

const options = [
  { value: 'gal', label: 'Galgame' },
  { value: 'ln', label: '轻小说', description: '文库本' },
  { value: 'manga', label: '漫画', disabled: true },
]

describe('结构', () => {
  it('根是 role=group，attrs 与 class 落在根上；每个选项一枚 Checkbox，文字与描述照选项渲染', () => {
    const w = mount(CheckboxGroup, {
      props: { options, class: 'w-64' },
      attrs: { 'aria-label': '类型' },
    })
    expect(w.attributes('role')).toBe('group')
    expect(w.attributes('data-hn-checkbox-group')).toBe('')
    expect(w.attributes('aria-label')).toBe('类型')
    expect(w.attributes('data-orientation')).toBe('vertical')
    expect(w.classes()).toContain('w-64')
    expect(w.classes()).toContain('flex-col')
    const items = w.findAll('[data-hn-checkbox]')
    expect(items.map(i => i.text())).toEqual(['Galgame', '轻小说文库本', '漫画'])
    expect(w.findAll('[role="checkbox"]')).toHaveLength(3)
    expect(w.findAll('[role="checkbox"]')[2]!.attributes('disabled')).toBeDefined()
    expect(items[2]!.attributes('data-disabled')).toBe('')
  })

  it('已选项由数组决定：aria-checked、data-state 与勾', () => {
    const w = mount(CheckboxGroup, { props: { options, modelValue: ['ln'] } })
    const boxes = w.findAll('[role="checkbox"]')
    expect(boxes.map(b => b.attributes('aria-checked'))).toEqual(['false', 'true', 'false'])
    expect(boxes[1]!.attributes('data-state')).toBe('checked')
    expect(boxes[1]!.find('svg.lucide-check').exists()).toBe(true)
    expect(boxes[0]!.find('svg').exists()).toBe(false)
  })

  it('horizontal 横排；size 下发到每枚；disabled 整组禁用；invalid 落到每个盒', () => {
    const horizontal = mount(CheckboxGroup, { props: { options, orientation: 'horizontal' } })
    expect(horizontal.attributes('data-orientation')).toBe('horizontal')
    expect(horizontal.classes()).toContain('flex-row')
    const sized = mount(CheckboxGroup, { props: { options, size: 'sm' } })
    expect(sized.findAll('[data-hn-checkbox]').every(i => i.classes().includes('text-sm'))).toBe(
      true,
    )
    const disabled = mount(CheckboxGroup, { props: { options, disabled: true } })
    expect(disabled.attributes('data-disabled')).toBe('')
    expect(
      disabled.findAll('[role="checkbox"]').every(b => b.attributes('disabled') !== undefined),
    ).toBe(true)
    expect(
      disabled.findAll('[data-hn-checkbox]').every(i => i.attributes('data-disabled') === ''),
    ).toBe(true)
    const invalid = mount(CheckboxGroup, { props: { options, invalid: true } })
    expect(
      invalid.findAll('[role="checkbox"]').every(b => b.attributes('data-invalid') === ''),
    ).toBe(true)
  })

  it('option 插槽定制每一项的文字', () => {
    const w = mount(CheckboxGroup, {
      props: { options },
      slots: { option: `<template #option="{ option }">[{{ option.label }}]</template>` },
    })
    expect(w.findAll('[data-hn-checkbox]')[0]!.text()).toBe('[Galgame]')
  })
})

describe('交互', () => {
  it('点选加入数组，再点移除；禁用项不响应', async () => {
    const w = mount(CheckboxGroup, {
      props: {
        options,
        modelValue: ['gal'],
        'onUpdate:modelValue': v => w.setProps({ modelValue: v }),
      },
    })
    const boxes = () => w.findAll('[role="checkbox"]')
    await boxes()[1]!.trigger('click')
    expect(w.emitted('update:modelValue')?.[0]).toEqual([['gal', 'ln']])
    await boxes()[0]!.trigger('click')
    expect(w.emitted('update:modelValue')?.[1]).toEqual([['ln']])
    await boxes()[2]!.trigger('click')
    expect(w.emitted('update:modelValue')).toHaveLength(2)
  })
})

describe('无障碍', () => {
  it('无违规', async () => {
    const w = mount(CheckboxGroup, {
      props: { options, modelValue: ['gal'] },
      attrs: { 'aria-label': '类型' },
      attachTo: document.body,
    })
    await expectNoA11yViolations(w.element)
  })
})
