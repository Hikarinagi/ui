import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import Alert from './Alert.vue'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

const body = { default: () => '已保存到草稿箱。' }

describe('结构与语义', () => {
  it('默认 status 角色、带图标；danger 与 warning 升为 alert', () => {
    const w = mount(Alert, { slots: body })
    const region = w.find('[role]')
    expect(region.attributes('role')).toBe('status')
    expect(region.find('svg').exists()).toBe(true)
    expect(w.text()).toContain('已保存到草稿箱。')

    expect(
      mount(Alert, { props: { tone: 'danger' }, slots: body })
        .find('[role]')
        .attributes('role'),
    ).toBe('alert')
    expect(
      mount(Alert, { props: { tone: 'warning' }, slots: body })
        .find('[role]')
        .attributes('role'),
    ).toBe('alert')
    expect(
      mount(Alert, { props: { tone: 'success' }, slots: body })
        .find('[role]')
        .attributes('role'),
    ).toBe('status')
  })

  it('title 渲染在正文前；icon 可关；actions 插槽渲染', () => {
    const w = mount(Alert, {
      props: { title: '草稿已保存', icon: false },
      slots: { ...body, actions: () => h('button', { type: 'button' }, '查看') },
    })
    expect(w.find('p').text()).toBe('草稿已保存')
    expect(w.find('svg').exists()).toBe(false)
    expect(w.find('button').text()).toBe('查看')
  })

  it('closable 渲染关闭钮，点击后关闭、触发 close 并回写 open', async () => {
    const w = mount(Alert, { props: { closable: true }, slots: body })
    const close = w.find('button')
    expect(close.attributes('aria-label')).toBe('关闭')

    await close.trigger('click')
    expect(w.emitted('close')).toHaveLength(1)
    expect(w.emitted('update:open')?.[0]).toEqual([false])
    expect(w.find('[role]').exists()).toBe(false)
  })

  it('open 为 false 时不渲染，改回 true 后出现', async () => {
    const w = mount(Alert, { props: { open: false }, slots: body })
    expect(w.find('[role]').exists()).toBe(false)
    await w.setProps({ open: true })
    expect(w.find('[role]').exists()).toBe(true)
  })

  it('无障碍零违例', async () => {
    const w = mount(Alert, {
      props: { tone: 'danger', title: '发布失败', closable: true },
      slots: { ...body, actions: () => h('button', { type: 'button' }, '重试') },
      attachTo: document.body,
    })
    await expectNoA11yViolations(w.element)
  })
})
