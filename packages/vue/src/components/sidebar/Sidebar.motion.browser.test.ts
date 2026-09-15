import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { page } from 'vitest/browser'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'
import { Star } from '@lucide/vue'
import AppShell from '../app-shell/AppShell.vue'
import NavLink from '../nav-link/NavLink.vue'
import Sidebar from './Sidebar.vue'
import SidebarGroup from './SidebarGroup.vue'
import SidebarLabel from './SidebarLabel.vue'
import type { SidebarState } from './context'
import '../../../test/browser.css'

const mounted: VueWrapper[] = []

beforeEach(async () => {
  await page.viewport(1280, 800)
})

afterEach(() => {
  mounted.splice(0).forEach(wrapper => wrapper.unmount())
  document.body.innerHTML = ''
})

function harness(initial: SidebarState = 'expanded', dir: 'ltr' | 'rtl' = 'ltr') {
  const state = ref<SidebarState>(initial)
  const wrapper = mount(
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
                  header: () =>
                    h('div', { class: 'flex flex-wrap items-center gap-2' }, [
                      h('span', { 'data-logo': '', class: 'size-8 shrink-0' }, 'H'),
                      h(SidebarLabel, { 'data-brand': '' }, () => 'Hina UI workspace'),
                    ]),
                  default: () =>
                    h(SidebarGroup, { label: 'Navigation' }, () => [
                      h(
                        NavLink,
                        { href: '#overview', label: 'Overview', active: true },
                        {
                          icon: () => h(Star),
                          default: () => 'Overview',
                        },
                      ),
                      h(
                        NavLink,
                        { href: '#settings', label: 'Settings' },
                        {
                          icon: () => h(Star),
                          default: () => 'Settings',
                        },
                      ),
                    ]),
                  footer: () =>
                    h('div', { class: 'flex flex-wrap items-center gap-2' }, [
                      h('span', { 'data-avatar': '', class: 'size-8 shrink-0' }, 'A'),
                      h(SidebarLabel, {}, () =>
                        h('button', { 'data-account': '' }, 'Account settings'),
                      ),
                    ]),
                },
              ),
            default: () => h('p', 'Content'),
          },
        ),
    }),
    { attachTo: document.body },
  )
  mounted.push(wrapper)
  return state
}

async function frames(state: ReturnType<typeof harness>, target: SidebarState) {
  const aside = document.querySelector('aside')!
  const read = () => ({
    width: aside.getBoundingClientRect().width,
    logo: aside.querySelector('[data-logo]')!.getBoundingClientRect().toJSON(),
    brand: aside.querySelector('[data-brand]')!.getBoundingClientRect().toJSON(),
    avatar: aside.querySelector('[data-avatar]')!.getBoundingClientRect().toJSON(),
    link: aside.querySelector('a')!.getBoundingClientRect().toJSON(),
  })
  const initial = read()
  state.value = target
  await nextTick()
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
      const state = harness('expanded', dir)
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
    const state = harness('rail')
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
    const state = harness()
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
    const state = harness()
    const sidebar = document.querySelector('aside')!
    sidebar.getBoundingClientRect()
    state.value = 'rail'
    await nextTick()
    let width = 256
    do {
      await new Promise(requestAnimationFrame)
      width = sidebar.getBoundingClientRect().width
    } while (width > 160)
    state.value = 'expanded'
    await nextTick()
    expect(Math.abs(sidebar.getBoundingClientRect().width - width)).toBeLessThan(2)
    await new Promise(requestAnimationFrame)
    await vi.waitFor(() => {
      expect(sidebar.getBoundingClientRect().width).toBe(256)
      expect(getComputedStyle(sidebar.querySelector('[data-brand]')!).opacity).toBe('1')
    })
  })
})
