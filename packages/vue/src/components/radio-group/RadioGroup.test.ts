import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import RadioGroup from './RadioGroup.vue'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

const options = [
  { value: 'wish', label: '想看' },
  { value: 'doing', label: '在看', description: '正在追' },
  { value: 'done', label: '看过', disabled: true },
]

describe('结构', () => {
  it('根是 role=radiogroup，attrs 与 class 落在根上；每项是 label 包着 role=radio 的按钮', () => {
    const w = mount(RadioGroup, {
      props: { options, class: 'w-64' },
      attrs: { 'aria-label': '状态' },
    })
    expect(w.attributes('role')).toBe('radiogroup')
    expect(w.attributes('data-hn-radio-group')).toBe('')
    expect(w.attributes('aria-label')).toBe('状态')
    expect(w.classes()).toContain('w-64')
    expect(w.classes()).toContain('flex-col')
    const items = w.findAll('[data-hn-radio]')
    expect(items.map(i => i.element.tagName)).toEqual(['LABEL', 'LABEL', 'LABEL'])
    expect(items.every(i => i.attributes('data-hn-state-group') === '')).toBe(true)
    expect(items.map(i => i.text())).toEqual(['想看', '在看正在追', '看过'])
    const radios = w.findAll('[role="radio"]')
    expect(radios).toHaveLength(3)
    expect(radios[0]!.element.tagName).toBe('BUTTON')
    expect(radios[0]!.classes()).toContain('rounded-full')
    expect(radios[2]!.attributes('disabled')).toBeDefined()
    expect(items[2]!.attributes('data-disabled')).toBe('')
  })

  it('已选项带 aria-checked、data-state 与圆点；其余没有圆点', () => {
    const w = mount(RadioGroup, { props: { options, modelValue: 'doing' } })
    const radios = w.findAll('[role="radio"]')
    expect(radios.map(r => r.attributes('aria-checked'))).toEqual(['false', 'true', 'false'])
    expect(radios[1]!.attributes('data-state')).toBe('checked')
    expect(radios[1]!.find('span').exists()).toBe(true)
    expect(radios[0]!.find('span').exists()).toBe(false)
  })

  it('horizontal 横排；size 下发到每项；disabled 整组禁用；invalid 落到每个圆', () => {
    const horizontal = mount(RadioGroup, { props: { options, orientation: 'horizontal' } })
    expect(horizontal.classes()).toContain('flex-row')
    const sized = mount(RadioGroup, { props: { options, size: 'lg' } })
    expect(sized.findAll('[data-hn-radio]').every(i => i.classes().includes('text-md'))).toBe(true)
    const disabled = mount(RadioGroup, { props: { options, disabled: true } })
    expect(disabled.attributes('data-disabled')).toBe('')
    expect(
      disabled.findAll('[role="radio"]').every(r => r.attributes('disabled') !== undefined),
    ).toBe(true)
    expect(
      disabled.findAll('[data-hn-radio]').every(i => i.attributes('data-disabled') === ''),
    ).toBe(true)
    const invalid = mount(RadioGroup, { props: { options, invalid: true } })
    expect(invalid.findAll('[role="radio"]').every(r => r.attributes('data-invalid') === '')).toBe(
      true,
    )
    expect(
      invalid.findAll('[role="radio"]').every(r => r.attributes('aria-invalid') === 'true'),
    ).toBe(true)
  })

  it('option 插槽定制每一项的文字', () => {
    const w = mount(RadioGroup, {
      props: { options },
      slots: { option: `<template #option="{ option }">[{{ option.label }}]</template>` },
    })
    expect(w.findAll('[data-hn-radio]')[0]!.text()).toBe('[想看]')
  })
})

describe('交互', () => {
  it('点选写回该项的值；禁用项不响应', async () => {
    const w = mount(RadioGroup, {
      props: {
        options,
        modelValue: 'wish',
        'onUpdate:modelValue': v => w.setProps({ modelValue: v }),
      },
    })
    const radios = () => w.findAll('[role="radio"]')
    await radios()[1]!.trigger('click')
    expect(w.emitted('update:modelValue')?.[0]).toEqual(['doing'])
    await radios()[2]!.trigger('click')
    expect(w.emitted('update:modelValue')).toHaveLength(1)
  })
})

describe('无障碍', () => {
  it('无违规', async () => {
    const w = mount(RadioGroup, {
      props: { options, modelValue: 'wish' },
      attrs: { 'aria-label': '状态' },
      attachTo: document.body,
    })
    await expectNoA11yViolations(w.element)
  })
})
