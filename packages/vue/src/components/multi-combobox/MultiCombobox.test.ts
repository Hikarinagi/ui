import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import MultiCombobox from './MultiCombobox.vue'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

const options = [
  { value: 1, label: 'Key' },
  { value: 2, label: 'Type-Moon' },
  { value: 3, label: 'Nitroplus' },
]

const hostOf = (w: ReturnType<typeof mount>) => w.find('[data-hn-multi-combobox]')
const inputOf = (w: ReturnType<typeof mount>) => w.find('input[role="combobox"]')
const chipsOf = (w: ReturnType<typeof mount>) =>
  w.findAll('[data-hn-chip]').map(chip => chip.text())

describe('结构', () => {
  it('宿主是输入面，class 落宿主、attrs 落文本输入；已选项以 Chip 排在输入区前面；无值时才显示占位', () => {
    const w = mount(MultiCombobox, {
      props: { options, modelValue: [1, 2], class: 'w-72' },
      attrs: { 'aria-label': '制作公司' },
    })
    expect(hostOf(w).classes()).toContain('hn-field')
    expect(hostOf(w).classes()).toContain('w-72')
    expect(inputOf(w).attributes('aria-label')).toBe('制作公司')
    expect(inputOf(w).attributes('placeholder')).toBeUndefined()
    expect(chipsOf(w)).toEqual(['Key', 'Type-Moon'])
    expect(w.find('button[aria-label="展开选项"]').exists()).toBe(true)

    const empty = mount(MultiCombobox, { props: { options } })
    expect(inputOf(empty).attributes('placeholder')).toBe('输入或选择')
    expect(chipsOf(empty)).toEqual([])
  })

  it('组件记住见过的选项名称：结果列表换掉后已选 Chip 仍有名称，没见过的值显示值本身', async () => {
    const w = mount(MultiCombobox, { props: { options, modelValue: [1, 3] } })
    await w.setProps({ options: [{ value: 9, label: '别的结果' }] })
    expect(chipsOf(w)).toEqual(['Key', 'Nitroplus'])
    await w.setProps({ modelValue: [1, 3, 42] })
    expect(chipsOf(w)).toEqual(['Key', 'Nitroplus', '42'])
  })

  it('disabled 与 invalid：输入区禁用、Chip 的移除钮禁用、清除钮不渲染；invalid 落在宿主与输入区', () => {
    const w = mount(MultiCombobox, {
      props: { options, modelValue: [1], disabled: true, clearable: true, invalid: true },
    })
    expect(inputOf(w).attributes('disabled')).toBeDefined()
    expect(inputOf(w).attributes('aria-invalid')).toBe('true')
    expect(hostOf(w).attributes('data-invalid')).toBe('')
    expect(w.find('[data-hn-chip] button').attributes('disabled')).toBeDefined()
    expect(w.find('[data-hn-multi-combobox-clear]').exists()).toBe(false)
  })
})

describe('交互', () => {
  it('点 Chip 的移除钮移除该项；空输入时退格移除最后一项；清除钮清空并发 clear', async () => {
    const w = mount(MultiCombobox, {
      props: {
        options,
        modelValue: [1, 2, 3],
        clearable: true,
        'onUpdate:modelValue': (value: Array<string | number>) => w.setProps({ modelValue: value }),
      },
      attachTo: document.body,
    })
    await w.find('[data-hn-chip] button').trigger('click')
    expect(w.emitted('update:modelValue')?.[0]).toEqual([[2, 3]])

    await inputOf(w).trigger('keydown', { key: 'Backspace' })
    expect(w.emitted('update:modelValue')?.[1]).toEqual([[2]])

    await w.find('[data-hn-multi-combobox-clear] button').trigger('click')
    expect(w.emitted('update:modelValue')?.[2]).toEqual([[]])
    expect(w.emitted('clear')).toHaveLength(1)
  })

  it('输入区有文字时退格不动已选项', async () => {
    const w = mount(MultiCombobox, {
      props: { options, modelValue: [1], search: 'ni' },
      attachTo: document.body,
    })
    ;(inputOf(w).element as HTMLInputElement).value = 'ni'
    await inputOf(w).trigger('keydown', { key: 'Backspace' })
    expect(w.emitted('update:modelValue')).toBeUndefined()
  })
})

describe('无障碍', () => {
  it('无违规', async () => {
    const w = mount(MultiCombobox, {
      props: { options, modelValue: [1, 2] },
      attrs: { 'aria-label': '制作公司' },
      attachTo: document.body,
    })
    await expectNoA11yViolations(w.element)
  })
})
