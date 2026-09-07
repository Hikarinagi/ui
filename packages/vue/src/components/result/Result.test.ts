import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import Result from './Result.vue'
import Button from '../button/Button.vue'
import { expectNoA11yViolations } from '../../../test/axe'

describe('Result', () => {
  it('status 决定图标与配色，标题、说明与操作沿用 Empty 的排布', async () => {
    const wrapper = mount(Result, {
      attachTo: document.body,
      props: { status: 'success', title: '书评已发布', description: '其他读者现在可以看到它了。' },
      slots: { actions: () => h(Button, { size: 'sm' }, () => '查看书评') },
    })
    expect(wrapper.attributes('data-hn-result')).toBe('')
    expect(wrapper.attributes('data-status')).toBe('success')
    const icon = wrapper.find('[aria-hidden="true"] span')
    expect(icon.classes()).toContain('bg-success-soft')
    expect(icon.classes()).toContain('size-14')
    expect(icon.find('svg').exists()).toBe(true)
    expect(wrapper.find('p').text()).toBe('书评已发布')
    expect(wrapper.find('button').text()).toBe('查看书评')
    await expectNoA11yViolations(wrapper.element)
    wrapper.unmount()
  })

  it('四种状态各自映射到语义色；默认是 info', () => {
    const classes = (status?: 'success' | 'error' | 'warning' | 'info') =>
      mount(Result, { props: { title: '结果', ...(status ? { status } : {}) } })
        .find('[aria-hidden="true"] span')
        .classes()
    expect(classes()).toContain('bg-info-soft')
    expect(classes('error')).toContain('bg-danger-soft')
    expect(classes('warning')).toContain('bg-warning-soft')
  })

  it('icon 插槽替换状态图标，默认插槽放在文字下方', () => {
    const wrapper = mount(Result, {
      props: { status: 'error', title: '提交失败', size: 'lg' },
      slots: {
        icon: () => h('img', { src: 'x.png', alt: '' }),
        default: () => h('p', { class: 'detail' }, '错误代码 500'),
      },
    })
    expect(wrapper.find('img').exists()).toBe(true)
    expect(wrapper.find('.bg-danger-soft').exists()).toBe(false)
    expect(wrapper.find('.detail').text()).toBe('错误代码 500')
  })
})
