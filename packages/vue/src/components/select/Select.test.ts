import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Select from './Select.vue'
import { flattenOptions, isOptionGroup } from './types'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

const options = [
  { value: 'gal', label: 'Galgame' },
  { value: 'ln', label: '轻小说', description: '文库本' },
  { value: 'manga', label: '漫画', disabled: true },
]

const triggerOf = (w: ReturnType<typeof mount>) => w.find('[data-hn-select-trigger]')

describe('触发器', () => {
  it('触发器就是输入面宿主，role=combobox，attrs 透传到触发器', () => {
    const w = triggerOf(mount(Select, { props: { options }, attrs: { 'aria-label': '类型' } }))
    expect(w.attributes('data-hn-select-trigger')).toBe('')
    expect(w.attributes('role')).toBe('combobox')
    expect(w.attributes('aria-label')).toBe('类型')
    expect(w.element.parentElement!.classList.contains('hn-field')).toBe(true)
    expect(w.classes()).toContain('group/hn-disclosure')
    expect(w.element.parentElement!.className).toContain('control-h-md')
  })

  it('无值时显示占位并标 data-placeholder，默认占位来自语言包；有值时显示选项文字', async () => {
    const w = mount(Select, { props: { options } })
    expect(triggerOf(w).text()).toBe('请选择')
    expect(triggerOf(w).attributes('data-placeholder')).toBe('')
    await w.setProps({ placeholder: '选择类型' })
    expect(triggerOf(w).text()).toBe('选择类型')
    await w.setProps({ modelValue: 'ln' })
    expect(triggerOf(w).text()).toBe('轻小说')
    expect(triggerOf(w).attributes('data-placeholder')).toBeUndefined()
  })

  it('value 插槽定制触发器里的内容', () => {
    const w = mount(Select, {
      props: { options, modelValue: 'gal' },
      slots: { value: ({ option }: { option: { label: string } }) => `已选：${option.label}` },
    })
    expect(triggerOf(w).text()).toBe('已选：Galgame')
  })

  it('双形态与档位类与 Input 同源', () => {
    expect(mount(Select, { props: { options } }).find('[data-hn-select]').classes()).toContain(
      '[--hn-field-shadow:var(--hn-shadow-sm)]',
    )
    expect(
      mount(Select, { props: { options, variant: 'secondary' } })
        .find('[data-hn-select]')
        .classes(),
    ).toContain('border-transparent')
    expect(
      mount(Select, { props: { options, size: 'lg' } })
        .find('[data-hn-select]')
        .classes()
        .join(' '),
    ).toContain('control-h-lg')
  })

  it('invalid 落 data-invalid 与 aria-invalid；disabled 禁用触发器', () => {
    const invalid = triggerOf(mount(Select, { props: { options, invalid: true } }))
    expect(invalid.element.parentElement!.hasAttribute('data-invalid')).toBe(true)
    expect(invalid.attributes('aria-invalid')).toBe('true')
    const disabled = triggerOf(mount(Select, { props: { options, disabled: true } }))
    expect((disabled.element as HTMLButtonElement).disabled).toBe(true)
  })

  it('无 a11y 违规', async () => {
    const w = mount(Select, {
      props: { options, modelValue: 'gal' },
      attrs: { 'aria-label': '类型' },
      attachTo: document.body,
    })
    await expectNoA11yViolations(w.element)
  })
})

describe('选项数据', () => {
  it('分组与平铺混排时能拉平，分组判定看 options 字段', () => {
    const items = [
      { value: 'a', label: 'A' },
      { label: '组', options: [{ value: 'b', label: 'B' }] },
    ]
    expect(isOptionGroup(items[1]!)).toBe(true)
    expect(flattenOptions(items).map(o => o.value)).toEqual(['a', 'b'])
  })
})
