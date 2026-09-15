import { afterEach, describe, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, ref, withDirectives } from 'vue'
import AppShell from '../app-shell/AppShell.vue'
import Avatar from '../avatar/Avatar.vue'
import NavLink from '../nav-link/NavLink.vue'
import { vTooltip } from '../tooltip/directive'
import Sidebar from './Sidebar.vue'
import type { SidebarState } from './context'
import '../../../test/browser.css'

const mounted: VueWrapper[] = []

afterEach(() => {
  mounted.splice(0).forEach(wrapper => wrapper.unmount())
  document.body.innerHTML = ''
  document.documentElement.removeAttribute('dir')
})

describe('Sidebar footer bounds', () => {
  it.each(['ltr', 'rtl'])(
    'keeps the full-width button and its tooltip within reach in rail mode (%s)',
    async dir => {
      await page.viewport(1280, 800)
      document.documentElement.dir = dir
      const state = ref<SidebarState>('expanded')
      const clicked = vi.fn()
      mounted.push(
        mount(
          defineComponent({
            setup: () => () =>
              h(
                AppShell,
                { sidebar: state.value, dir },
                {
                  sidebar: () =>
                    h(
                      Sidebar,
                      {},
                      {
                        default: () =>
                          h(NavLink, { href: '#overview', label: 'Overview' }, () => 'Overview'),
                        footer: () =>
                          withDirectives(
                            h(
                              'button',
                              {
                                'data-account': '',
                                class: 'hn-interactive hn-state-layer w-full rounded-lg p-1',
                                onClick: clicked,
                              },
                              h(Avatar, { name: 'User' }),
                            ),
                            [
                              [
                                vTooltip,
                                {
                                  content: 'Account menu',
                                  side: dir === 'rtl' ? 'left' : 'right',
                                },
                              ],
                            ],
                          ),
                      },
                    ),
                },
              ),
          }),
          { attachTo: document.body },
        ),
      )
      const sidebar = document.querySelector('aside')!
      const footer = sidebar.lastElementChild!
      const button = footer.querySelector('button')!
      const height = footer.getBoundingClientRect().height
      state.value = 'rail'
      await vi.waitFor(() => expect(sidebar.getBoundingClientRect().width).toBe(56))
      expect(footer.getBoundingClientRect().width).toBe(sidebar.clientWidth)
      expect(footer.getBoundingClientRect().height).toBe(height)
      const bounds = button.getBoundingClientRect()
      const rail = sidebar.getBoundingClientRect()
      expect(bounds.left).toBeGreaterThan(rail.left)
      expect(bounds.right).toBeLessThan(rail.right)
      expect(bounds.width).toBeGreaterThan(0)
      for (const x of [bounds.left + 2, bounds.right - 2]) {
        expect(document.elementFromPoint(x, bounds.y + bounds.height / 2)?.closest('button')).toBe(
          button,
        )
      }
      await userEvent.hover(button)
      await vi.waitFor(() => expect(button.matches(':hover')).toBe(true))
      expect(parseFloat(getComputedStyle(button, '::after').borderTopLeftRadius)).toBeGreaterThan(0)
      expect(parseFloat(getComputedStyle(button, '::after').borderTopRightRadius)).toBeGreaterThan(
        0,
      )
      await vi.waitFor(() => {
        const tooltip = document.querySelector('.hn-anim-pop[data-side]')!
        expect(tooltip?.textContent).toContain('Account menu')
        const popper = tooltip
          .closest('[data-reka-popper-content-wrapper]')!
          .getBoundingClientRect()
        const gap = dir === 'rtl' ? bounds.left - popper.right : popper.left - bounds.right
        expect(gap).toBeGreaterThanOrEqual(0)
        expect(gap).toBeLessThan(24)
      })
      await userEvent.click(button)
      expect(clicked).toHaveBeenCalledOnce()
      state.value = 'expanded'
      await vi.waitFor(() => expect(sidebar.getBoundingClientRect().width).toBe(256))
      expect(footer.getBoundingClientRect().width).toBe(sidebar.clientWidth)
      expect(footer.getBoundingClientRect().height).toBe(height)
    },
  )
})
