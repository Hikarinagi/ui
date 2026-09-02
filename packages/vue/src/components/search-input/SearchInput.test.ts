import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SearchInput from './SearchInput.vue'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

const stubs = { Transition: false }

describe('渲染与受控', () => {
  it('根是输入面容器，前置搜索图标，内部是 search 输入框，attrs 透传到输入框', () => {
    const w = mount(SearchInput, { attrs: { placeholder: '搜索作品', autocomplete: 'off' } })
    expect(w.attributes('data-hn-input')).toBe('')
    expect(w.classes()).toContain('hn-field')
    expect(w.find('svg').exists()).toBe(true)
    const input = w.find('input')
    expect(input.attributes('type')).toBe('search')
    expect(input.attributes('enterkeyhint')).toBe('search')
    expect(input.attributes('placeholder')).toBe('搜索作品')
    expect(input.attributes('autocomplete')).toBe('off')
  })

  it('v-model 双向绑定；空值时没有清除钮，有值后出现', async () => {
    const w = mount(SearchInput, {
      props: {
        modelValue: '',
        'onUpdate:modelValue': (v: string) => w.setProps({ modelValue: v }),
      },
      global: { stubs },
    })
    expect(w.find('button').exists()).toBe(false)
    await w.find('input').setValue('星见')
    expect(w.props('modelValue')).toBe('星见')
    expect(w.find('button').attributes('aria-label')).toBe('清除')
  })

  it('清除钮清空值并发出 clear；clearable 关闭后不渲染', async () => {
    const w = mount(SearchInput, {
      props: {
        modelValue: '星见',
        'onUpdate:modelValue': (v: string) => w.setProps({ modelValue: v }),
      },
      global: { stubs },
    })
    await w.find('button').trigger('click')
    expect(w.props('modelValue')).toBe('')
    expect(w.emitted('clear')).toHaveLength(1)

    const fixed = mount(SearchInput, { props: { modelValue: '星见', clearable: false } })
    expect(fixed.find('button').exists()).toBe(false)
  })

  it('Enter 发出 search 并带当前值；Esc 清空', async () => {
    const w = mount(SearchInput, {
      props: {
        modelValue: '星见',
        'onUpdate:modelValue': (v: string) => w.setProps({ modelValue: v }),
      },
    })
    await w.find('input').trigger('keydown', { key: 'Enter' })
    expect(w.emitted('search')).toEqual([['星见']])
    await w.find('input').trigger('keydown', { key: 'Escape' })
    expect(w.props('modelValue')).toBe('')
    expect(w.emitted('clear')).toHaveLength(1)
  })

  it('loading 时前置图标换成加载环，根带 aria-busy', () => {
    const w = mount(SearchInput, { props: { loading: true }, global: { stubs } })
    expect(w.attributes('aria-busy')).toBe('true')
    expect(w.find('[role="status"]').exists()).toBe(true)
    expect(mount(SearchInput).find('[role="status"]').exists()).toBe(false)
  })

  it('双形态与档位类与 Input 同源', () => {
    expect(mount(SearchInput).classes()).toContain('[--hn-field-shadow:var(--hn-shadow-sm)]')
    expect(mount(SearchInput, { props: { variant: 'secondary' } }).classes()).toContain(
      'border-transparent',
    )
    expect(
      mount(SearchInput, { props: { size: 'sm' } })
        .classes()
        .join(' '),
    ).toContain('control-h-sm')
  })
})

describe('状态语义', () => {
  it('disabled 禁用输入框并隐藏清除钮', () => {
    const w = mount(SearchInput, { props: { modelValue: '星见', disabled: true } })
    expect((w.find('input').element as HTMLInputElement).disabled).toBe(true)
    expect(w.find('button').exists()).toBe(false)
  })

  it('无 a11y 违规', async () => {
    const w = mount(SearchInput, {
      props: { modelValue: '星见' },
      attrs: { 'aria-label': '搜索' },
      attachTo: document.body,
    })
    await expectNoA11yViolations(w.element)
  })
})
