import { describe, expect, it, beforeEach } from 'vitest'
import { render } from 'vitest-browser-react'
import { Statistic, type StatisticProps } from './Statistic'
import '../../../test/browser.css'

beforeEach(() => {
  document.body.innerHTML = ''
})

async function rows(props: Partial<StatisticProps>) {
  const host = document.createElement('div')
  document.body.appendChild(host)
  const screen = await render(<Statistic label="本月新增" value={1284} delta={0.12} {...props} />, {
    container: host,
  })
  const [, value, delta] = Array.from(
    host.querySelector('[data-hn-statistic] > div')!.children,
  ) as HTMLElement[]
  const heights = [value!.getBoundingClientRect().height, delta!.getBoundingClientRect().height]
  await screen.unmount()
  host.remove()
  return heights
}

describe('statistic · 加载骨架', () => {
  for (const size of ['sm', 'md', 'lg'] as const)
    it(`${size} 档加载前后数值行与变化率行的高度不变`, async () => {
      const loaded = await rows({ size })
      const loading = await rows({ size, loading: true })
      expect(loading[0]).toBeCloseTo(loaded[0]!, 1)
      expect(loading[1]).toBeCloseTo(loaded[1]!, 1)
    })
})
