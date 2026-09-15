import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, reactive, ref, type Ref } from 'vue'
import AppShell from '../app-shell/AppShell.vue'
import Sidebar from './Sidebar.vue'
import SidebarGroup from './SidebarGroup.vue'
import SidebarTrigger from './SidebarTrigger.vue'
import NavLink from '../nav-link/NavLink.vue'
import TooltipProvider from '../tooltip/TooltipProvider.vue'
import { Star } from '@lucide/vue'
import '../../../test/browser.css'

let mounted: VueWrapper[] = []

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(() => {
  mounted.forEach(w => w.unmount())
  mounted = []
})

function harness(
  shellProps: Record<string, unknown> = {},
  model?: Ref<string>,
  withSlots = false,
  itemCount = ref(1),
  sidebarProps: Record<string, unknown> = {},
) {
  const host = document.createElement('div')
  document.body.appendChild(host)
  const w = mount(
    defineComponent({
      setup: () => () => {
        const bound: Record<string, unknown> = { ...shellProps }
        if (model) {
          bound.sidebar = model.value
          bound['onUpdate:sidebar'] = (v: string) => (model.value = v)
        }
        return h(TooltipProvider, { delayDuration: 0 }, () =>
          h(AppShell, bound, {
            header: () => h(SidebarTrigger),
            sidebar: () =>
              h(Sidebar, sidebarProps, {
                header: withSlots ? () => h('span', { 'data-header': '' }, 'Hina UI') : undefined,
                footer: withSlots ? () => h('span', { 'data-footer': '' }, 'Account') : undefined,
                default: () =>
                  h(SidebarGroup, { label: '组件' }, () =>
                    Array.from({ length: itemCount.value }, (_, index) =>
                      h(
                        NavLink,
                        { key: index, href: `#x${index}`, label: '收藏夹', active: index === 0 },
                        {
                          icon: () => h(Star, { class: 'size-4 shrink-0' }),
                          default: () => '收藏夹',
                        },
                      ),
                    ),
                  ),
              }),
            default: () => h('p', '正文内容'),
          }),
        )
      },
    }),
    { attachTo: host },
  )
  mounted.push(w)
  return w
}

const aside = () => document.querySelector('aside') as HTMLElement | null
const trigger = () => document.querySelector('[aria-label="切换侧栏"]') as HTMLElement

describe('sidebar · 三态收起系统', () => {
  it('展开 256 → rail 56:label 隐去、组头换分隔线、悬停出 Tooltip;再点还原', async () => {
    await page.viewport(1280, 800)
    harness()
    await vi.waitFor(() => expect(aside()).toBeTruthy())
    expect(Math.round(aside()!.getBoundingClientRect().width)).toBe(256)
    expect(Math.round(aside()!.getBoundingClientRect().height)).toBe(window.innerHeight)
    expect(Math.round(aside()!.getBoundingClientRect().top)).toBe(0)
    expect(aside()!.textContent).toContain('收藏夹')
    expect(aside()!.textContent).toContain('组件')

    const iconXBefore = aside()!.querySelector('a svg')!.getBoundingClientRect().left

    await userEvent.click(trigger())
    await vi.waitFor(() => expect(Math.round(aside()!.getBoundingClientRect().width)).toBe(56))
    expect(aside()!.dataset.state).toBe('rail')

    const label = aside()!.querySelector('a span')!
    await vi.waitFor(() => expect(getComputedStyle(label).opacity).toBe('0'))
    expect(label.getAttribute('aria-hidden')).toBe('true')

    const groupButton = [...aside()!.querySelectorAll('button')].find(b =>
      b.textContent!.includes('组件'),
    )!
    await vi.waitFor(() => expect(getComputedStyle(groupButton).visibility).toBe('hidden'))

    const iconXAfter = aside()!.querySelector('a svg')!.getBoundingClientRect().left
    expect(Math.abs(iconXAfter - iconXBefore)).toBeLessThanOrEqual(1)

    const railItem = aside()!.querySelector('a')!.getBoundingClientRect()
    expect(Math.abs(railItem.width - 36)).toBeLessThanOrEqual(1)
    expect(Math.round(railItem.height)).toBe(36)

    const link = aside()!.querySelector('a')!
    await userEvent.hover(link)
    await vi.waitFor(() => {
      const tip = document.querySelector('.hn-anim-pop[data-side]')
      expect(tip?.textContent).toContain('收藏夹')
    })

    await userEvent.click(trigger())
    await vi.waitFor(() => expect(Math.round(aside()!.getBoundingClientRect().width)).toBe(256))
    expect(aside()!.dataset.state).toBe('expanded')
  })

  it('组头按钮保留自己的按压过渡，文字显隐不影响标题占位', async () => {
    const w = harness()
    const trigger = w.find('aside button').element as HTMLElement
    const style = getComputedStyle(trigger)
    expect(style.transitionProperty).toContain('transform')
    expect(style.transitionDuration.split(',').every(d => parseFloat(d) > 0)).toBe(true)
    const body = trigger.parentElement as HTMLElement
    expect(body.classList.contains('hn-sidebar-label')).toBe(true)
    expect(getComputedStyle(body).transitionProperty).toContain('opacity')
    expect(body.parentElement!.clientHeight).toBe(trigger.offsetHeight)
  })

  it("collapsible='hidden':触发器在展开与全收之间二态切换", async () => {
    await page.viewport(1280, 800)
    harness({ collapsible: 'hidden' })
    await vi.waitFor(() => expect(aside()).toBeTruthy())
    await userEvent.click(trigger())
    await vi.waitFor(() =>
      expect(Math.round(aside()!.getBoundingClientRect().width)).toBeLessThanOrEqual(1),
    )
    expect(aside()!.dataset.state).toBe('hidden')
    await userEvent.click(trigger())
    await vi.waitFor(() => expect(Math.round(aside()!.getBoundingClientRect().width)).toBe(256))
  })

  it('v-model:sidebar 受控:外部置 rail 直接进 rail,内部切换回写', async () => {
    await page.viewport(1280, 800)
    const model = ref('rail')
    const w = harness({}, model)
    await vi.waitFor(() => expect(Math.round(aside()!.getBoundingClientRect().width)).toBe(56))
    await userEvent.click(trigger())
    await vi.waitFor(() => expect(model.value).toBe('expanded'))
    await w.vm.$forceUpdate()
    await vi.waitFor(() => expect(Math.round(aside()!.getBoundingClientRect().width)).toBe(256))
  })

  it('移动端:触发器开 Drawer,侧栏以展开形态进抽屉', async () => {
    await page.viewport(600, 800)
    harness()
    expect(aside()?.checkVisibility() ?? false).toBe(false)

    await userEvent.click(trigger())
    await vi.waitFor(() => {
      const drawer = document.querySelector('[role="dialog"]')
      expect(drawer?.textContent).toContain('收藏夹')
      expect(drawer?.textContent).toContain('组件')
    })

    const drawerAside = document.querySelector('[role="dialog"] aside') as HTMLElement
    const style = getComputedStyle(drawerAside)
    expect(style.borderRightWidth).toBe('0px')
    expect(style.borderLeftWidth).toBe('0px')
    let host = drawerAside.parentElement as HTMLElement
    while (host.getBoundingClientRect().width === 0) host = host.parentElement as HTMLElement
    const hostStyle = getComputedStyle(host)
    expect(drawerAside.getBoundingClientRect().width).toBe(
      host.clientWidth - parseFloat(hostStyle.paddingLeft) - parseFloat(hostStyle.paddingRight),
    )

    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(document.querySelector('[role="dialog"]')).toBeNull())
  })
})

describe('sidebar drawer spacing', () => {
  it('preserves vertical padding around header, navigation and footer in the drawer', async () => {
    await page.viewport(600, 800)
    harness({}, undefined, true)
    await userEvent.click(trigger())
    await vi.waitFor(() => expect(document.querySelector('[role="dialog"] aside')).toBeTruthy())
    const sidebar = document.querySelector('[role="dialog"] aside') as HTMLElement
    const header = sidebar.firstElementChild!
    const footer = sidebar.querySelector('[data-footer]')!.parentElement!
    const nav = sidebar.querySelector('nav')!
    for (const element of [header, footer]) {
      expect(getComputedStyle(element).paddingTop).toBe('12px')
      expect(getComputedStyle(element).paddingBottom).toBe('12px')
      expect(getComputedStyle(element).paddingLeft).toBe('0px')
      expect(getComputedStyle(element).paddingRight).toBe('0px')
    }
    expect(getComputedStyle(nav).paddingTop).toBe('8px')
    expect(getComputedStyle(nav).paddingBottom).toBe('8px')
    expect(getComputedStyle(nav).paddingLeft).toBe('0px')
  })
})

describe('AppShell mobile title', () => {
  it('keeps the title as an accessible name without an extra visible title bar', async () => {
    await page.viewport(600, 800)
    const props = reactive<{ mobileTitle?: string }>({ mobileTitle: 'Hina Studio' })
    const sidebarProps = reactive({ closable: true })
    harness(props, undefined, false, ref(1), sidebarProps)
    await userEvent.click(trigger())
    await expect.element(page.getByRole('dialog', { name: 'Hina Studio' })).toBeVisible()
    const heading = document.querySelector('[role="dialog"] h2')!
    expect(heading.textContent).toBe('Hina Studio')
    expect(heading.classList.contains('sr-only')).toBe(true)
    expect(heading.getBoundingClientRect().height).toBe(1)
    await expect.element(page.getByRole('button', { name: '关闭', exact: true })).toBeVisible()
    props.mobileTitle = 'Hina Workspace'
    await expect.element(page.getByRole('dialog', { name: 'Hina Workspace' })).toBeVisible()
    props.mobileTitle = undefined
    await expect.element(page.getByRole('dialog', { name: '侧边导航' })).toBeVisible()
    sidebarProps.closable = false
    await vi.waitFor(() =>
      expect(document.querySelector('[role="dialog"] [aria-label="关闭"]')).toBeNull(),
    )
    expect(
      document
        .querySelector('[role="dialog"] aside')!
        .firstElementChild!.classList.contains('hn-scroll-area'),
    ).toBe(true)
    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(document.querySelector('[role="dialog"]')).toBeNull())
    await vi.waitFor(() => expect(document.activeElement).toBe(trigger()))
  })
})

describe('AppShell mobile sidebar layout', () => {
  it.each([800, 360])(
    'pins the footer to the drawer bottom and scrolls only the navigation at height %i',
    async height => {
      await page.viewport(375, height)
      const count = ref(1)
      harness({}, undefined, true, count)
      await userEvent.click(trigger())
      await vi.waitFor(() => expect(document.querySelector('[role="dialog"] aside')).toBeTruthy())
      const drawer = document.querySelector('[role="dialog"]') as HTMLElement
      await vi.waitFor(() => expect(drawer.getBoundingClientRect().x).toBe(0))
      const sidebar = drawer.querySelector('aside')!
      const header = sidebar.firstElementChild!
      const footer = sidebar.lastElementChild!
      const area = sidebar.querySelector('.hn-scroll-area')!
      const rect = (element: Element) => element.getBoundingClientRect().toJSON()
      expect(drawer.querySelectorAll('.hn-scroll-area')).toHaveLength(1)
      expect(sidebar.getBoundingClientRect().height).toBe(drawer.clientHeight)
      expect(Math.abs(footer.getBoundingClientRect().bottom - height)).toBeLessThanOrEqual(1)
      expect(area.getBoundingClientRect().top).toBe(header.getBoundingClientRect().bottom)
      expect(area.getBoundingClientRect().bottom).toBe(footer.getBoundingClientRect().top)
      expect(area.getBoundingClientRect().height).toBeGreaterThan(height / 2)
      const headerRect = rect(header)
      const footerRect = rect(footer)
      count.value = 60
      await vi.waitFor(() => expect(sidebar.querySelectorAll('nav a')).toHaveLength(60))
      await vi.waitFor(() =>
        expect(sidebar.querySelector('[data-overlayscrollbars-viewport]')).toBeTruthy(),
      )
      const viewport = sidebar.querySelector('[data-overlayscrollbars-viewport]') as HTMLElement
      await vi.waitFor(() => expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight))
      viewport.scrollTop = viewport.scrollHeight
      await vi.waitFor(() => expect(viewport.scrollTop).toBeGreaterThan(0))
      expect(rect(header)).toEqual(headerRect)
      expect(rect(footer)).toEqual(footerRect)
      expect(sidebar.querySelector('nav')!.getBoundingClientRect().top).toBeLessThan(headerRect.top)
      await userEvent.click(page.getByRole('button', { name: '关闭', exact: true }))
      await vi.waitFor(() => expect(document.querySelector('[role="dialog"]')).toBeNull())
      await vi.waitFor(() => expect(document.activeElement).toBe(trigger()))
    },
  )
})
