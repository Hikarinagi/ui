import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import AppShell from './AppShell.vue'
import Sidebar from '../sidebar/Sidebar.vue'
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
          AppShell,
          {},
          {
            header: () => h('span', 'Hina Docs'),
            sidebar: () =>
              h(Sidebar, {}, () => h(NavLink, { href: '#a', active: true }, () => '组件')),
            default: () => h('p', '正文内容'),
          },
        ),
    }),
    { attachTo: document.body },
  )
}

describe('结构 · 固定壳,内容滚动交给 ScrollArea', () => {
  it('壳占满视口且自身不滚,地面归壳;main 内是 ScrollArea', () => {
    const w = harness()
    const shell = w.find('div')
    expect(shell.classes()).toContain('bg-canvas')
    expect(shell.classes()).toContain('h-screen')
    expect(shell.classes()).toContain('overflow-hidden')
    expect(w.find('main .hn-scroll-area').exists()).toBe(true)
    expect(w.find('main').text()).toBe('正文内容')
  })

  it('header 定高不吸顶(壳固定无需 sticky),侧栏槽全高、窄屏隐藏', () => {
    const w = harness()
    const header = w.find('header')
    expect(header.classes()).toContain('shrink-0')
    expect(header.classes()).not.toContain('sticky')

    const rail = w.find('div').element.firstElementChild as HTMLElement
    expect(rail.className).toContain('h-full')
    expect(rail.className).toContain('hidden')
    expect(rail.className).toContain('lg:block')
    expect(rail.nextElementSibling?.contains(header.element)).toBe(true)
  })

  it('无 header / 无侧栏的降级形态', () => {
    const bare = mount(AppShell, { slots: { default: () => h('p', '仅正文') } })
    expect(bare.find('header').exists()).toBe(false)
    expect(bare.find('main').element.previousElementSibling).toBeNull()
    expect(bare.find('main .hn-scroll-area').exists()).toBe(true)
  })
})

describe('a11y', () => {
  it('banner / complementary / main 地标齐备且无违规', async () => {
    const w = harness()
    expect(w.find('header').exists()).toBe(true)
    expect(w.find('aside').exists()).toBe(true)
    expect(w.find('main').exists()).toBe(true)
    await expectNoA11yViolations(w.element as HTMLElement)
  })
})
