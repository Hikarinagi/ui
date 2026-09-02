import { describe, expect, it, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Combobox from './Combobox.vue'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

const options = [
  { value: 'gal', label: 'Galgame' },
  { value: 'ln', label: '轻小说', description: '文库本' },
  { value: 'manga', label: '漫画', disabled: true },
]

const hostOf = (w: ReturnType<typeof mount>) => w.find('[data-hn-combobox]')

describe('输入面', () => {
  it('宿主是输入面容器，内部是 role=combobox 的输入框，attrs 透传到输入框，末尾带展开钮', () => {
    const w = mount(Combobox, { props: { options }, attrs: { 'aria-label': '类型' } })
    const host = hostOf(w)
    expect(host.classes()).toContain('hn-field')
    const input = host.find('input')
    expect(input.attributes('role')).toBe('combobox')
    expect(input.attributes('aria-autocomplete')).toBe('list')
    expect(input.attributes('aria-label')).toBe('类型')
    expect(input.attributes('placeholder')).toBe('输入或选择')
    const toggle = host.find('button')
    expect(toggle.attributes('aria-label')).toBe('展开选项')
    expect(toggle.attributes('tabindex')).toBe('-1')
  })

  it('有值时输入框显示选项文字；placeholder 可覆盖', async () => {
    const w = mount(Combobox, { props: { options, modelValue: 'ln', placeholder: '找作品' } })
    const input = hostOf(w).find('input')
    await vi.waitFor(() => expect((input.element as HTMLInputElement).value).toBe('轻小说'))
    expect(input.attributes('placeholder')).toBe('找作品')
  })

  it('clearable 且有值时出清除钮，点击清空值与搜索词并发出 clear；默认没有', async () => {
    const w = mount(Combobox, {
      props: {
        options,
        modelValue: 'gal',
        clearable: true,
        'onUpdate:modelValue': (v?: string | number | null) => w.setProps({ modelValue: v }),
      },
      global: { stubs: { transition: false } },
    })
    const clear = hostOf(w).find('button[aria-label="清除"]')
    expect(clear.exists()).toBe(true)
    await clear.trigger('click')
    expect(w.props('modelValue')).toBeNull()
    expect(w.emitted('clear')).toHaveLength(1)

    expect(
      hostOf(mount(Combobox, { props: { options, modelValue: 'gal' } }))
        .find('button[aria-label="清除"]')
        .exists(),
    ).toBe(false)
  })

  it('双形态与档位类与 Input 同源；invalid 与 disabled 落到宿主与输入框', () => {
    expect(hostOf(mount(Combobox, { props: { options } })).classes()).toContain(
      '[--hn-field-shadow:var(--hn-shadow-sm)]',
    )
    expect(
      hostOf(mount(Combobox, { props: { options, variant: 'secondary' } })).classes(),
    ).toContain('border-transparent')
    expect(
      hostOf(mount(Combobox, { props: { options, size: 'lg' } }))
        .classes()
        .join(' '),
    ).toContain('control-h-lg')
    const invalid = hostOf(mount(Combobox, { props: { options, invalid: true } }))
    expect(invalid.attributes('data-invalid')).toBe('')
    expect(invalid.find('input').attributes('aria-invalid')).toBe('true')
    const disabled = hostOf(mount(Combobox, { props: { options, disabled: true } }))
    expect((disabled.find('input').element as HTMLInputElement).disabled).toBe(true)
  })

  it('无 a11y 违规', async () => {
    const w = mount(Combobox, {
      props: { options, modelValue: 'gal' },
      attrs: { 'aria-label': '类型' },
      attachTo: document.body,
    })
    await expectNoA11yViolations(w.element)
  })
})
