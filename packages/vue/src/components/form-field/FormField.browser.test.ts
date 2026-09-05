import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import FormField from './FormField.vue'
import Input from '../input/Input.vue'
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
  host.style.cssText = 'width: 320px; padding: 40px'
  document.body.appendChild(host)
  return host
}

function ms(value: string) {
  const trimmed = value.trim()
  return trimmed.endsWith('ms') ? parseFloat(trimmed) : parseFloat(trimmed) * 1000
}

function frame() {
  return new Promise(resolve => requestAnimationFrame(resolve))
}

async function settle(read: () => number) {
  const samples: number[] = []
  let still = 0
  while (still < 3 && samples.length < 90) {
    const value = read()
    const last = samples[samples.length - 1]
    still = last !== undefined && Math.abs(value - last) < 0.01 ? still + 1 : 0
    samples.push(value)
    await frame()
  }
  return samples
}

function between(samples: number[], low: number, high: number) {
  return samples.filter(value => value > low + 0.5 && value < high - 0.5)
}

function monotonic(samples: number[], direction: 1 | -1) {
  return samples.every(
    (value, index) => index === 0 || (value - samples[index - 1]!) * direction >= -0.01,
  )
}

describe('FormField', () => {
  it('错误信息出现与消失时高度连续变化，不跳变', async () => {
    const w = mount(FormField, {
      attachTo: attach(),
      props: { label: '邮箱' },
      slots: { default: () => h(Input) },
      global: { stubs: { transition: false } },
    })
    mounted.push(w)
    const root = w.element as HTMLElement
    const height = () => root.getBoundingClientRect().height
    const before = height()

    await w.setProps({ error: '邮箱格式不正确' })
    await nextTick()
    const collapse = root.querySelector<HTMLElement>('[data-hn-form-field-message]')!
    const opening = await settle(height)
    const after = opening[opening.length - 1]!
    expect(after).toBeGreaterThan(before + 10)
    expect(between(opening, before, after).length).toBeGreaterThanOrEqual(4)
    expect(monotonic(opening, 1)).toBe(true)

    await w.setProps({ error: undefined })
    await nextTick()
    expect(root.contains(collapse)).toBe(true)
    await frame()
    await frame()
    const fast = ms(getComputedStyle(root).getPropertyValue('--hn-duration-fast'))
    const durations = getComputedStyle(collapse).transitionDuration.split(',').map(ms)
    expect(durations).toEqual([fast, fast, fast, 0])
    const closing = await settle(height)
    expect(closing[closing.length - 1]).toBeCloseTo(before, 0)
    expect(between(closing, before, after).length).toBeGreaterThanOrEqual(4)
    expect(monotonic(closing, -1)).toBe(true)
    expect(root.contains(collapse)).toBe(false)
  })
})
