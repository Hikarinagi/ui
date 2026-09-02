import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { h } from 'vue'
import Indicator from './Indicator.vue'
import Badge from '../badge/Badge.vue'
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

function mountDot(props: Record<string, unknown> = {}) {
  const w = mount(Indicator, { props, attachTo: attach() })
  mounted.push(w)
  return w.element as HTMLElement
}

function toMs(value: string) {
  return value.endsWith('ms') ? parseFloat(value) : parseFloat(value) * 1000
}

describe('indicator · 状态点', () => {
  it('三档尺寸 6 / 8 / 10，恒圆', () => {
    expect(mountDot({ size: 'sm' }).offsetHeight).toBe(6)
    const md = mountDot()
    expect(md.offsetHeight).toBe(8)
    expect(md.offsetWidth).toBe(8)
    expect(mountDot({ size: 'lg' }).offsetHeight).toBe(10)
    expect(parseFloat(getComputedStyle(md).borderTopLeftRadius)).toBeGreaterThanOrEqual(4)
  })

  it('语义 tone 各着各色，默认中性', () => {
    const neutral = getComputedStyle(mountDot()).backgroundColor
    const success = getComputedStyle(mountDot({ tone: 'success' })).backgroundColor
    const danger = getComputedStyle(mountDot({ tone: 'danger' })).backgroundColor
    expect(neutral).not.toBe('rgba(0, 0, 0, 0)')
    expect(success).not.toBe(neutral)
    expect(success).not.toBe(danger)
  })

  it('pulse 的扩散层同色、跑 hn-ping、时长取 token', () => {
    const dot = mountDot({ tone: 'success', pulse: true })
    const ping = dot.querySelector('.hn-ping') as HTMLElement
    const cs = getComputedStyle(ping)
    expect(cs.backgroundColor).toBe(getComputedStyle(dot).backgroundColor)
    expect(cs.animationName).toBe('hn-ping')
    expect(cs.animationIterationCount).toBe('infinite')
    const token = getComputedStyle(document.documentElement).getPropertyValue('--hn-pulse-duration')
    expect(toMs(cs.animationDuration)).toBe(toMs(token.trim()))
  })

  it('钉进 bare 的 Badge：气泡不画底，尺寸就是圆点', () => {
    const w = mount(Badge, {
      props: { content: 'online', bare: true, label: '在线', placement: 'bottom-end' },
      slots: {
        default: () => h('span', { style: 'display:inline-block;width:40px;height:40px' }),
        content: () => h(Indicator, { tone: 'success' }),
      },
      attachTo: attach(),
    })
    mounted.push(w)
    const bubble = w.find('.absolute').element as HTMLElement
    expect(getComputedStyle(bubble).backgroundColor).toBe('rgba(0, 0, 0, 0)')
    expect(bubble.offsetHeight).toBe(8)
    expect(bubble.offsetWidth).toBe(8)
    expect(getComputedStyle(bubble).boxShadow).not.toBe('none')
  })
})
