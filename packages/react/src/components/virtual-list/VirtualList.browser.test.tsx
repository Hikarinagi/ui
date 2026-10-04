import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { render } from 'vitest-browser-react'
import type { ReactNode } from 'react'
import { VirtualList } from './VirtualList'
import { Collapsible } from '../collapsible/Collapsible'
import { CollapsibleTrigger } from '../collapsible/CollapsibleTrigger'
import { CollapsibleContent } from '../collapsible/CollapsibleContent'
import type { VirtualListExpose, VirtualListProps, VirtualListRange } from './types'
import { expectNoA11yViolations } from '../../../test/axe'
import { signal } from '../../../test/signal'
import '../../../test/browser.css'

type Item = { id: number; label: string }
type Slot = (props: { item: Item; index: number }) => ReactNode
const mounted: Array<{ unmount: () => Promise<void> | void }> = []
const items: Item[] = Array.from({ length: 10000 }, (_, id) => ({ id, label: `Item ${id}` }))
afterEach(async () => {
  for (const w of mounted.splice(0)) await w.unmount()
  document.body.innerHTML = ''
})

interface Wrapper {
  element: HTMLElement
  api: () => VirtualListExpose
  ranges: VirtualListRange[]
  setProps: (props: Partial<VirtualListProps<Item>>) => Promise<void>
}

async function create(
  props: Partial<VirtualListProps<Item>> = {},
  slot?: Slot,
  container?: HTMLElement,
): Promise<Wrapper> {
  const state = signal(props)
  const handle: { current: VirtualListExpose | null } = { current: null }
  const ranges: VirtualListRange[] = []
  function Harness() {
    const current = state.use()
    return (
      <VirtualList<Item>
        ref={value => {
          handle.current = value
        }}
        items={items}
        getKey={item => item.id}
        estimateSize={40}
        dynamic={false}
        height={200}
        label="Items"
        style={{ width: '400px' }}
        {...current}
        onRangeChange={range => ranges.push(range)}
      >
        {slot ?? (({ item }) => <span>{item.label}</span>)}
      </VirtualList>
    )
  }
  const host = container ?? document.body.appendChild(document.createElement('div'))
  const screen = await render(<Harness />, { container: host })
  mounted.push(screen)
  return {
    element: host.firstElementChild as HTMLElement,
    api: () => handle.current!,
    ranges,
    setProps: async next => {
      state.value = { ...state.value, ...next }
      await new Promise(resolve => setTimeout(resolve, 0))
    },
  }
}

async function ready(wrapper: Wrapper) {
  await vi.waitFor(() =>
    expect(wrapper.api().viewport?.hasAttribute('data-overlayscrollbars-viewport')).toBe(true),
  )
  return wrapper.api().viewport!
}

function row(wrapper: Wrapper, index: number) {
  return wrapper.element.querySelector<HTMLElement>(`li[data-index="${index}"]`)
}
const exists = (wrapper: Wrapper, index: number) => row(wrapper, index) !== null
const lis = (wrapper: Wrapper) => wrapper.element.querySelectorAll('li')

describe('VirtualList browser behavior', () => {
  it('keeps a ten-thousand-item list bounded and scrolls to an exact index', async () => {
    const wrapper = await create()
    const viewport = await ready(wrapper)
    expect(lis(wrapper).length).toBeLessThan(25)
    expect(viewport.scrollHeight).toBe(400000)
    wrapper.api().scrollToIndex(5000, { align: 'start' })
    await vi.waitFor(() => expect(exists(wrapper, 5000)).toBe(true))
    await vi.waitFor(() => expect(Math.abs(viewport.scrollTop - 200000)).toBeLessThan(1))
    expect(lis(wrapper).length).toBeLessThan(25)
    expect(row(wrapper, 5000)!.getAttribute('aria-posinset')).toBe('5001')
    expect(wrapper.ranges.at(-1)).toMatchObject({ startIndex: 5000 })
    wrapper.api().scrollToOffset(0)
    await vi.waitFor(() => expect(viewport.scrollTop).toBe(0))
    await expectNoA11yViolations(wrapper.element)
  })

  it('queues scrolling until the ScrollArea viewport is ready', async () => {
    const wrapper = await create()
    wrapper.api().scrollToIndex(20, { align: 'center' })
    const viewport = await ready(wrapper)
    await vi.waitFor(() => expect(viewport.scrollTop).toBe(720))
  })

  it('measures dynamic heights, gaps, and asynchronous expansion without overlapping rows', async () => {
    const expanded = signal(false)
    function Row({ index }: { index: number }) {
      const open = expanded.use()
      return <div style={{ height: `${index === 0 && open ? 150 : 50}px` }}>{`Row ${index}`}</div>
    }
    const wrapper = await create(
      { dynamic: true, gap: 8, paddingStart: 12, paddingEnd: 16 },
      ({ index }) => <Row index={index} />,
    )
    const viewport = await ready(wrapper)
    await vi.waitFor(() =>
      expect(
        row(wrapper, 1)!.getBoundingClientRect().top -
          row(wrapper, 0)!.getBoundingClientRect().bottom,
      ).toBe(8),
    )
    expect(
      row(wrapper, 0)!.getBoundingClientRect().top - viewport.getBoundingClientRect().top,
    ).toBe(12)
    expanded.value = true
    await vi.waitFor(() => expect(row(wrapper, 0)!.getBoundingClientRect().height).toBe(150))
    await vi.waitFor(() =>
      expect(
        row(wrapper, 1)!.getBoundingClientRect().top -
          row(wrapper, 0)!.getBoundingClientRect().bottom,
      ).toBe(8),
    )
    wrapper.api().scrollToIndex(200, { align: 'start' })
    await vi.waitFor(() => expect(exists(wrapper, 200)).toBe(true))
    await vi.waitFor(() =>
      expect(
        Math.abs(
          row(wrapper, 200)!.getBoundingClientRect().top - viewport.getBoundingClientRect().top,
        ),
      ).toBeLessThan(2),
    )
  })

  it('remeasures wrapped content when the viewport becomes narrower', async () => {
    const wrapper = await create({ dynamic: true }, ({ item }) => (
      <p style={{ margin: '0', lineHeight: '24px' }}>
        {`${item.label} ${'Text wraps across lines. '.repeat(8)}`}
      </p>
    ))
    await ready(wrapper)
    const before = row(wrapper, 0)!.getBoundingClientRect().height
    await wrapper.setProps({ style: { width: '220px' } })
    await vi.waitFor(() =>
      expect(row(wrapper, 0)!.getBoundingClientRect().height).toBeGreaterThan(before),
    )
    await vi.waitFor(() =>
      expect(
        Math.abs(
          row(wrapper, 1)!.getBoundingClientRect().top -
            row(wrapper, 0)!.getBoundingClientRect().bottom,
        ),
      ).toBeLessThan(1),
    )
  })

  it('keeps adjacent items aligned throughout expand and collapse animations', async () => {
    const wrapper = await create({ dynamic: true, estimateSize: 40 }, ({ item }) => (
      <Collapsible>
        <CollapsibleTrigger>{item.label}</CollapsibleTrigger>
        <CollapsibleContent>
          <div style={{ height: '160px' }}>Details</div>
        </CollapsibleContent>
      </Collapsible>
    ))
    await ready(wrapper)
    const first = row(wrapper, 0)!
    const second = row(wrapper, 1)!
    const trigger = first.querySelector('button')!
    for (const open of [true, false]) {
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 0))
      const gaps = await new Promise<number[]>(resolve => {
        const samples: number[] = []
        function sample() {
          setTimeout(() => {
            samples.push(second.getBoundingClientRect().top - first.getBoundingClientRect().bottom)
            const running = first
              .getAnimations({ subtree: true })
              .some(
                animation =>
                  animation.playState === 'running' &&
                  (animation.effect as KeyframeEffect | null)?.target instanceof Element &&
                  ((animation.effect as KeyframeEffect).target as Element).classList.contains(
                    'hn-anim-collapse',
                  ),
              )
            if (running) requestAnimationFrame(sample)
            else resolve(samples)
          }, 0)
        }
        requestAnimationFrame(sample)
      })
      expect(trigger.getAttribute('aria-expanded')).toBe(String(open))
      expect(gaps.length).toBeGreaterThan(2)
      expect(Math.max(...gaps.map(Math.abs))).toBeLessThan(1)
    }
  })

  it('retains a focused input outside the window and releases it after focus leaves', async () => {
    const wrapper = await create({}, ({ item }) => <input aria-label={item.label} />)
    const viewport = await ready(wrapper)
    const input = row(wrapper, 0)!.querySelector('input')!
    input.focus()
    input.value = 'Uncommitted text'
    viewport.scrollTop = 20000
    viewport.dispatchEvent(new Event('scroll'))
    await vi.waitFor(() => expect(exists(wrapper, 500)).toBe(true))
    expect(document.activeElement).toBe(input)
    expect(input.isConnected).toBe(true)
    expect(lis(wrapper).length).toBeLessThan(25)
    expect(
      Math.abs(
        row(wrapper, 500)!.getBoundingClientRect().top - viewport.getBoundingClientRect().top,
      ),
    ).toBeLessThan(1)
    viewport.focus({ preventScroll: true })
    await vi.waitFor(() => expect(input.isConnected).toBe(false))
  })

  it('preserves keyed DOM and edited input state when items are reordered', async () => {
    const wrapper = await create({ items: items.slice(0, 4) }, ({ item }) => (
      <input aria-label={item.label} />
    ))
    await ready(wrapper)
    const input = row(wrapper, 0)!.querySelector('input')!
    input.value = 'Keep this'
    await wrapper.setProps({ items: [items[1]!, items[0]!, items[2]!, items[3]!] })
    expect(row(wrapper, 1)!.querySelector('input')).toBe(input)
    expect(input.value).toBe('Keep this')
  })

  it.each([
    ['ltr', false],
    ['rtl', false],
    ['ltr', true],
    ['rtl', true],
  ] as const)(
    'positions and scrolls horizontal content in %s with dynamic=%s',
    async (dir, dynamic) => {
      const wrapper = await create(
        {
          orientation: 'horizontal',
          dir,
          dynamic,
          estimateSize: 100,
          gap: 8,
          height: 120,
        },
        ({ item }) => <div style={{ width: '100px' }}>{item.label}</div>,
      )
      const viewport = await ready(wrapper)
      const first = row(wrapper, 0)!.getBoundingClientRect()
      const second = row(wrapper, 1)!.getBoundingClientRect()
      expect(dir === 'rtl' ? first.left - second.right : second.left - first.right).toBe(8)
      wrapper.api().scrollToIndex(50, { align: 'start' })
      await vi.waitFor(() => expect(exists(wrapper, 50)).toBe(true))
      await vi.waitFor(() => expect(Math.abs(viewport.scrollLeft)).toBe(5400))
      const target = row(wrapper, 50)!.getBoundingClientRect()
      const bounds = viewport.getBoundingClientRect()
      expect(
        Math.abs(dir === 'rtl' ? target.right - bounds.right : target.left - bounds.left),
      ).toBeLessThan(1)
    },
  )

  it('supports heterogeneous fixed sizes and runtime size changes', async () => {
    const wrapper = await create({
      estimateSize: (_item: unknown, index: number) => (index % 2 ? 60 : 40),
    })
    const viewport = await ready(wrapper)
    wrapper.api().scrollToIndex(10, { align: 'start' })
    await vi.waitFor(() => expect(viewport.scrollTop).toBe(500))
    await wrapper.setProps({ estimateSize: 80 })
    wrapper.api().scrollToIndex(10, { align: 'start' })
    await vi.waitFor(() => expect(viewport.scrollTop).toBe(800))
    await vi.waitFor(() => expect(row(wrapper, 10)!.getBoundingClientRect().height).toBe(80))
  })

  it('keeps existing items during loading and recovers after clearing and replacing data', async () => {
    const wrapper = await create({ items: items.slice(0, 100) })
    const viewport = await ready(wrapper)
    wrapper.api().scrollToIndex(99)
    await vi.waitFor(() => expect(exists(wrapper, 99)).toBe(true))
    await wrapper.setProps({ loading: true })
    expect(wrapper.element.querySelector('[role="status"]')).not.toBeNull()
    expect(lis(wrapper).length).toBeGreaterThan(0)
    await wrapper.setProps({ items: [], loading: false, emptyText: 'Nothing here' })
    await vi.waitFor(() => expect(viewport.scrollTop).toBe(0))
    expect(wrapper.element.textContent).toContain('Nothing here')
    expect(lis(wrapper)).toHaveLength(0)
    await wrapper.setProps({ items: items.slice(0, 3) })
    await vi.waitFor(() => expect(lis(wrapper)).toHaveLength(3))
    expect(wrapper.element.textContent).not.toContain('Nothing here')
  })

  it.each([
    ['vertical', 'ltr'],
    ['horizontal', 'ltr'],
    ['horizontal', 'rtl'],
  ] as const)('preserves viewport geometry while loading in %s %s', async (orientation, dir) => {
    const wrapper = await create({
      items: items.slice(0, 100),
      orientation,
      dir,
      estimateSize: 100,
    })
    const viewport = await ready(wrapper)
    wrapper.api().scrollToIndex(50, { align: 'start' })
    await vi.waitFor(() =>
      expect(
        Math.abs(orientation === 'horizontal' ? viewport.scrollLeft : viewport.scrollTop),
      ).toBe(5000),
    )
    await vi.waitFor(() => expect(exists(wrapper, 50)).toBe(true))
    const before = viewport.getBoundingClientRect()
    const offset = [viewport.scrollLeft, viewport.scrollTop]
    const target = row(wrapper, 50)
    await wrapper.setProps({ loading: true })
    await new Promise(requestAnimationFrame)
    expect(viewport.getBoundingClientRect().toJSON()).toEqual(before.toJSON())
    expect([viewport.scrollLeft, viewport.scrollTop]).toEqual(offset)
    expect(row(wrapper, 50)).toBe(target)
    expect(wrapper.element.querySelector('ul')!.getAttribute('aria-busy')).toBe('true')
    const overlay = wrapper.element
      .querySelector<HTMLElement>('[data-hn-loading-overlay]')!
      .getBoundingClientRect()
    expect(overlay.toJSON()).toEqual(before.toJSON())
    await wrapper.setProps({ loading: false })
    await vi.waitFor(() =>
      expect(wrapper.element.querySelector('[data-hn-loading-overlay]')).toBeNull(),
    )
    expect(viewport.getBoundingClientRect().toJSON()).toEqual(before.toJSON())
    expect([viewport.scrollLeft, viewport.scrollTop]).toEqual(offset)
  })

  it('allows native keyboard scrolling from the named viewport', async () => {
    const wrapper = await create()
    const viewport = await ready(wrapper)
    viewport.focus()
    await userEvent.keyboard('{PageDown}')
    await vi.waitFor(() => expect(viewport.scrollTop).toBeGreaterThan(0))
    expect(viewport.getAttribute('aria-label')).toBe('Items')
    await userEvent.keyboard('{Control>}{End}{/Control}')
    await new Promise(resolve => setTimeout(resolve, 0))
  })

  it('starts at the requested offset and supports smooth jumps to the final item', async () => {
    const wrapper = await create({ initialOffset: 400, items: items.slice(0, 200) })
    const viewport = await ready(wrapper)
    await vi.waitFor(() => expect(viewport.scrollTop).toBe(400))
    wrapper.api().scrollToIndex(199, { align: 'end', behavior: 'smooth' })
    await vi.waitFor(() => expect(viewport.scrollTop).toBe(7800), { timeout: 2500 })
    await vi.waitFor(() => expect(exists(wrapper, 199)).toBe(true))
  })

  it('recovers dynamic measurement when a hidden list becomes visible', async () => {
    const wrapper = await create(
      { dynamic: true, style: { width: '400px', display: 'none' } },
      ({ item }) => <div style={{ height: '70px' }}>{item.label}</div>,
    )
    const viewport = await ready(wrapper)
    await wrapper.setProps({ style: { width: '400px' } })
    await vi.waitFor(() => expect(exists(wrapper, 0)).toBe(true))
    await vi.waitFor(() =>
      expect(
        row(wrapper, 1)!.getBoundingClientRect().top - row(wrapper, 0)!.getBoundingClientRect().top,
      ).toBe(70),
    )
    expect(viewport.scrollTop).toBe(0)
    expect(lis(wrapper).length).toBeLessThan(25)
  })

  it('inherits horizontal RTL without an explicit direction prop', async () => {
    const container = document.createElement('div')
    container.dir = 'rtl'
    document.body.append(container)
    const host = container.appendChild(document.createElement('div'))
    const wrapper = await create(
      {
        orientation: 'horizontal',
        dynamic: false,
        estimateSize: 100,
        height: 100,
        label: undefined,
      },
      ({ item }) => item.label,
      host,
    )
    const viewport = await ready(wrapper)
    wrapper.api().scrollToIndex(40, { align: 'start' })
    await vi.waitFor(() => expect(viewport.scrollLeft).toBe(-4000))
    await vi.waitFor(() => expect(exists(wrapper, 40)).toBe(true))
    expect(
      Math.abs(
        row(wrapper, 40)!.getBoundingClientRect().right - viewport.getBoundingClientRect().right,
      ),
    ).toBeLessThan(1)
  })
})
