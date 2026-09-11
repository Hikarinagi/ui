import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { h, nextTick, reactive, useId } from 'vue'
import Highlight from './Highlight.vue'
import SegmentedControl from '../segmented-control/SegmentedControl.vue'
import Tabs from '../tabs/Tabs.vue'
import TabsList from '../tabs/TabsList.vue'
import TabsTrigger from '../tabs/TabsTrigger.vue'
import '../../../test/browser.css'

const mounted: VueWrapper[] = []

afterEach(() => {
  mounted.forEach(wrapper => wrapper.unmount())
  mounted.length = 0
  document.body.innerHTML = ''
})

const frame = () => new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
const options = [
  { value: 'a', label: 'First' },
  { value: 'b', label: 'A wider second item' },
]

function mountControl(
  component: 'underline' | 'soft' | 'segmented',
  orientation: 'horizontal' | 'vertical',
) {
  const state = reactive({ value: 'a', offset: 0 })
  const wrapper = mount(
    {
      setup: () => () =>
        h(
          'div',
          {
            style: {
              width: '400px',
              marginTop: orientation === 'horizontal' ? state.offset + 'px' : '0',
              marginLeft: orientation === 'vertical' ? state.offset + 'px' : '0',
            },
          },
          [
            component === 'segmented'
              ? h(SegmentedControl, { modelValue: state.value, orientation, options })
              : h(Tabs, { modelValue: state.value, variant: component, orientation }, () =>
                  h(TabsList, { label: 'Tabs' }, () =>
                    options.map(option =>
                      h(TabsTrigger, { value: option.value }, () => option.label),
                    ),
                  ),
                ),
          ],
        ),
    },
    { attachTo: document.body },
  )
  mounted.push(wrapper)
  return {
    state,
    highlight: () => wrapper.get('[data-hn-highlight]').element as HTMLElement,
    items: wrapper.findAll(
      component === 'segmented' ? '[data-hn-segmented-control] > button' : '[role="tab"]',
    ),
  }
}

describe('Highlight 动画轴向', () => {
  describe.each(['underline', 'soft', 'segmented'] as const)('%s', component => {
    it.each(['horizontal', 'vertical'] as const)(
      '%s 排列在容器跨轴移动时只沿主轴切换，反向切换保持贴合',
      async orientation => {
        const { state, highlight, items } = mountControl(component, orientation)
        const main = orientation === 'horizontal' ? 'left' : 'top'
        const cross = orientation === 'horizontal' ? 'bottom' : 'right'
        await frame()
        await frame()
        const gap =
          items[0]!.element.getBoundingClientRect()[cross] -
          highlight().getBoundingClientRect()[cross]

        for (const [value, offset, targetIndex] of [
          ['b', 120, 1],
          ['a', 30, 0],
        ] as const) {
          const start = highlight().getBoundingClientRect()[main]
          state.offset = offset
          state.value = value
          await nextTick()
          const target = items[targetIndex]!.element.getBoundingClientRect()

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
    const { state, highlight, items } = mountControl('soft', 'horizontal')
    await frame()
    await frame()
    state.offset = 120
    await nextTick()

    for (let index = 0; index < 20; index++) {
      await frame()
      expect(highlight().getBoundingClientRect().top).toBeCloseTo(
        items[0]!.element.getBoundingClientRect().top,
        1,
      )
    }
  })

  describe.each([false, true])('共享布局 %s', shared => {
    it.each([undefined, 'x', 'y'] as const)('axis=%s 约束位移并保留宽高动画', async axis => {
      const state = reactive({ moved: false })
      const wrapper = mount(
        {
          setup() {
            const id = shared ? useId() : undefined
            return () =>
              h('div', { style: { position: 'relative', width: '400px', height: '300px' } }, [
                h(Highlight, {
                  key: shared ? String(state.moved) : undefined,
                  id,
                  axis,
                  style: {
                    position: 'absolute',
                    left: state.moved ? '160px' : '0',
                    top: state.moved ? '120px' : '0',
                    width: state.moved ? '120px' : '60px',
                    height: state.moved ? '70px' : '30px',
                  },
                }),
              ])
          },
        },
        { attachTo: document.body },
      )
      mounted.push(wrapper)
      const box = () => wrapper.get('[data-hn-highlight]').element.getBoundingClientRect()
      await frame()
      await frame()
      const start = box()
      state.moved = true
      await nextTick()

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
