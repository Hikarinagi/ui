import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import Callout from './Callout.vue'
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
  document.body.appendChild(host)
  return host
}

function mountCallout(props: Record<string, unknown> = {}, text = '正文内容。') {
  const w = mount(Callout, { props, slots: { default: () => text }, attachTo: attach() })
  mounted.push(w)
  return w
}

describe('callout · 文档提示块', () => {
  it('默认中性:role=note、subtle 底、带图标与正文', () => {
    const w = mountCallout({ title: '备注' })
    const el = w.element as HTMLElement
    expect(el.getAttribute('role')).toBe('note')
    expect(getComputedStyle(el).backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
    expect(w.find('svg').exists()).toBe(true)
    expect(el.textContent).toContain('备注')
    expect(el.textContent).toContain('正文内容。')
  })

  it('六 tone 各着各底,图标随 tone 换色换形', () => {
    const neutral = mountCallout()
    const warning = mountCallout({ tone: 'warning' })
    const danger = mountCallout({ tone: 'danger' })

    const bg = (w: VueWrapper) => getComputedStyle(w.element as HTMLElement).backgroundColor
    expect(bg(warning)).not.toBe(bg(neutral))
    expect(bg(danger)).not.toBe(bg(warning))

    const iconHtml = (w: VueWrapper) => w.find('svg').element.innerHTML
    expect(iconHtml(warning)).not.toBe(iconHtml(danger))
    expect(getComputedStyle(warning.find('svg').element).color).not.toBe(
      getComputedStyle(danger.find('svg').element).color,
    )
  })

  it('icon=false 无图标;#icon 槽可整体替换', () => {
    const off = mountCallout({ icon: false })
    expect(off.find('svg').exists()).toBe(false)

    const custom = mount(Callout, {
      slots: { default: () => '文', icon: () => '☆' },
      attachTo: attach(),
    })
    mounted.push(custom)
    expect(custom.find('svg').exists()).toBe(false)
    expect(custom.text()).toContain('☆')
  })
})
