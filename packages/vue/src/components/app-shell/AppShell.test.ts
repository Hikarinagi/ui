import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'
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

    const row = w.find('div').element.firstElementChild as HTMLElement
    const rail = row.firstElementChild as HTMLElement
    expect(rail.className).toContain('h-full')
    expect(rail.className).toContain('hidden')
    expect(rail.className).toContain('lg:block')
    expect(rail.nextElementSibling?.contains(header.element)).toBe(true)
  })

  it('banner 槽在最顶部横贯整个壳,侧栏与内容列在它下面一行', () => {
    const w = mount(AppShell, {
      slots: {
        banner: () => h('p', '公告'),
        sidebar: () => h(Sidebar),
        default: () => h('p', '正文'),
      },
    })
    const root = w.find('div').element
    expect(root.className).toContain('flex-col')
    const top = root.firstElementChild as HTMLElement
    expect(top.textContent).toBe('公告')
    expect(top.className).toContain('shrink-0')
    const row = top.nextElementSibling as HTMLElement
    expect(row.className).toContain('flex-1')
    expect(row.querySelector('aside')).not.toBeNull()
    expect(row.querySelector('main')).not.toBeNull()
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

describe('移动端抽屉 · 标准行为可被调用方接管', () => {
  function routed(props: Record<string, unknown>) {
    const currentRoute = ref({ fullPath: '/a' })
    const wrapper = mount(
      defineComponent({
        setup: () => () => h(AppShell, props, { sidebar: () => h(Sidebar), default: () => h('p') }),
      }),
      {
        attachTo: document.body,
        global: { config: { globalProperties: { $router: { currentRoute } } } },
      },
    )
    return { wrapper, currentRoute }
  }

  it('默认随 fullPath 变化关闭;autoClose 关掉后交由调用方决定', async () => {
    const open = { value: true }
    const a = routed({
      mobileOpen: open.value,
      'onUpdate:mobileOpen': (v: boolean) => (open.value = v),
    })
    a.currentRoute.value = { fullPath: '/b' }
    await nextTick()
    expect(open.value).toBe(false)

    const kept = { value: true }
    const b = routed({
      autoClose: false,
      mobileOpen: kept.value,
      'onUpdate:mobileOpen': (v: boolean) => (kept.value = v),
    })
    b.currentRoute.value = { fullPath: '/c' }
    await nextTick()
    expect(kept.value).toBe(true)
  })
})
