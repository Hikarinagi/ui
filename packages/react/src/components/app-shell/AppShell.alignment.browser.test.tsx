import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { House } from 'lucide-react'
import { AppShell } from './AppShell'
import { Sidebar } from '../sidebar/Sidebar'
import { SidebarTrigger } from '../sidebar/SidebarTrigger'
import type { SidebarState } from '../sidebar/context'
import { NavLink } from '../nav-link/NavLink'
import { mount } from '../../../test/mount'
import { signal } from '../../../test/signal'
import '../../../test/browser.css'

const wrappers: Array<{ unmount: () => Promise<void> }> = []
beforeEach(async () => {
  await page.viewport(1280, 800)
})
afterEach(async () => {
  for (const wrapper of wrappers.splice(0)) await wrapper.unmount()
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
    const state = signal<SidebarState>('expanded')
    function Harness() {
      return (
        <AppShell
          sidebar={state.use()}
          onSidebarChange={value => (state.value = value)}
          data-density={density}
          {...{ dir }}
          header={<SidebarTrigger />}
          sidebarContent={
            <Sidebar renderWordmark={wordmark ? () => <span>Hina UI</span> : undefined}>
              <NavLink href="#home" label="Home" icon={<House />}>
                Home
              </NavLink>
            </Sidebar>
          }
        />
      )
    }
    const wrapper = await mount(<Harness />)
    wrappers.push(wrapper)
    const aside = wrapper.container.querySelector('aside')!
    const navIcon = wrapper.container.querySelector('aside nav a svg')!
    const toggleIcon = wrapper.container.querySelector('header button svg')!
    const toggle = wrapper.container.querySelector('header button') as HTMLElement
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
