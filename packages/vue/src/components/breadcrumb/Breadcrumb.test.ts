import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import Breadcrumb from './Breadcrumb.vue'
import BreadcrumbItem from './BreadcrumbItem.vue'
import BreadcrumbSeparator from './BreadcrumbSeparator.vue'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

function harness() {
  return mount(
    defineComponent({
      setup: () => () =>
        h(Breadcrumb, {}, () => [
          h(BreadcrumbItem, { href: '/' }, () => '首页'),
          h(BreadcrumbSeparator),
          h(BreadcrumbItem, { href: '/components' }, () => '组件'),
          h(BreadcrumbSeparator),
          h(BreadcrumbItem, { current: true }, () => 'Button'),
        ]),
    }),
    { attachTo: document.body },
  )
}

describe('结构与语义', () => {
  it('nav 地标 locale 兜底名 + ol 列表;分隔项 aria-hidden 默认 chevron', () => {
    const w = harness()
    expect(w.find('nav').attributes('aria-label')).toBe('面包屑')
    expect(w.find('ol').exists()).toBe(true)
    const seps = w.findAll('li[aria-hidden="true"]')
    expect(seps.length).toBe(2)
    expect(seps[0]!.find('svg').exists()).toBe(true)
  })

  it('链接项走 hn-link 文字墨;当前页是 span + aria-current,不可点', () => {
    const w = harness()
    const links = w.findAll('a')
    expect(links.length).toBe(2)
    expect(links[0]!.classes()).toContain('hn-link')
    expect(links[0]!.attributes('href')).toBe('/')

    const current = w.find('[aria-current="page"]')
    expect(current.element.tagName).toBe('SPAN')
    expect(current.text()).toBe('Button')
    expect(current.classes()).toContain('font-medium')
  })

  it('分隔符可换插槽;链接项可多态换路由组件', () => {
    const sep = mount(BreadcrumbSeparator, { slots: { default: () => '/' } })
    expect(sep.text()).toBe('/')
    expect(sep.find('svg').exists()).toBe(false)

    const RouterStub = defineComponent({
      props: { to: { type: String, required: true } },
      setup:
        (p, { slots }) =>
        () =>
          h('a', { href: p.to, 'data-router': '' }, slots.default?.()),
    })
    const item = mount(BreadcrumbItem, {
      props: { as: RouterStub },
      attrs: { to: '/guide' },
      slots: { default: () => '指南' },
    })
    expect(item.find('a[data-router]').attributes('href')).toBe('/guide')
  })
})

describe('a11y', () => {
  it('无 a11y 违规', async () => {
    const w = harness()
    await expectNoA11yViolations(w.element as HTMLElement)
  })
})
