import { describe, expect, it, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import Button from './Button.vue'
import { resetDevWarnings } from '../../lib/dev'
import { expectNoA11yViolations } from '../../../test/axe'

const attachTo = () => document.body

beforeEach(() => {
  resetDevWarnings()
  document.body.innerHTML = ''
})

describe('渲染与变体', () => {
  it('默认渲染原生 button 且 type 为 button', () => {
    const w = mount(Button, { slots: { default: () => '确定' } })
    expect(w.element.tagName).toBe('BUTTON')
    expect(w.attributes('type')).toBe('button')
  })

  it('type 可透传,能做表单提交按钮', () => {
    const w = mount(Button, { props: { type: 'submit' } })
    expect(w.attributes('type')).toBe('submit')
  })

  it('variant 与 tone 组合出对应的 surface 类,箱式变体共用状态层', () => {
    const solid = mount(Button, { props: { variant: 'solid', tone: 'danger' } })
    expect(solid.classes()).toContain('bg-danger')
    expect(solid.classes()).toContain('hn-state-layer')

    const ghost = mount(Button, { props: { variant: 'ghost', tone: 'neutral' } })
    expect(ghost.classes()).toContain('hn-state-layer')
    expect(ghost.classes()).not.toContain('bg-danger')
  })

  it('link 变体是 prose surface:下划线通道,无墨、无波纹、无缩放', () => {
    const link = mount(Button, { props: { variant: 'link' } })
    expect(link.classes()).toContain('hn-link')
    expect(link.classes()).toContain('hn-press-none')
    expect(link.classes()).not.toContain('hn-state-layer')
    expect(link.find('.hn-ripple').exists()).toBe(false)
  })

  it('pill 得到全圆角,配 iconOnly 成正圆', () => {
    const pill = mount(Button, { props: { pill: true } })
    expect(pill.classes()).toContain('rounded-full')
    expect(pill.classes()).not.toContain('rounded-md')

    const circle = mount(Button, {
      props: { pill: true, iconOnly: true, 'aria-label': '新建' },
    })
    expect(circle.classes()).toContain('rounded-full')
    expect(circle.classes()).toContain('aspect-square')
  })

  it('每个可交互按钮都带 hn-interactive', () => {
    const w = mount(Button)
    expect(w.classes()).toContain('hn-interactive')
  })

  it('波纹默认开启,ripple false 时整个子树消失', () => {
    const on = mount(Button, { props: { variant: 'solid', tone: 'accent' } })
    expect(on.find('.hn-ripple').exists()).toBe(true)

    const off = mount(Button, { props: { variant: 'solid', tone: 'accent', ripple: false } })
    expect(off.find('.hn-ripple').exists()).toBe(false)
  })

  it('波纹容器对辅助技术隐藏', () => {
    const w = mount(Button)
    expect(w.find('.hn-ripple').attributes('aria-hidden')).toBe('true')
  })
})

describe('loading 与图标交接', () => {
  it('loading 时置 aria-busy 并禁用', () => {
    const w = mount(Button, { props: { loading: true } })
    expect(w.attributes('aria-busy')).toBe('true')
    expect(w.attributes('disabled')).toBeDefined()
  })

  it('无图标位时 spinner 居中覆盖,正文淡出', () => {
    const w = mount(Button, { props: { loading: true }, slots: { default: () => '保存' } })
    expect(w.findComponent({ name: 'HnSpinner' }).exists()).toBe(true)
    expect(w.find('.opacity-0').exists()).toBe(true)
  })

  it('有 #icon 时 spinner 顶掉前置图标,正文不淡出', () => {
    const w = mount(Button, {
      props: { loading: true },
      slots: { icon: () => h('svg'), default: () => '保存' },
    })
    const content = w.findAll('span').find(s => s.text() === '保存')
    expect(content?.classes()).toContain('opacity-100')
  })

  it('两侧都有图标时,后置图标保持显示', () => {
    const w = mount(Button, {
      props: { loading: true },
      slots: {
        icon: () => h('svg', { 'data-t': 'lead' }),
        trailing: () => h('svg', { 'data-t': 'trail' }),
      },
    })
    const trailingBox = w.get('[data-t="trail"]').element.parentElement
    expect(trailingBox?.className).toContain('opacity-100')
  })
})

describe('禁用语义', () => {
  it('原生 button 用 disabled 属性', () => {
    const w = mount(Button, { props: { disabled: true } })
    expect(w.attributes('disabled')).toBeDefined()
    expect(w.attributes('aria-disabled')).toBeUndefined()
  })

  it('as="a" 时改用 aria-disabled 并移出 tab 序列', () => {
    const w = mount(Button, { props: { as: 'a', disabled: true, href: '#' } })
    expect(w.attributes('aria-disabled')).toBe('true')
    expect(w.attributes('tabindex')).toBe('-1')
  })

  it('as="a" 且禁用时点击被拦截', async () => {
    const onClick = vi.fn()
    const w = mount(Button, {
      props: { as: 'a', disabled: true, href: '#', onClick },
      attachTo: attachTo(),
    })
    await w.trigger('click')
    expect(onClick).not.toHaveBeenCalled()
  })

  it('未禁用时点击正常触发', async () => {
    const onClick = vi.fn()
    const w = mount(Button, { props: { onClick }, attachTo: attachTo() })
    await w.trigger('click')
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})

describe('开发期 a11y 告警', () => {
  it('iconOnly 缺可访问名时告警', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    mount(Button, { props: { iconOnly: true }, slots: { default: () => h('svg') } })
    expect(warn).toHaveBeenCalledOnce()
    expect(warn.mock.calls[0]?.[0]).toContain('可访问名称')
    warn.mockRestore()
  })

  it('提供 aria-label 后不告警', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    mount(Button, {
      props: { iconOnly: true },
      attrs: { 'aria-label': '更多' },
      slots: { default: () => h('svg') },
    })
    expect(warn).not.toHaveBeenCalled()
    warn.mockRestore()
  })

  it('同一类告警只报一次,不刷屏', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    for (let i = 0; i < 5; i++) mount(Button, { props: { iconOnly: true } })
    expect(warn).toHaveBeenCalledOnce()
    warn.mockRestore()
  })
})

describe('a11y 断言', () => {
  it('常规按钮无 axe 违规', async () => {
    const w = mount(Button, { slots: { default: () => '提交' }, attachTo: attachTo() })
    await expectNoA11yViolations(w.element)
  })

  it('图标按钮带 aria-label 后无 axe 违规', async () => {
    const w = mount(Button, {
      props: { iconOnly: true },
      attrs: { 'aria-label': '关闭' },
      slots: { default: () => h('svg') },
      attachTo: attachTo(),
    })
    await expectNoA11yViolations(w.element)
  })

  it('loading 按钮无 axe 违规', async () => {
    const w = mount(Button, {
      props: { loading: true },
      slots: { icon: () => h('svg'), default: () => '保存中' },
      attachTo: attachTo(),
    })
    await expectNoA11yViolations(w.element)
  })
})
