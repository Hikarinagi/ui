import { describe, expect, it, vi } from 'vitest'
import { useId } from 'react'
import { Highlight } from './Highlight'
import { Tabs } from '../tabs/Tabs'
import { TabsList } from '../tabs/TabsList'
import { TabsTrigger } from '../tabs/TabsTrigger'
import { SegmentedControl } from '../segmented-control/SegmentedControl'
import { mount } from '../../../test/mount'
import { signal, tick } from '../../../test/signal'
import '../../../test/browser.css'

const frame = () => new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
const options = [
  { value: 'a', label: 'First' },
  { value: 'b', label: 'A wider second item' },
]

async function mountControl(
  component: 'underline' | 'soft' | 'segmented',
  orientation: 'horizontal' | 'vertical',
) {
  const state = signal({ value: 'a', offset: 0 })
  function Harness() {
    const current = state.use()
    return (
      <div
        style={{
          width: '400px',
          marginTop: orientation === 'horizontal' ? current.offset + 'px' : '0',
          marginLeft: orientation === 'vertical' ? current.offset + 'px' : '0',
        }}
      >
        {component === 'segmented' ? (
          <SegmentedControl value={current.value} orientation={orientation} options={options} />
        ) : (
          <Tabs value={current.value} variant={component} orientation={orientation}>
            <TabsList label="Tabs">
              {options.map(option => (
                <TabsTrigger key={option.value} value={option.value}>
                  {option.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}
      </div>
    )
  }
  const wrapper = await mount(<Harness />)
  return {
    state,
    highlight: () => wrapper.container.querySelector('[data-hn-highlight]') as HTMLElement,
    items: [
      ...wrapper.container.querySelectorAll<HTMLElement>(
        component === 'segmented' ? '[data-hn-segmented-control] > button' : '[role="tab"]',
      ),
    ],
  }
}

describe('Highlight 动画轴向', () => {
  describe.each(['underline', 'soft', 'segmented'] as const)('%s', component => {
    it.each(['horizontal', 'vertical'] as const)(
      '%s 排列在容器跨轴移动时只沿主轴切换，反向切换保持贴合',
      async orientation => {
        const { state, highlight, items } = await mountControl(component, orientation)
        const main = orientation === 'horizontal' ? 'left' : 'top'
        const cross = orientation === 'horizontal' ? 'bottom' : 'right'
        await frame()
        await frame()
        const gap =
          items[0]!.getBoundingClientRect()[cross] - highlight().getBoundingClientRect()[cross]

        for (const [value, offset, targetIndex] of [
          ['b', 120, 1],
          ['a', 30, 0],
        ] as const) {
          const start = highlight().getBoundingClientRect()[main]
          state.value = { value, offset }
          await tick()
          const target = items[targetIndex]!.getBoundingClientRect()

          await vi.waitFor(() => {
            const position = highlight().getBoundingClientRect()[main]
            expect(position).toBeGreaterThan(Math.min(start, target[main]) + 1)
            expect(position).toBeLessThan(Math.max(start, target[main]) - 1)
          })
          expect(highlight().getBoundingClientRect()[cross]).toBeCloseTo(target[cross] - gap, 1)

          await vi.waitFor(() =>
            expect(highlight().getBoundingClientRect()[main]).toBeCloseTo(target[main], 1),
          )
          expect(highlight().getBoundingClientRect()[cross]).toBeCloseTo(target[cross] - gap, 1)
        }
      },
    )
  })

  it('横向 Tabs 仅改变容器纵向位置时，高亮立即跟随', async () => {
    const { state, highlight, items } = await mountControl('soft', 'horizontal')
    await frame()
    await frame()
    state.value = { ...state.value, offset: 120 }
    await tick()

    for (let index = 0; index < 20; index++) {
      await frame()
      expect(highlight().getBoundingClientRect().top).toBeCloseTo(
        items[0]!.getBoundingClientRect().top,
        1,
      )
    }
  })

  describe.each([false, true])('共享布局 %s', shared => {
    it.each([undefined, 'x', 'y'] as const)('axis=%s 约束位移并保留宽高动画', async axis => {
      function Scene({ moved }: { moved: boolean }) {
        const id = useId()
        return (
          <div style={{ position: 'relative', width: '400px', height: '300px' }}>
            <Highlight
              key={shared ? String(moved) : undefined}
              id={shared ? id : undefined}
              axis={axis}
              style={{
                position: 'absolute',
                left: moved ? '160px' : '0',
                top: moved ? '120px' : '0',
                width: moved ? '120px' : '60px',
                height: moved ? '70px' : '30px',
              }}
            />
          </div>
        )
      }
      const wrapper = await mount(<Scene moved={false} />)
      const box = () =>
        wrapper.container.querySelector('[data-hn-highlight]')!.getBoundingClientRect()
      await frame()
      await frame()
      const start = box()
      await wrapper.rerender(<Scene moved={true} />)

      await vi.waitFor(() => {
        expect(box().width).toBeGreaterThan(61)
        expect(box().width).toBeLessThan(119)
      })
      const during = box()
      const centerX = during.left + during.width / 2
      const centerY = during.top + during.height / 2
      const targetX = start.left + 220
      const targetY = start.top + 155
      expect(during.height).toBeGreaterThan(31)
      expect(during.height).toBeLessThan(69)

      if (axis === 'y') expect(centerX).toBeCloseTo(targetX, 1)
      else {
        expect(centerX).toBeGreaterThan(start.left + start.width / 2 + 1)
        expect(centerX).toBeLessThan(targetX - 1)
      }
      if (axis === 'x') expect(centerY).toBeCloseTo(targetY, 1)
      else {
        expect(centerY).toBeGreaterThan(start.top + start.height / 2 + 1)
        expect(centerY).toBeLessThan(targetY - 1)
      }

      await vi.waitFor(() => {
        expect(box().left).toBeCloseTo(start.left + 160, 1)
        expect(box().top).toBeCloseTo(start.top + 120, 1)
        expect(box().width).toBeCloseTo(120, 1)
        expect(box().height).toBeCloseTo(70, 1)
      })
    })
  })
})
