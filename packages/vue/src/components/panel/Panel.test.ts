import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import Panel from './Panel.vue'
import Button from '../button/Button.vue'
import { expectNoA11yViolations } from '../../../test/axe'

describe('Panel', () => {
  it('标题是二级标题，正文带面板内边距', async () => {
    const wrapper = mount(Panel, {
      attachTo: document.body,
      props: { title: '最近活动', description: '过去七天' },
      slots: { default: () => h('p', '正文') },
    })
    const heading = wrapper.find('h2')
    expect(heading.text()).toBe('最近活动')
    expect(wrapper.text()).toContain('过去七天')
    const body = wrapper.find('[data-hn-panel] > div:last-child')
    expect(body.classes()).toContain('px-(--hn-panel-p)')
    expect(body.classes()).toContain('pb-(--hn-panel-p)')
    await expectNoA11yViolations(wrapper.element)
    wrapper.unmount()
  })

  it('level 改变标题层级；count 渲染为计数；actions 放在标题行末尾', () => {
    const wrapper = mount(Panel, {
      props: { title: '评论', level: 3, count: 12 },
      slots: {
        actions: () => h(Button, { size: 'sm' }, () => '全部'),
        icon: () => h('svg'),
      },
    })
    expect(wrapper.find('h3').text()).toBe('评论')
    expect(wrapper.text()).toContain('12')
    expect(wrapper.find('button').text()).toBe('全部')
    expect(wrapper.find('[aria-hidden="true"] svg').exists()).toBe(true)
  })

  it('padded 为 false 时正文只留顶部间距，没有正文则不渲染正文层', () => {
    const wrapper = mount(Panel, {
      props: { title: '列表', padded: false },
      slots: { default: () => h('ul') },
    })
    const body = wrapper.find('[data-hn-panel] > div:last-child')
    expect(body.classes()).toContain('pt-4')
    expect(body.classes()).not.toContain('px-(--hn-panel-p)')

    const empty = mount(Panel, { props: { title: '空面板' } })
    expect(empty.findAll('[data-hn-panel] > div')).toHaveLength(1)
  })
})
