import { describe, expect, it, beforeEach, vi } from 'vitest'
import { userEvent } from '@vitest/browser/context'
import { mount } from '@vue/test-utils'
import NavLink from './NavLink.vue'
import '../../../test/browser.css'

beforeEach(async () => {
  document.body.innerHTML = ''
  const park = document.createElement('div')
  park.style.cssText = 'position: fixed; bottom: 0; right: 0; width: 8px; height: 8px'
  document.body.appendChild(park)
  await userEvent.hover(park)
})

function attach() {
  const host = document.createElement('div')
  document.body.appendChild(host)
  return host
}

describe('选中墨真实上屏', () => {
  it('active 的状态层 ::after 以 accent 色显影到选中档,静止为 0', async () => {
    const rest = mount(NavLink, {
      attrs: { href: '/a' },
      slots: { default: () => '静止' },
      attachTo: attach(),
    })
    const active = mount(NavLink, {
      props: { active: true },
      attrs: { href: '/b' },
      slots: { default: () => '选中' },
      attachTo: attach(),
    })

    await vi.waitFor(() => {
      expect(getComputedStyle(active.find('a').element, '::after').opacity).toBe('0.14')
    })
    expect(getComputedStyle(rest.find('a').element, '::after').opacity).toBe('0')

    const probe = document.createElement('span')
    probe.style.color = 'var(--hn-accent)'
    document.body.appendChild(probe)
    expect(getComputedStyle(active.find('a').element, '::after').backgroundColor).toBe(
      getComputedStyle(probe).color,
    )
  })

  it('退选的墨全程保持 accent 淡出,色相交接推迟到不可见之后', async () => {
    const probe = document.createElement('span')
    probe.style.color = 'var(--hn-accent)'
    document.body.appendChild(probe)
    const accent = getComputedStyle(probe).color

    const w = mount(NavLink, {
      props: { active: true },
      attrs: { href: '/x' },
      slots: { default: () => '将退选' },
      attachTo: attach(),
    })
    await vi.waitFor(() =>
      expect(getComputedStyle(w.find('a').element, '::after').opacity).toBe('0.14'),
    )

    await w.setProps({ active: false })
    await new Promise(resolve => setTimeout(resolve, 80))
    const mid = getComputedStyle(w.find('a').element, '::after')
    expect(parseFloat(mid.opacity)).toBeLessThan(0.14)
    expect(mid.backgroundColor).toBe(accent)

    await vi.waitFor(() => {
      const s = getComputedStyle(w.find('a').element, '::after')
      expect(s.opacity).toBe('0')
      expect(s.backgroundColor).not.toBe(accent)
    })
  })

  it('选中项上的 hover 墨是叠加不是替换:0.14 + 0.06 = 0.2,对比只升不降', async () => {
    const active = mount(NavLink, {
      props: { active: true },
      attrs: { href: '/b' },
      slots: { default: () => '选中' },
      attachTo: attach(),
    })
    await userEvent.hover(active.find('a').element as HTMLElement)
    await vi.waitFor(() => {
      expect(getComputedStyle(active.find('a').element, '::after').opacity).toBe('0.2')
    })
  })
})
