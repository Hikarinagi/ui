import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import DisclosureIcon from './DisclosureIcon.vue'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

describe('渲染', () => {
  it('默认渲染向下的图标,direction=end 渲染向行末的图标', () => {
    expect(mount(DisclosureIcon).find('svg').exists()).toBe(true)
    const down = mount(DisclosureIcon).html()
    const end = mount(DisclosureIcon, { props: { direction: 'end' } }).html()
    expect(down).not.toBe(end)
  })

  it('恒为 aria-hidden —— 状态由触发器的 aria-expanded 播报,不重复', () => {
    expect(mount(DisclosureIcon).attributes('aria-hidden')).toBe('true')
    expect(mount(DisclosureIcon, { props: { open: true } }).attributes('aria-hidden')).toBe('true')
  })

  it('插槽替换图标,旋转仍挂在外层不丢', () => {
    const w = mount(DisclosureIcon, {
      props: { open: true },
      slots: { default: () => h('i', { class: 'custom-mark' }) },
    })
    expect(w.find('.custom-mark').exists()).toBe(true)
    expect(w.find('svg').exists()).toBe(false)
    expect(w.classes()).toContain('rotate-180')
  })

  it('class 追加至根元素', () => {
    expect(mount(DisclosureIcon, { props: { class: 'text-muted' } }).classes()).toContain(
      'text-muted',
    )
  })
})

describe('状态来源', () => {
  it('不传 open 时走 CSS,挂具名 group 变体类,不带静态旋转', () => {
    const down = mount(DisclosureIcon).classes()
    expect(down).toContain('group-data-open/hn-disclosure:rotate-180')
    expect(down).not.toContain('rotate-180')

    const end = mount(DisclosureIcon, { props: { direction: 'end' } }).classes()
    expect(end).toContain('group-data-open/hn-disclosure:rotate-90')
    expect(end).not.toContain('rotate-90')
  })

  it('缺省的 open 必须留在 undefined —— Vue 会把可选 boolean 强制转 false,那样三态塌成两态', () => {
    const w = mount(DisclosureIcon)
    expect(w.props('open')).toBeUndefined()
    expect(w.classes().join(' ')).toContain('group-data-open')
  })

  it('传 open 时改用静态旋转,不再依赖祖先', () => {
    const opened = mount(DisclosureIcon, { props: { open: true } }).classes()
    expect(opened).toContain('rotate-180')
    expect(opened.join(' ')).not.toContain('group-data-open')

    const closed = mount(DisclosureIcon, { props: { open: false } }).classes()
    expect(closed).not.toContain('rotate-180')
    expect(closed.join(' ')).not.toContain('group-data-open')
  })

  it('open 与 direction=end 组合为四分之一圈', () => {
    expect(mount(DisclosureIcon, { props: { open: true, direction: 'end' } }).classes()).toContain(
      'rotate-90',
    )
  })

  it('状态变更走 hn-transition,不写字面量时长', () => {
    expect(mount(DisclosureIcon).classes()).toContain('hn-transition')
  })
})

describe('a11y', () => {
  it('无 a11y 违规', async () => {
    const w = mount(DisclosureIcon, { attachTo: document.body })
    await expectNoA11yViolations(w.element as HTMLElement)
  })
})
