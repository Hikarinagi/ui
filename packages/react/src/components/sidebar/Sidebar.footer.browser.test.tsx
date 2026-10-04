import { afterEach, describe, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { AppShell } from '../app-shell/AppShell'
import { Avatar } from '../avatar/Avatar'
import { NavLink } from '../nav-link/NavLink'
import { Tooltip } from '../tooltip/Tooltip'
import { Sidebar } from './Sidebar'
import type { SidebarState } from './context'
import { mount } from '../../../test/mount'
import { signal } from '../../../test/signal'
import '../../../test/browser.css'

const mounted: Array<{ unmount: () => Promise<void> }> = []

afterEach(async () => {
  for (const wrapper of mounted.splice(0)) await wrapper.unmount()
  document.body.innerHTML = ''
  document.documentElement.removeAttribute('dir')
})

describe('Sidebar footer bounds', () => {
  it.each(['ltr', 'rtl'] as const)(
    'keeps the full-width button and its tooltip within reach in rail mode (%s)',
    async dir => {
      await page.viewport(1280, 800)
      document.documentElement.dir = dir
      const state = signal<SidebarState>('expanded')
      const clicked = vi.fn()
      function Harness() {
        const sidebar = state.use()
        return (
          <AppShell
            sidebar={sidebar}
            {...{ dir }}
            sidebarContent={
              <Sidebar
                renderFooter={() => (
                  <Tooltip content="Account menu" side={dir === 'rtl' ? 'left' : 'right'}>
                    <button
                      data-account=""
                      className="hn-interactive hn-state-layer w-full rounded-lg p-1"
                      onClick={clicked}
                    >
                      <Avatar name="User" />
                    </button>
                  </Tooltip>
                )}
              >
                <NavLink href="#overview" label="Overview">
                  Overview
                </NavLink>
              </Sidebar>
            }
          />
        )
      }
      mounted.push(await mount(<Harness />))
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
          .closest('[data-radix-popper-content-wrapper]')!
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
