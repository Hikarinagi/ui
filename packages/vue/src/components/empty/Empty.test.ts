import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import Empty from './Empty.vue'
import Button from '../button/Button.vue'
import { expectNoA11yViolations } from '../../../test/axe'

describe('Empty', () => {
  it('默认带图标，标题与说明居中，操作放在最下方', async () => {
    const wrapper = mount(Empty, {
      attachTo: document.body,
      props: { title: '还没有书评', description: '读完一本书后来写第一篇。' },
      slots: { actions: () => h(Button, { size: 'sm' }, () => '写书评') },
    })
    const icon = wrapper.find('[aria-hidden="true"]')
    expect(icon.find('svg').exists()).toBe(true)
    expect(icon.classes()).toContain('size-12')
    expect(wrapper.find('p').text()).toBe('还没有书评')
    expect(wrapper.text()).toContain('读完一本书后来写第一篇。')
    expect(wrapper.find('button').text()).toBe('写书评')
    await expectNoA11yViolations(wrapper.element)
    wrapper.unmount()
  })

  it('icon 插槽替换默认图标且不套圆底；icon 为 false 时不渲染图标', () => {
    const custom = mount(Empty, {
      props: { title: '没有结果' },
      slots: { icon: () => h('img', { src: 'x.png', alt: '' }) },
    })
    expect(custom.find('img').exists()).toBe(true)
    expect(custom.find('.size-12').exists()).toBe(false)

    const bare = mount(Empty, { props: { title: '没有结果', icon: false } })
    expect(bare.find('[aria-hidden="true"]').exists()).toBe(false)
  })

  it('size 同时改变图标、标题与内边距', () => {
    const wrapper = mount(Empty, { props: { title: '空', size: 'lg' } })
    expect(wrapper.classes()).toContain('py-14')
    expect(wrapper.find('[aria-hidden="true"]').classes()).toContain('size-14')
    expect(wrapper.find('p').classes()).toContain('text-lg')
  })
})
