import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import LineClamp from './LineClamp.vue'

const content = (props: Record<string, unknown> = {}) =>
  mount(LineClamp, { props, slots: { default: () => '简介' } }).element
    .firstElementChild as HTMLElement

const lines = (element: HTMLElement) => element.style.getPropertyValue('--hn-line-clamp')

describe('LineClamp', () => {
  it('渲染插槽内容,默认折叠到 3 行,class 追加到根元素', () => {
    const w = mount(LineClamp, { props: { class: 'max-w-md' }, slots: { default: () => '简介' } })
    expect(w.classes()).toContain('max-w-md')
    const inner = w.element.firstElementChild as HTMLElement
    expect(inner.textContent).toBe('简介')
    expect(lines(inner)).toBe('3')
    expect(inner.classList.contains('line-clamp-(--hn-line-clamp)')).toBe(true)
    expect(inner.hasAttribute('data-expanded')).toBe(false)
  })

  it('lines 向下取整且不小于 1,非法值回退到 3', () => {
    expect(lines(content({ lines: 5 }))).toBe('5')
    expect(lines(content({ lines: 2.8 }))).toBe('2')
    expect(lines(content({ lines: 0 }))).toBe('1')
    expect(lines(content({ lines: Number.NaN }))).toBe('3')
  })

  it('展开时去掉折叠类并标出 data-expanded', () => {
    const inner = content({ expanded: true })
    expect(inner.classList.contains('line-clamp-(--hn-line-clamp)')).toBe(false)
    expect(inner.getAttribute('data-expanded')).toBe('')
  })

  it('量不到溢出时不渲染按钮', () => {
    const w = mount(LineClamp, { slots: { default: () => '简介' } })
    expect(w.find('button').exists()).toBe(false)
  })
})
