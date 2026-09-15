import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, nextTick, reactive } from 'vue'
import AppShell from '../app-shell/AppShell.vue'
import NavLink from '../nav-link/NavLink.vue'
import Sidebar from './Sidebar.vue'
import SidebarTrigger from './SidebarTrigger.vue'
import type { SidebarState } from './context'
import '../../../test/browser.css'

const wrappers: VueWrapper[] = []

beforeEach(async () => {
  await page.viewport(1280, 800)
})

afterEach(() => {
  wrappers.splice(0).forEach(wrapper => wrapper.unmount())
  document.body.innerHTML = ''
})

function harness(
  options: { icon?: boolean; wordmark?: boolean; header?: boolean; dir?: string } = {},
) {
  const state = reactive({
    sidebar: 'expanded' as SidebarState,
    icon: true,
    wordmark: true,
    header: false,
    ...options,
  })
  const wrapper = mount(
    defineComponent({
      setup: () => () =>
        h(
          AppShell,
          { sidebar: state.sidebar, dir: state.dir },
          {
            header: () => h(SidebarTrigger),
            sidebar: () =>
              h(
                Sidebar,
                {},
                {
                  icon: state.icon
                    ? ({ state: sidebarState }: { state: SidebarState }) =>
                        h(
                          'svg',
                          {
                            'data-brand-icon': '',
                            'data-sidebar-state': sidebarState,
                            viewBox: '0 0 80 40',
                            role: 'img',
                            'aria-label': 'Brand icon',
                          },
                          [h('rect', { width: 80, height: 40 })],
                        )
                    : undefined,
                  wordmark: state.wordmark
                    ? ({ state: sidebarState }: { state: SidebarState }) =>
                        h(
                          'a',
                          {
                            'data-wordmark': '',
                            'data-sidebar-state': sidebarState,
                            href: '#brand',
                            'aria-label': 'Brand home',
                          },
                          h(
                            'svg',
                            { viewBox: '0 0 300 50', role: 'img', 'aria-label': 'Brand wordmark' },
                            [h('rect', { width: 300, height: 50 })],
                          ),
                        )
                    : undefined,
                  header: state.header
                    ? ({ state: sidebarState }: { state: SidebarState }) =>
                        h(
                          'button',
                          {
                            'data-custom-header': '',
                            'data-sidebar-state': sidebarState,
                          },
                          'Custom header',
                        )
                    : undefined,
                  default: () =>
                    h(NavLink, { href: '#overview', label: 'Overview' }, () => 'Overview'),
                },
              ),
          },
        ),
    }),
    { attachTo: document.body },
  )
  wrappers.push(wrapper)
  return state
}

const sidebar = () => document.querySelector('aside')!
const label = (root: Element = sidebar()) =>
  root.querySelector('[data-wordmark]')!.closest('.hn-sidebar-label') as HTMLElement

async function settle(root: Element = sidebar()) {
  await nextTick()
  await new Promise(requestAnimationFrame)
  await Promise.allSettled(
    root
      .getAnimations({ subtree: true })
      .filter(
        animation =>
          animation.timeline instanceof DocumentTimeline &&
          animation.playState === 'running' &&
          animation.effect?.getTiming().iterations !== Infinity,
      )
      .map(animation => animation.finished),
  )
}

describe('Sidebar brand slots', () => {
  it.each(['ltr', 'rtl'])(
    'retains the square icon and header geometry while hiding the wordmark (%s)',
    async dir => {
      const state = harness({ dir })
      const icon = sidebar().querySelector('[data-brand-icon]')!
      const box = icon.parentElement!
      const rect = box.getBoundingClientRect().toJSON()
      const headerHeight = sidebar().firstElementChild!.getBoundingClientRect().height
      const navY = sidebar().querySelector('nav')!.getBoundingClientRect().y
      expect(rect.width).toBe(32)
      expect(rect.height).toBe(32)
      expect(icon.querySelector('rect')!.getBoundingClientRect().width).toBe(32)
      expect(icon.querySelector('rect')!.getBoundingClientRect().height).toBe(16)
      expect(
        sidebar().querySelector('[data-wordmark] svg')!.getBoundingClientRect().width,
      ).toBeLessThanOrEqual(label().getBoundingClientRect().width)
      state.sidebar = 'rail'
      await settle()
      expect(box.getBoundingClientRect().toJSON()).toEqual(rect)
      expect(getComputedStyle(icon).visibility).toBe('visible')
      expect(getComputedStyle(label()).opacity).toBe('0')
      expect(label().inert).toBe(true)
      expect(label().getAttribute('aria-hidden')).toBe('true')
      expect(icon.getAttribute('data-sidebar-state')).toBe('rail')
      expect(sidebar().firstElementChild!.getBoundingClientRect().height).toBe(headerHeight)
      expect(sidebar().querySelector('nav')!.getBoundingClientRect().y).toBe(navY)
      state.sidebar = 'expanded'
      await settle()
      expect(getComputedStyle(label()).opacity).toBe('1')
      expect(box.getBoundingClientRect().toJSON()).toEqual(rect)
    },
  )

  it('hides an entire wordmark without reserving an empty icon column or collapsing its row', async () => {
    const state = harness({ icon: false })
    const header = sidebar().firstElementChild! as HTMLElement
    const wordmark = sidebar().querySelector('[data-wordmark]') as HTMLElement
    const labelX = label().getBoundingClientRect().x
    expect(labelX).toBe(
      header.getBoundingClientRect().x + parseFloat(getComputedStyle(header).paddingLeft),
    )
    expect(sidebar().querySelector('[data-brand-icon]')).toBeNull()
    wordmark.focus()
    expect(document.activeElement).toBe(wordmark)
    const rect = header.getBoundingClientRect().toJSON()
    state.sidebar = 'rail'
    await settle()
    expect(getComputedStyle(label()).visibility).toBe('hidden')
    expect(header.getBoundingClientRect().toJSON()).toEqual(rect)
    wordmark.focus()
    expect(document.activeElement).not.toBe(wordmark)
    state.sidebar = 'expanded'
    await settle()
    wordmark.focus()
    expect(document.activeElement).toBe(wordmark)
  })

  it('preserves the intrinsic width of SVG wordmarks inside a custom inline layout', async () => {
    const wrapper = mount(Sidebar, {
      slots: {
        wordmark: () =>
          h('span', { class: 'inline-flex items-baseline gap-1' }, [
            h(
              'span',
              { class: 'h-5 [&>svg]:h-full [&>svg]:w-auto' },
              h(
                'svg',
                {
                  viewBox: '0 0 80 40',
                  role: 'img',
                  'aria-label': 'Nested wordmark',
                },
                h('rect', { width: 80, height: 40 }),
              ),
            ),
            h('span', 'UI'),
          ]),
      },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    const svg = sidebar().querySelector('svg')!
    expect(svg.getBoundingClientRect().width).toBe(40)
    expect(svg.getBoundingClientRect().height).toBe(20)
  })

  it('keeps an icon-only header visible in rail form', async () => {
    const state = harness({ wordmark: false })
    state.sidebar = 'rail'
    await settle()
    expect(sidebar().querySelector('[data-wordmark]')).toBeNull()
    expect(getComputedStyle(sidebar().querySelector('[data-brand-icon]')!).visibility).toBe(
      'visible',
    )
    expect(sidebar().firstElementChild!.getBoundingClientRect().height).toBe(56)
  })

  it('omits the header without brand slots and updates when slots are added or removed', async () => {
    const state = harness({ icon: false, wordmark: false })
    expect(sidebar().firstElementChild!.classList.contains('hn-scroll-area')).toBe(true)
    state.wordmark = true
    await nextTick()
    expect(sidebar().querySelector('[data-wordmark]')).not.toBeNull()
    state.wordmark = false
    await nextTick()
    expect(sidebar().firstElementChild!.classList.contains('hn-scroll-area')).toBe(true)
  })

  it('lets the custom header fully replace both brand slots and retain its own visibility', async () => {
    const state = harness({ header: true })
    expect(sidebar().querySelector('[data-brand-icon]')).toBeNull()
    expect(sidebar().querySelector('[data-wordmark]')).toBeNull()
    state.sidebar = 'rail'
    await settle()
    const custom = sidebar().querySelector('[data-custom-header]') as HTMLElement
    expect(custom.getAttribute('data-sidebar-state')).toBe('rail')
    expect(getComputedStyle(custom).visibility).toBe('visible')
    custom.focus()
    expect(document.activeElement).toBe(custom)
  })

  it('shows the complete brand in the mobile drawer even when the desktop state is rail', async () => {
    await page.viewport(375, 800)
    const state = harness()
    state.sidebar = 'rail'
    await userEvent.click(page.getByRole('button', { name: '切换侧栏' }))
    await vi.waitFor(() => expect(document.querySelector('[role="dialog"] aside')).not.toBeNull())
    const drawerSidebar = document.querySelector('[role="dialog"] aside')!
    await settle(drawerSidebar)
    expect(drawerSidebar.getAttribute('data-state')).toBe('expanded')
    expect(
      drawerSidebar.querySelector('[data-brand-icon]')!.getAttribute('data-sidebar-state'),
    ).toBe('expanded')
    expect(getComputedStyle(label(drawerSidebar)).opacity).toBe('1')
    expect(label(drawerSidebar).inert).toBe(false)
  })
})
