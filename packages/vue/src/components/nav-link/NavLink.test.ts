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
    const a = w.find('a')
    expect(a.exists()).toBe(true)
    expect(a.attributes('href')).toBe('/docs')
    expect(a.classes()).toContain('text-muted')
    expect(a.classes()).toContain('hn-press-none')
    expect(a.attributes('aria-current')).toBeUndefined()
  })

  it('active = aria-current="page" + 选中墨(data-state=selected)+ 字色回正加重', () => {
    const w = mount(NavLink, {
      props: { active: true },
      attrs: { href: '/docs' },
      slots: { default: () => '组件' },
    })
    const a = w.find('a')
    expect(a.attributes('aria-current')).toBe('page')
    expect(a.attributes('data-state')).toBe('selected')
    expect(a.classes()).toContain('text-fg')
    expect(a.classes()).toContain('font-medium')
    expect(a.classes()).not.toContain('text-muted')
  })

  it('disabled 退出 tab 序列并打 aria-disabled', () => {
    const w = mount(NavLink, { props: { disabled: true }, attrs: { href: '/x' } })
    const a = w.find('a')
    expect(a.attributes('aria-disabled')).toBe('true')
    expect(a.attributes('tabindex')).toBe('-1')
  })

  it('disabled 同时挡住鼠标并降透明度,与其余组件的禁用态一致', () => {
    const w = mount(NavLink, { props: { disabled: true }, attrs: { href: '/x' } })
    const a = w.find('a')
    expect(a.attributes('data-disabled')).toBe('')
    expect(a.classes()).toContain('data-disabled:pointer-events-none')
    expect(a.classes()).toContain('data-disabled:opacity-50')
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
    const a = w.find('[data-router]')
    expect(a.exists()).toBe(true)
    expect(a.attributes('href')).toBe('/guide')
    expect((a.element.firstElementChild as HTMLElement).classList.contains('nav-icon')).toBe(true)
  })

  it('asChild 由子元素承担链接,图标与文字留在它内部', () => {
    const w = mount(NavLink, {
      props: { asChild: true, active: true, class: 'w-40' },
      attrs: { 'data-x': '1' },
      slots: {
        icon: () => h('svg', { class: 'nav-icon' }),
        default: () => h('a', { href: '/child', class: 'own' }, '子元素'),
      },
    })
    const a = w.get('a')
    expect(w.element.firstElementChild).toBe(a.element)
    expect(a.attributes('href')).toBe('/child')
    expect(a.attributes('aria-current')).toBe('page')
    expect(a.attributes('data-state')).toBe('selected')
    expect(a.attributes('data-x')).toBe('1')
    expect(a.classes()).toEqual(expect.arrayContaining(['hn-interactive', 'w-40', 'own']))
    const [icon, label] = Array.from(a.element.children)
    expect(icon!.classList.contains('nav-icon')).toBe(true)
    expect(icon!.hasAttribute('aria-current')).toBe(false)
    expect(label!.hasAttribute('data-hn-label')).toBe(true)
    expect(label!.hasAttribute('aria-current')).toBe(false)
    expect(label!.textContent).toBe('子元素')
    expect(label!.querySelector('a')).toBeNull()
  })

  it('asChild 的子元素是组件时同样成为链接根', () => {
    const RouterStub = defineComponent({
      props: { to: { type: String, required: true } },
      setup:
        (p, { slots }) =>
        () =>
          h('a', { href: p.to, 'data-router': '' }, slots.default?.()),
    })
    const w = mount(NavLink, {
      props: { asChild: true },
      slots: {
        icon: () => h('svg', { class: 'nav-icon' }),
        default: () => h(RouterStub, { to: '/guide' }, () => '指南'),
      },
    })
    const a = w.get('[data-router]')
    expect(w.element.firstElementChild).toBe(a.element)
    expect(a.attributes('href')).toBe('/guide')
    expect(a.classes()).toContain('hn-interactive')
    expect((a.element.firstElementChild as HTMLElement).classList.contains('nav-icon')).toBe(true)
    expect(a.get('[data-hn-label]').text()).toBe('指南')
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
