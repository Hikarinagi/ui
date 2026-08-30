import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import Callout from './Callout.vue'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

describe('结构与语义', () => {
  it('role=note 静态标注;标题与正文都在可达文本里', () => {
    const w = mount(Callout, {
      props: { title: '备注' },
      slots: { default: () => '正文内容。' },
      attachTo: document.body,
    })
    expect(w.attributes('role')).toBe('note')
    expect(w.text()).toContain('备注')
    expect(w.text()).toContain('正文内容。')
    expect(w.find('svg').attributes('aria-hidden')).toBe('true')
  })

  it('icon=false 收起图标;#icon 槽整体替换默认图标', () => {
    const off = mount(Callout, { props: { icon: false }, slots: { default: () => '文' } })
    expect(off.find('svg').exists()).toBe(false)

    const custom = mount(Callout, {
      slots: { default: () => '文', icon: () => h('span', { 'data-probe': '' }, '☆') },
    })
    expect(custom.find('svg').exists()).toBe(false)
    expect(custom.find('[data-probe]').exists()).toBe(true)
  })

  it('无障碍:各 tone 含标题正文均零违例', async () => {
    for (const tone of ['neutral', 'accent', 'info', 'success', 'warning', 'danger'] as const) {
      const w = mount(Callout, {
        props: { tone, title: '标题' },
        slots: { default: () => '正文。' },
        attachTo: document.body,
      })
      await expectNoA11yViolations(w.element)
      w.unmount()
    }
  })
})
