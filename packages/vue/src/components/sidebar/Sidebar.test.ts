import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import Sidebar from './Sidebar.vue'
import SidebarGroup from './SidebarGroup.vue'
import NavLink from '../nav-link/NavLink.vue'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

function harness() {
  return mount(
    defineComponent({
      setup: () => () =>
        h(
          Sidebar,
          {},
          {
            header: () => h('span', 'Hina UI'),
            default: () => [
              h(SidebarGroup, { label: '组件' }, () => [
                h(NavLink, { href: '#a', active: true }, () => 'Button'),
                h(NavLink, { href: '#b' }, () => 'Input'),
              ]),
              h(SidebarGroup, { label: '设计语言', defaultOpen: false }, () =>
                h(NavLink, { href: '#c' }, () => '薄墨'),
              ),
            ],
            footer: () => h('span', 'v0.1.0'),
          },
        ),
    }),
    { attachTo: document.body },
  )
}

describe('结构', () => {
  it('aside 地标 + 内层 nav 带 locale 兜底 aria-label,header/footer 插槽就位', () => {
    const w = harness()
    expect(w.element.tagName).toBe('ASIDE')
    expect(w.find('nav').attributes('aria-label')).toBe('侧边导航')
    expect(w.text()).toContain('Hina UI')
    expect(w.text()).toContain('v0.1.0')
    expect(w.find('aside').classes()).toContain('border-e')
  })

  it('无 header/footer 时不渲染对应容器;label 覆写 nav 名称', () => {
    const bare = mount(Sidebar, { props: { label: '文档目录' } })
    expect(bare.findAll('aside > div.shrink-0').length).toBe(0)
    expect(bare.find('nav').attributes('aria-label')).toBe('文档目录')
  })
})

describe('分组电池', () => {
  it('默认展开、点击收起,chevron 挂旋转组合;defaultOpen=false 组初始收起', async () => {
    const w = harness()
    const triggers = w.findAll('button')
    expect(triggers[0]!.attributes('aria-expanded')).toBe('true')
    expect(triggers[1]!.attributes('aria-expanded')).toBe('false')

    expect(triggers[0]!.classes()).toContain('group/hn-disclosure')
    const mark = triggers[0]!.find('span[aria-hidden="true"]')
    expect(mark.classes()).toContain('hn-transition')
    expect(mark.classes()).toContain('group-data-open/hn-disclosure:rotate-90')

    await triggers[0]!.trigger('click')
    expect(triggers[0]!.attributes('aria-expanded')).toBe('false')
  })

  it('组内行项就是 NavLink,选中态可达', () => {
    const w = harness()
    expect(w.find('[aria-current="page"]').text()).toBe('Button')
  })
})

describe('a11y', () => {
  it('无 a11y 违规', async () => {
    const w = harness()
    await expectNoA11yViolations(w.element as HTMLElement)
  })
})
