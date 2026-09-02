import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Textarea from './Textarea.vue'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

describe('渲染与受控', () => {
  it('根是输入面容器，内部是原生 textarea，默认三行，透传 attrs', () => {
    const w = mount(Textarea, { attrs: { placeholder: '写点什么', maxlength: 200 } })
    expect(w.element.tagName).toBe('DIV')
    expect(w.attributes('data-hn-textarea')).toBe('')
    const field = w.find('textarea')
    expect(field.exists()).toBe(true)
    expect(field.attributes('rows')).toBe('3')
    expect(field.attributes('placeholder')).toBe('写点什么')
    expect(field.attributes('maxlength')).toBe('200')
    expect(
      mount(Textarea, { props: { rows: 5 } })
        .find('textarea')
        .attributes('rows'),
    ).toBe('5')
  })

  it('滚动交给 ScrollArea，textarea 自身永不滚动', () => {
    const w = mount(Textarea)
    expect(w.find('[data-overlayscrollbars-initialize]').exists()).toBe(true)
    expect(w.find('textarea').classes()).toContain('overflow-hidden')
    expect(w.find('textarea').classes()).toContain('resize-none')
    expect(w.find('.hn-scroll-shadow').exists()).toBe(false)
  })

  it('v-model 双向绑定', async () => {
    const w = mount(Textarea, {
      props: {
        modelValue: '',
        'onUpdate:modelValue': (v?: string) => w.setProps({ modelValue: v }),
      },
    })
    await w.find('textarea').setValue('星见书音')
    expect(w.props('modelValue')).toBe('星见书音')
  })

  it('双形态与档位类与 Input 同源', () => {
    const primary = mount(Textarea)
    expect(primary.classes()).toContain('hn-field')
    expect(primary.classes()).toContain('[--hn-field-shadow:var(--hn-shadow-sm)]')
    expect(mount(Textarea, { props: { variant: 'secondary' } }).classes()).toContain(
      'border-transparent',
    )
    expect(
      mount(Textarea, { props: { size: 'sm' } })
        .classes()
        .join(' '),
    ).toContain('control-h-sm')
    expect(
      mount(Textarea, { props: { size: 'lg' } })
        .classes()
        .join(' '),
    ).toContain('control-h-lg')
  })

  it('行数经 CSS 变量进入根的高度公式', () => {
    const fixed = mount(Textarea, { props: { rows: 4 } })
    expect(fixed.attributes('style')).toContain('--hn-textarea-rows: 4')
    expect(fixed.attributes('style')).not.toContain('max-rows')
    const auto = mount(Textarea, { props: { autosize: { minRows: 2, maxRows: 6 } } })
    expect(auto.attributes('style')).toContain('--hn-textarea-rows: 2')
    expect(auto.attributes('style')).toContain('--hn-textarea-max-rows: 6')
  })

  it('默认可纵向拉伸；autosize 时关闭拉伸把手并按 minRows 起步', () => {
    expect(mount(Textarea).classes()).toContain('resize-y')
    expect(mount(Textarea, { props: { resize: 'none' } }).classes()).toContain('resize-none')

    const auto = mount(Textarea, { props: { autosize: { minRows: 2, maxRows: 6 } } })
    expect(auto.classes()).toContain('resize-none')
    expect(auto.find('textarea').attributes('rows')).toBe('2')

    const plain = mount(Textarea, { props: { autosize: true, rows: 4 } })
    expect(plain.find('textarea').attributes('rows')).toBe('4')
  })
})

describe('状态语义', () => {
  it('invalid 落根的 data-invalid 与 textarea 的 aria-invalid；disabled 生效', () => {
    const w = mount(Textarea, { props: { invalid: true } })
    expect(w.attributes('data-invalid')).toBe('')
    expect(w.find('textarea').attributes('aria-invalid')).toBe('true')
    expect(mount(Textarea).find('textarea').attributes('aria-invalid')).toBeUndefined()
    expect(
      (
        mount(Textarea, { props: { disabled: true } }).find('textarea')
          .element as HTMLTextAreaElement
      ).disabled,
    ).toBe(true)
  })

  it('无 a11y 违规', async () => {
    const w = mount(Textarea, { attrs: { 'aria-label': '简介' }, attachTo: document.body })
    await expectNoA11yViolations(w.element)
  })
})
