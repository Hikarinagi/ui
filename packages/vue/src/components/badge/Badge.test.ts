import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import Badge from './Badge.vue'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

function host() {
  return h('span', { style: 'display:inline-block;width:40px;height:40px' }, '宿主')
}

describe('结构与语义', () => {
  it('数字徽标钉在宿主上;超过 max 显示 99+', () => {
    const w = mount(Badge, { props: { content: 5 }, slots: { default: host } })
    expect(w.text()).toContain('宿主')
    expect(w.text()).toContain('5')

    const capped = mount(Badge, { props: { content: 120 }, slots: { default: host } })
    expect(capped.text()).toContain('99+')

    const custom = mount(Badge, { props: { content: 120, max: 999 }, slots: { default: host } })
    expect(custom.text()).toContain('120')
  })

  it('content 为 0 / 空 / 缺省时不渲染徽标,宿主照常', () => {
    for (const content of [0, '', undefined, null] as const) {
      const w = mount(Badge, { props: { content }, slots: { default: host } })
      expect(w.text()).toBe('宿主')
      expect(w.findAll('span').length).toBe(2)
    }
  })

  it('label 走视觉隐藏给读屏语境;#content 槽可放自定义内容', () => {
    const w = mount(Badge, {
      props: { content: 3, label: '3 条未读通知' },
      slots: { default: host },
    })
    expect(w.text()).toContain('3 条未读通知')

    const dot = mount(Badge, {
      props: { content: 1 },
      slots: { default: host, content: () => h('i', { 'data-probe': '' }) },
    })
    expect(dot.find('[data-probe]').exists()).toBe(true)
    expect(dot.text()).not.toContain('1')
  })

  it('无障碍零违例', async () => {
    const w = mount(Badge, {
      props: { content: 8, label: '8 条未读' },
      slots: { default: () => h('button', { type: 'button' }, '通知') },
      attachTo: document.body,
    })
    await expectNoA11yViolations(w.element)
  })
})
