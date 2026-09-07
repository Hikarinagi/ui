import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import Banner from './Banner.vue'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

const body = { default: () => '新版本已发布。' }

describe('Banner', () => {
  it('默认 accent 实底、带图标、无实时区域角色；icon 可关、actions 插槽渲染', () => {
    const w = mount(Banner, { slots: body })
    const bar = w.find('[data-tone]')
    expect(bar.attributes('data-tone')).toBe('accent')
    expect(bar.classes()).toContain('bg-accent')
    expect(bar.classes()).toContain('text-accent-on')
    expect(bar.attributes('role')).toBeUndefined()
    expect(bar.find('svg').exists()).toBe(true)
    expect(w.text()).toContain('新版本已发布。')

    const plain = mount(Banner, {
      props: { tone: 'warning', icon: false },
      slots: { ...body, actions: () => h('button', { type: 'button' }, '延长') },
    })
    expect(plain.find('[data-tone]').classes()).toContain('bg-warning')
    expect(plain.find('svg').exists()).toBe(false)
    expect(plain.find('button').text()).toBe('延长')
  })

  it('closable 渲染关闭钮，点击后关闭、触发 close 并回写 open；open 为 false 时不渲染', async () => {
    const w = mount(Banner, { props: { closable: true }, slots: body })
    const close = w.find('button')
    expect(close.attributes('aria-label')).toBe('关闭')
    await close.trigger('click')
    expect(w.emitted('close')).toHaveLength(1)
    expect(w.emitted('update:open')?.[0]).toEqual([false])
    expect(w.find('[data-tone]').exists()).toBe(false)

    const closed = mount(Banner, { props: { open: false }, slots: body })
    expect(closed.find('[data-tone]').exists()).toBe(false)
    await closed.setProps({ open: true })
    expect(closed.find('[data-tone]').exists()).toBe(true)
  })

  it('无障碍零违例', async () => {
    const w = mount(Banner, {
      props: { tone: 'info', closable: true },
      slots: { ...body, actions: () => h('button', { type: 'button' }, '查看') },
      attachTo: document.body,
    })
    await expectNoA11yViolations(w.element)
  })
})
