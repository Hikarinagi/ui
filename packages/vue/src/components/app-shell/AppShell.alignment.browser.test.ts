import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, ref } from 'vue'
import { House } from '@lucide/vue'
import AppShell from './AppShell.vue'
import Sidebar from '../sidebar/Sidebar.vue'
import SidebarTrigger from '../sidebar/SidebarTrigger.vue'
import type { SidebarState } from '../sidebar/context'
import NavLink from '../nav-link/NavLink.vue'
import '../../../test/browser.css'

const wrappers: VueWrapper[] = []
beforeEach(async () => {
  await page.viewport(1280, 800)
})
afterEach(() => {
  wrappers.splice(0).forEach(wrapper => wrapper.unmount())
  document.body.innerHTML = ''
})

function centerY(element: Element) {
  const rect = element.getBoundingClientRect()
  return rect.top + rect.height / 2
}

const cases = (['comfortable', 'compact'] as const).flatMap(density =>
  (['ltr', 'rtl'] as const).flatMap(dir =>
    [false, true].map(wordmark => ({ density, dir, wordmark })),
  ),
)

it.each(cases)(
  'aligns the header toggle and first navigation icon in rail mode ($density / $dir / wordmark=$wordmark)',
  async ({ density, dir, wordmark }) => {
    const state = ref<SidebarState>('expanded')
    const wrapper = mount(
      defineComponent({
        setup: () => () =>
          h(
            AppShell,
            {
              sidebar: state.value,
              'onUpdate:sidebar': value => (state.value = value),
              'data-density': density,
              dir,
            },
            {
              header: () => h(SidebarTrigger),
              sidebar: () =>
                h(
                  Sidebar,
                  {},
                  {
                    wordmark: wordmark ? () => h('span', 'Hina UI') : undefined,
                    default: () =>
                      h(
                        NavLink,
                        { href: '#home', label: 'Home' },
                        {
                          icon: () => h(House),
                          default: () => 'Home',
                        },
                      ),
                  },
                ),
            },
          ),
      }),
      { attachTo: document.body },
    )
    wrappers.push(wrapper)
    const aside = wrapper.find('aside').element
    const navIcon = wrapper.find('aside nav a svg').element
    const toggleIcon = wrapper.find('header button svg').element
    const toggle = wrapper.find('header button').element
    if (!wordmark) expect(Math.abs(centerY(navIcon) - centerY(toggleIcon))).toBeLessThan(0.5)
    await userEvent.click(toggle)
    await vi.waitFor(() => {
      expect(state.value).toBe('rail')
      expect(aside.getBoundingClientRect().width).toBe(56)
      if (wordmark) expect(aside.firstElementChild!.getBoundingClientRect().height).toBe(0)
    })
    expect(Math.abs(centerY(navIcon) - centerY(toggleIcon))).toBeLessThan(0.5)
    await userEvent.click(toggle)
    await vi.waitFor(() => {
      expect(state.value).toBe('expanded')
      expect(aside.getBoundingClientRect().width).toBe(256)
    })
    if (!wordmark) expect(Math.abs(centerY(navIcon) - centerY(toggleIcon))).toBeLessThan(0.5)
  },
)
