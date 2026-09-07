import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import { page, userEvent } from '@vitest/browser/context'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, ref, type Ref } from 'vue'
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

function harness(shellProps: Record<string, unknown> = {}, model?: Ref<string>) {
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
              h(Sidebar, {}, () =>
                h(SidebarGroup, { label: '组件' }, () =>
                  h(
                    NavLink,
                    { href: '#x', label: '收藏夹', active: true },
                    {
                      icon: () => h(Star, { class: 'size-4 shrink-0' }),
                      default: () => '收藏夹',
                    },
                  ),
                ),
              ),
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
    await vi.waitFor(() =>
      expect((groupButton.closest('.hn-collapse-body') as HTMLElement).clientHeight).toBe(0),
    )

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

  it('组头按钮保留自己的按压过渡:收合占位层不清零它的 transition', async () => {
    const w = harness()
    const trigger = w.find('aside button').element as HTMLElement
    const style = getComputedStyle(trigger)
    expect(style.transitionProperty).toContain('transform')
    expect(style.transitionDuration.split(',').every(d => parseFloat(d) > 0)).toBe(true)
    const body = trigger.parentElement as HTMLElement
    expect(body.classList.contains('hn-collapse-body')).toBe(true)
    expect(getComputedStyle(body).transitionProperty).toBe('opacity')
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

    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(document.querySelector('[role="dialog"]')).toBeNull())
  })
})
