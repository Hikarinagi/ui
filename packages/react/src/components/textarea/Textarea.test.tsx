import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render } from '@testing-library/react'
import { useState, type ReactNode } from 'react'
import { Textarea } from './Textarea'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(cleanup)

function mount(ui: ReactNode) {
  const element = render(ui).container.firstElementChild as HTMLElement
  return {
    element,
    classes: () => [...element.classList],
    field: () => element.querySelector('textarea') as HTMLTextAreaElement,
  }
}

describe('渲染与受控', () => {
  it('根是输入面容器，内部是原生 textarea，默认三行，透传 attrs', () => {
    const w = mount(<Textarea placeholder="写点什么" maxLength={200} />)
    expect(w.element.tagName).toBe('DIV')
    expect(w.element.getAttribute('data-hn-textarea')).toBe('')
    expect(w.field()).not.toBeNull()
    expect(w.field().getAttribute('rows')).toBe('3')
    expect(w.field().getAttribute('placeholder')).toBe('写点什么')
    expect(w.field().getAttribute('maxlength')).toBe('200')
    expect(
      mount(<Textarea rows={5} />)
        .field()
        .getAttribute('rows'),
    ).toBe('5')
  })

  it('滚动交给 ScrollArea，textarea 自身永不滚动', () => {
    const w = mount(<Textarea />)
    expect(w.element.querySelector('[data-overlayscrollbars-initialize]')).not.toBeNull()
    expect(w.field().classList).toContain('overflow-hidden')
    expect(w.field().classList).toContain('resize-none')
    expect(w.element.querySelector('.hn-scroll-shadow')).toBeNull()
  })

  it('v-model 双向绑定', () => {
    const onModel = vi.fn()
    function Harness() {
      const [value, setValue] = useState('')
      return (
        <Textarea
          value={value}
          onValueChange={next => {
            setValue(next)
            onModel(next)
          }}
        />
      )
    }
    const w = mount(<Harness />)
    fireEvent.change(w.field(), { target: { value: '狼と香辛料' } })
    expect(onModel).toHaveBeenLastCalledWith('狼と香辛料')
  })

  it('双形态与档位类与 Input 同源', () => {
    const primary = mount(<Textarea />)
    expect(primary.classes()).toContain('hn-field')
    expect(primary.classes()).toContain('[--hn-field-shadow:var(--hn-shadow-sm)]')
    expect(mount(<Textarea variant="secondary" />).classes()).toContain('border-transparent')
    expect(
      mount(<Textarea size="sm" />)
        .classes()
        .join(' '),
    ).toContain('control-h-sm')
    expect(
      mount(<Textarea size="lg" />)
        .classes()
        .join(' '),
    ).toContain('control-h-lg')
  })

  it('行数经 CSS 变量进入根的高度公式', () => {
    const fixed = mount(<Textarea rows={4} />)
    expect(fixed.element.getAttribute('style')).toContain('--hn-textarea-rows: 4')
    expect(fixed.element.getAttribute('style')).not.toContain('max-rows')
    const auto = mount(<Textarea autosize={{ minRows: 2, maxRows: 6 }} />)
    expect(auto.element.getAttribute('style')).toContain('--hn-textarea-rows: 2')
    expect(auto.element.getAttribute('style')).toContain('--hn-textarea-max-rows: 6')
  })

  it('默认可纵向拉伸；autosize 时关闭拉伸把手并按 minRows 起步', () => {
    expect(mount(<Textarea />).classes()).toContain('resize-y')
    expect(mount(<Textarea resize="none" />).classes()).toContain('resize-none')

    const auto = mount(<Textarea autosize={{ minRows: 2, maxRows: 6 }} />)
    expect(auto.classes()).toContain('resize-none')
    expect(auto.field().getAttribute('rows')).toBe('2')

    const plain = mount(<Textarea autosize rows={4} />)
    expect(plain.field().getAttribute('rows')).toBe('4')
  })
})

describe('状态语义', () => {
  it('invalid 落根的 data-invalid 与 textarea 的 aria-invalid；disabled 生效', () => {
    const w = mount(<Textarea invalid />)
    expect(w.element.getAttribute('data-invalid')).toBe('')
    expect(w.field().getAttribute('aria-invalid')).toBe('true')
    expect(
      mount(<Textarea />)
        .field()
        .getAttribute('aria-invalid'),
    ).toBeNull()
    expect(mount(<Textarea disabled />).field().disabled).toBe(true)
  })

  it('无 a11y 违规', async () => {
    const w = mount(<Textarea aria-label="简介" />)
    await expectNoA11yViolations(w.element)
  })
})
