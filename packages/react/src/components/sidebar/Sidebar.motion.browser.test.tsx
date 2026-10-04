import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { page } from 'vitest/browser'
import { Star } from 'lucide-react'
import { Avatar } from '../avatar/Avatar'
import { Inline } from '../inline/Inline'
import { AppShell } from '../app-shell/AppShell'
import { NavLink } from '../nav-link/NavLink'
import { Sidebar } from './Sidebar'
import { SidebarGroup } from './SidebarGroup'
import { SidebarLabel } from './SidebarLabel'
import type { SidebarState } from './context'
import { mount } from '../../../test/mount'
import { signal, tick, type Signal } from '../../../test/signal'
import '../../../test/browser.css'

const mounted: Array<{ unmount: () => Promise<void> }> = []

beforeEach(async () => {
  await page.viewport(1280, 800)
})

afterEach(async () => {
  for (const wrapper of mounted.splice(0)) await wrapper.unmount()
  document.body.innerHTML = ''
})

async function harness(initial: SidebarState = 'expanded', dir: 'ltr' | 'rtl' = 'ltr') {
  const state = signal<SidebarState>(initial)
  function Harness() {
    const sidebar = state.use()
    return (
      <AppShell
        sidebar={sidebar}
        {...{ dir }}
        sidebarContent={
          <Sidebar
            renderHeader={() => (
              <div className="flex flex-wrap items-center gap-2">
                <span data-logo="" className="size-8 shrink-0">
                  H
                </span>
                <SidebarLabel data-brand="">Hina UI workspace</SidebarLabel>
              </div>
            )}
            renderFooter={() => (
              <Inline wrap={false} gap="sm">
                <Avatar className="test-avatar" name="A" />
                <SidebarLabel className="shrink-0 whitespace-nowrap">
                  <button data-account="">Account settings</button>
                </SidebarLabel>
              </Inline>
            )}
          >
            <SidebarGroup label="Navigation">
              <NavLink href="#overview" label="Overview" active icon={<Star />}>
                Overview
              </NavLink>
              <NavLink href="#settings" label="Settings" icon={<Star />}>
                Settings
              </NavLink>
            </SidebarGroup>
          </Sidebar>
        }
      >
        <p>Content</p>
      </AppShell>
    )
  }
  mounted.push(await mount(<Harness />))
  return state
}

async function frames(state: Signal<SidebarState>, target: SidebarState) {
  const aside = document.querySelector('aside')!
  const read = () => ({
    width: aside.getBoundingClientRect().width,
    logo: aside.querySelector('[data-logo]')!.getBoundingClientRect().toJSON(),
    brand: aside.querySelector('[data-brand]')!.getBoundingClientRect().toJSON(),
    avatar: aside.querySelector('.test-avatar')!.getBoundingClientRect().toJSON(),
    link: aside.querySelector('a')!.getBoundingClientRect().toJSON(),
  })
  const initial = read()
  state.value = target
  await tick()
  const samples = []
  const deadline = performance.now() + 500
  do {
    await new Promise(requestAnimationFrame)
    samples.push(read())
  } while (performance.now() < deadline)
  return { initial, samples }
}

describe('sidebar collapse geometry', () => {
  it.each(['ltr', 'rtl'] as const)(
    'keeps logo, brand, avatar and expanded group entries in place throughout collapse (%s)',
    async dir => {
      const state = await harness('expanded', dir)
      const { initial, samples } = await frames(state, 'rail')
      expect(samples.some(sample => sample.width > 56 && sample.width < 256)).toBe(true)
      expect(samples.at(-1)!.width).toBe(56)
      for (const sample of samples) {
        expect(sample.logo).toEqual(initial.logo)
        expect(sample.brand).toEqual(initial.brand)
        expect(sample.avatar).toEqual(initial.avatar)
        expect(sample.link.y).toBe(initial.link.y)
        expect(sample.link.height).toBe(initial.link.height)
      }
    },
  )
})

describe('sidebar label and focus', () => {
  it('keeps content geometry stable on expansion and restores custom label content', async () => {
    const state = await harness('rail')
    const label = document.querySelector('[data-brand]') as HTMLElement
    const account = document.querySelector('[data-account]') as HTMLElement
    expect(label.getAttribute('aria-hidden')).toBe('true')
    expect(label.inert).toBe(true)
    account.focus()
    expect(document.activeElement).not.toBe(account)
    const { initial, samples } = await frames(state, 'expanded')
    expect(samples.at(-1)!.width).toBe(256)
    for (const sample of samples) {
      expect(sample.logo).toEqual(initial.logo)
      expect(sample.brand).toEqual(initial.brand)
      expect(sample.avatar).toEqual(initial.avatar)
      expect(sample.link.y).toBe(initial.link.y)
    }
    expect(getComputedStyle(label).opacity).toBe('1')
    expect(label.hasAttribute('aria-hidden')).toBe(false)
    account.focus()
    expect(document.activeElement).toBe(account)
  })

  it('excludes the entire hidden sidebar from keyboard focus and restores it on reopening', async () => {
    const state = await harness()
    await frames(state, 'hidden')
    const sidebar = document.querySelector('aside')!
    const link = sidebar.querySelector('a')!
    expect(sidebar.inert).toBe(true)
    expect(getComputedStyle(sidebar).visibility).toBe('hidden')
    link.focus()
    expect(document.activeElement).not.toBe(link)
    await frames(state, 'expanded')
    link.focus()
    expect(document.activeElement).toBe(link)
  })

  it('reverses an unfinished collapse without jumping to either endpoint', async () => {
    const state = await harness()
    const sidebar = document.querySelector('aside')!
    sidebar.getBoundingClientRect()
    state.value = 'rail'
    await tick()
    let width = 256
    do {
      await new Promise(requestAnimationFrame)
      width = sidebar.getBoundingClientRect().width
    } while (width > 160)
    state.value = 'expanded'
    await tick()
    expect(Math.abs(sidebar.getBoundingClientRect().width - width)).toBeLessThan(2)
    await new Promise(requestAnimationFrame)
    await vi.waitFor(() => {
      expect(sidebar.getBoundingClientRect().width).toBe(256)
      expect(getComputedStyle(sidebar.querySelector('[data-brand]')!).opacity).toBe('1')
    })
  })
})
