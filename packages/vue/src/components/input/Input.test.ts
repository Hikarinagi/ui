import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { Mail } from '@lucide/vue'
import Input from './Input.vue'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

const stubs = { Transition: false }

describe('渲染与受控', () => {
  it('根是输入面容器，内部是原生 input，attrs 透传到 input', () => {
    const w = mount(Input, { attrs: { placeholder: '邮箱', type: 'email' } })
    expect(w.element.tagName).toBe('DIV')
    expect(w.attributes('data-hn-input')).toBe('')
    const input = w.find('input')
    expect(input.attributes('placeholder')).toBe('邮箱')
    expect(input.attributes('type')).toBe('email')
  })

  it('v-model 双向绑定', async () => {
    const w = mount(Input, {
      props: {
        modelValue: '',
        'onUpdate:modelValue': (v?: string) => w.setProps({ modelValue: v }),
      },
    })
    await w.find('input').setValue('hina')
    expect(w.props('modelValue')).toBe('hina')
  })

  it('双形态:primary 是带 surface 阴影的 surface 件,secondary 是扁平件', () => {
    const primary = mount(Input)
    expect(primary.classes()).toContain('hn-field')
    expect(primary.classes()).toContain('[--hn-field-shadow:var(--hn-shadow-sm)]')
    expect(primary.classes()).toContain('border-line')

    const secondary = mount(Input, { props: { variant: 'secondary' } })
    expect(secondary.classes()).toContain('border-transparent')
    expect(secondary.classes()).not.toContain('[--hn-field-shadow:var(--hn-shadow-sm)]')
  })

  it('size 档位切换高度类', () => {
    expect(
      mount(Input, { props: { size: 'sm' } })
        .classes()
        .join(' '),
    ).toContain('control-h-sm')
    expect(mount(Input).classes().join(' ')).toContain('control-h-md')
    expect(
      mount(Input, { props: { size: 'lg' } })
        .classes()
        .join(' '),
    ).toContain('control-h-lg')
  })
})

describe('附属件', () => {
  it('leading / trailing 插槽各占一格，对应侧的输入区内边距归零', () => {
    const w = mount(Input, {
      slots: { leading: () => h(Mail), trailing: () => 'kg' },
    })
    const boxes = w.findAll('[data-hn-input] > span')
    expect(boxes).toHaveLength(2)
    expect(boxes[0]!.find('svg').exists()).toBe(true)
    expect(boxes[1]!.text()).toBe('kg')
    expect(w.find('input').classes()).toContain('ps-0')
    expect(w.find('input').classes()).toContain('pe-0')

    const bare = mount(Input)
    expect(bare.findAll('[data-hn-input] > span')).toHaveLength(0)
    expect(bare.find('input').classes()).not.toContain('ps-0')
  })

  it('clearable 在有值且未禁用时出清除钮，点击清空并发出 clear', async () => {
    const w = mount(Input, {
      props: {
        clearable: true,
        modelValue: '',
        'onUpdate:modelValue': (v?: string) => w.setProps({ modelValue: v }),
      },
      global: { stubs },
    })
    expect(w.find('button').exists()).toBe(false)
    await w.setProps({ modelValue: '星见' })
    expect(w.find('button').attributes('aria-label')).toBe('清除')
    await w.find('button').trigger('click')
    expect(w.props('modelValue')).toBe('')
    expect(w.emitted('clear')).toHaveLength(1)

    const disabled = mount(Input, {
      props: { clearable: true, modelValue: '星见', disabled: true },
    })
    expect(disabled.find('button').exists()).toBe(false)
  })

  it('loading 有 leading 时顶替其中的图标，否则挂在末尾；根带 aria-busy', () => {
    const swapped = mount(Input, {
      props: { loading: true },
      slots: { leading: () => h(Mail) },
      global: { stubs },
    })
    expect(swapped.attributes('aria-busy')).toBe('true')
    const boxes = swapped.findAll('[data-hn-input] > span')
    expect(boxes).toHaveLength(1)
    expect(boxes[0]!.find('[role="status"]').exists()).toBe(true)

    const trailing = mount(Input, { props: { loading: true }, global: { stubs } })
    const tail = trailing.findAll('[data-hn-input] > span')
    expect(tail).toHaveLength(1)
    expect(tail[0]!.find('[role="status"]').exists()).toBe(true)
    expect(trailing.find('input').classes()).toContain('pe-0')
  })
})

describe('状态语义', () => {
  it('invalid 落根的 data-invalid 与 input 的 aria-invalid', () => {
    const w = mount(Input, { props: { invalid: true } })
    expect(w.attributes('data-invalid')).toBe('')
    expect(w.find('input').attributes('aria-invalid')).toBe('true')

    const ok = mount(Input)
    expect(ok.attributes('data-invalid')).toBeUndefined()
    expect(ok.find('input').attributes('aria-invalid')).toBeUndefined()
  })

  it('disabled 生效且不可输入', () => {
    const w = mount(Input, { props: { disabled: true } })
    expect((w.find('input').element as HTMLInputElement).disabled).toBe(true)
  })

  it('无 a11y 违规', async () => {
    const w = mount(Input, {
      props: { clearable: true, modelValue: '星见' },
      attrs: { 'aria-label': '邮箱' },
      slots: { leading: () => h(Mail) },
      attachTo: document.body,
    })
    await expectNoA11yViolations(w.element)
  })
})
