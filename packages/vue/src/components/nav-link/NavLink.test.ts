import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, defineComponent } from 'vue'
import NavLink from './NavLink.vue'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

describe('渲染与状态', () => {
  it('默认渲染 a,静止 muted 字色、行项不弹(hn-press-none)', () => {
    const w = mount(NavLink, { attrs: { href: '/docs' }, slots: { default: () => '组件' } })
    expect(w.element.tagName).toBe('A')
    expect(w.attributes('href')).toBe('/docs')
    expect(w.classes()).toContain('text-muted')
    expect(w.classes()).toContain('hn-press-none')
    expect(w.attributes('aria-current')).toBeUndefined()
  })

  it('active = aria-current="page" + 选中墨(data-state=selected)+ 字色回正加重', () => {
    const w = mount(NavLink, {
      props: { active: true },
      attrs: { href: '/docs' },
      slots: { default: () => '组件' },
    })
    expect(w.attributes('aria-current')).toBe('page')
    expect(w.attributes('data-state')).toBe('selected')
    expect(w.classes()).toContain('text-fg')
    expect(w.classes()).toContain('font-medium')
    expect(w.classes()).not.toContain('text-muted')
  })

  it('disabled 退出 tab 序列并打 aria-disabled', () => {
    const w = mount(NavLink, { props: { disabled: true }, attrs: { href: '/x' } })
    expect(w.attributes('aria-disabled')).toBe('true')
    expect(w.attributes('tabindex')).toBe('-1')
  })

  it('as 可换路由组件,icon 插槽在前', () => {
    const RouterStub = defineComponent({
      props: { to: { type: String, required: true } },
      setup:
        (p, { slots }) =>
        () =>
          h('a', { href: p.to, 'data-router': '' }, slots.default?.()),
    })
    const w = mount(NavLink, {
      props: { as: RouterStub },
      attrs: { to: '/guide' },
      slots: { icon: () => h('svg', { class: 'nav-icon' }), default: () => '指南' },
    })
    expect(w.attributes('data-router')).toBe('')
    expect(w.attributes('href')).toBe('/guide')
    expect((w.element.firstElementChild as HTMLElement).classList.contains('nav-icon')).toBe(true)
  })
})

describe('a11y', () => {
  it('无 a11y 违规(静止与 active)', async () => {
    const rest = mount(
      defineComponent({
        setup: () => () =>
          h('nav', [
            h(NavLink, { href: '/a' }, () => '甲'),
            h(NavLink, { href: '/b' }, () => '乙'),
          ]),
      }),
      { attachTo: document.body },
    )
    await expectNoA11yViolations(rest.element as HTMLElement)

    const active = mount(
      defineComponent({
        setup: () => () => h('nav', [h(NavLink, { href: '/a', active: true }, () => '甲')]),
      }),
      { attachTo: document.body },
    )
    await expectNoA11yViolations(active.element as HTMLElement)
  })
})
