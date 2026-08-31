import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { h } from 'vue'
import Badge from './Badge.vue'
import '../../../test/browser.css'

let mounted: VueWrapper[] = []

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(() => {
  mounted.forEach(w => w.unmount())
  mounted = []
})

function attach() {
  const host = document.createElement('div')
  host.style.cssText = 'padding: 24px'
  document.body.appendChild(host)
  return host
}

const anchor = (round = false) =>
  h('span', {
    'data-anchor': '',
    style: `display:inline-block;width:40px;height:40px;background:#ddd;${round ? 'border-radius:9999px' : ''}`,
  })

function mountBadge(props: Record<string, unknown>, round = false) {
  const w = mount(Badge, {
    props,
    slots: { default: () => anchor(round) },
    global: { stubs: { transition: false } },
    attachTo: attach(),
  })
  mounted.push(w)
  const host = w.find('[data-anchor]').element as HTMLElement
  const pill = [...w.findAll('span')]
    .map(s => s.element)
    .find(
      el => el !== w.element && !el.hasAttribute('data-anchor') && el.textContent?.trim(),
    ) as HTMLElement
  return { w, host, pill }
}

const center = (el: HTMLElement) => {
  const r = el.getBoundingClientRect()
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
}

describe('badge · 锚定徽标', () => {
  it('rect 宿主:徽标中心压在右上角点;正圆、实底、surface 描边', () => {
    const { host, pill } = mountBadge({ content: 5 })
    const c = center(pill)
    const r = host.getBoundingClientRect()
    expect(Math.abs(c.x - r.right)).toBeLessThan(2)
    expect(Math.abs(c.y - r.top)).toBeLessThan(2)
    const cs = getComputedStyle(pill)
    expect(pill.offsetWidth).toBe(pill.offsetHeight)
    expect(parseFloat(cs.borderTopLeftRadius)).toBeGreaterThanOrEqual(pill.offsetHeight / 2)
    expect(cs.backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
    expect(cs.boxShadow).not.toBe('none')
  })

  it('circle 宿主:角点内收,徽标中心落在圆内角', () => {
    const { host, pill } = mountBadge({ content: 5, shape: 'circle' }, true)
    const c = center(pill)
    const r = host.getBoundingClientRect()
    expect(c.x).toBeLessThan(r.right - 2)
    expect(c.y).toBeGreaterThan(r.top + 2)
  })

  it('多字自然长成胶囊;bottom-start 落在左下', () => {
    const { pill } = mountBadge({ content: 'NEW', placement: 'bottom-start' })
    expect(pill.offsetWidth).toBeGreaterThan(pill.offsetHeight)
    const { host, pill: p2 } = mountBadge({ content: 7, placement: 'bottom-start' })
    const c = center(p2)
    const r = host.getBoundingClientRect()
    expect(Math.abs(c.x - r.left)).toBeLessThan(2)
    expect(Math.abs(c.y - r.bottom)).toBeLessThan(2)
  })

  it('有进必有出:内容归零时徽标走出场过渡再卸载', async () => {
    const { w } = mountBadge({ content: 5 })
    const before = w.findAll('span').length
    await w.setProps({ content: 0 })
    expect(w.findAll('span').length).toBe(before)
    await vi.waitFor(() => expect(w.findAll('span').length).toBe(before - 1), { timeout: 1500 })
  })
})
