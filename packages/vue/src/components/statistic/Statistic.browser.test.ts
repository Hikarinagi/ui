import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Statistic from './Statistic.vue'
import '../../../test/browser.css'

beforeEach(() => {
  document.body.innerHTML = ''
})

function rows(props: Record<string, unknown>) {
  const wrapper = mount(Statistic, {
    props: { label: '本月新增', value: 1284, delta: 0.12, ...props },
    attachTo: document.body,
  })
  const [, value, delta] = Array.from(
    wrapper.element.querySelector(':scope > div')!.children,
  ) as HTMLElement[]
  const heights = [value!.getBoundingClientRect().height, delta!.getBoundingClientRect().height]
  wrapper.unmount()
  return heights
}

describe('statistic · 加载骨架', () => {
  for (const size of ['sm', 'md', 'lg'] as const)
    it(`${size} 档加载前后数值行与变化率行的高度不变`, () => {
      const loaded = rows({ size })
      const loading = rows({ size, loading: true })
      expect(loading[0]).toBeCloseTo(loaded[0]!, 1)
      expect(loading[1]).toBeCloseTo(loaded[1]!, 1)
    })
})
