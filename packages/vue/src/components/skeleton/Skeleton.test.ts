import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import Skeleton from './Skeleton.vue'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

describe('加载与就绪', () => {
  it('loading 为真时包一层骨架', () => {
    const w = mount(Skeleton, { slots: { default: () => h('p', '正文') } })
    expect(w.classes()).toContain('hn-skeleton')
    expect(w.text()).toBe('正文')
  })

  it('loading 为假时只渲染内容,不留包裹元素', () => {
    const w = mount(Skeleton, {
      props: { loading: false },
      slots: { default: () => h('p', '正文') },
    })
    expect(w.html()).toBe('<p>正文</p>')
  })

  it('没有内容时也能作为独立占位', () => {
    const w = mount(Skeleton, { props: { class: 'h-4 w-32' } })
    expect(w.classes()).toContain('hn-skeleton')
    expect(w.classes()).toContain('h-4')
  })

  it('as 换语义标签', () => {
    expect(mount(Skeleton, { props: { as: 'div' } }).element.tagName).toBe('DIV')
  })
})

describe('a11y', () => {
  it('骨架对辅助技术隐藏,且不可聚焦', () => {
    const w = mount(Skeleton, { slots: { default: () => h('p', '正文') } })
    expect(w.attributes('aria-hidden')).toBe('true')
    expect(w.attributes('tabindex')).toBe('-1')
    expect(w.attributes('inert')).toBeDefined()
  })

  it('就绪后不再有 aria-hidden', () => {
    const w = mount(Skeleton, {
      props: { loading: false },
      slots: { default: () => h('p', '正文') },
    })
    expect(w.attributes('aria-hidden')).toBeUndefined()
  })

  it('无 a11y 违规', async () => {
    const w = mount(Skeleton, {
      slots: { default: () => h('p', '正文') },
      attachTo: document.body,
    })
    await expectNoA11yViolations(w.element as HTMLElement)
  })
})
