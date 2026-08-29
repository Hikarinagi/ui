import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import Card from './Card.vue'
import Ripple from '../ripple/Ripple.vue'
import VisuallyHidden from '../visually-hidden/VisuallyHidden.vue'

beforeEach(() => {
  document.body.innerHTML = ''
})

describe('Card', () => {
  it('默认是带内边距的静态 div,发丝线 + 最轻阴影', () => {
    const w = mount(Card, { slots: { default: () => '内容' } })
    expect(w.element.tagName).toBe('DIV')
    expect(w.classes()).toContain('border-line')
    expect(w.classes()).toContain('shadow-sm')
    expect(w.classes()).not.toContain('hn-interactive')
  })

  it('padded false 去掉内边距', () => {
    const w = mount(Card, { props: { padded: false } })
    expect(w.classes().join(' ')).not.toContain('p-[')
  })

  it('自身不带任何可点样式,可点视觉由调用方组合公开件', () => {
    const plain = mount(Card)
    expect(plain.classes().join(' ')).not.toMatch(/hn-interactive|hn-state-layer|hover:/)

    const composed = mount(Card, {
      props: { as: 'button', class: 'hn-interactive hn-state-layer hn-press-lg' },
      slots: { default: () => [h(Ripple), '内容'] },
    })
    expect(composed.element.tagName).toBe('BUTTON')
    expect(composed.classes()).toContain('hn-state-layer')
    expect(composed.find('.hn-ripple').exists()).toBe(true)
  })
})

describe('VisuallyHidden', () => {
  it('内容在可访问树里,视觉上被裁剪', () => {
    const w = mount(VisuallyHidden, { slots: { default: () => '仅读屏' }, attachTo: document.body })
    expect(w.text()).toBe('仅读屏')
    const style = (w.element as HTMLElement).style
    expect(style.position).toBe('absolute')
    expect(style.width).toBe('1px')
  })
})
