import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { page } from 'vitest/browser'
import { createRef, type CSSProperties, type ReactNode } from 'react'
import { Anchor, type AnchorHandle, type AnchorProps } from './Anchor'
import { ScrollArea, type ScrollAreaHandle } from '../scroll-area/ScrollArea'
import { mount } from '../../../test/mount'
import { signal, tick } from '../../../test/signal'
import '../../../test/browser.css'

beforeEach(async () => {
  await page.viewport(900, 700)
  history.replaceState(null, '', location.pathname)
})
afterEach(() => {
  document.body.innerHTML = ''
  history.replaceState(null, '', location.pathname)
  vi.restoreAllMocks()
})

async function settle() {
  for (let i = 0; i < 4; i++) await new Promise(requestAnimationFrame)
}

const portStyle: CSSProperties = {
  height: '320px',
  width: '220px',
  overflow: 'auto',
  border: '3px solid transparent',
}

async function setup(
  kind: 'native' | 'scroll-area' | 'root' = 'scroll-area',
  follow?: boolean,
  sectionHeight = 240,
) {
  const items = signal(
    Array.from({ length: 51 }, (_, index) => ({
      id: `follow-${index}`,
      label: `Section ${index + 1}`,
    })),
  )
  const autoScroll = signal(follow)
  const article = createRef<HTMLDivElement>()
  const area = createRef<ScrollAreaHandle>()
  const toc = createRef<HTMLDivElement>()
  const anchor = createRef<AnchorHandle>()
  const change = vi.fn()

  function Harness() {
    const list = items.use()
    const auto = autoScroll.use()
    const shared: AnchorProps = {
      items: list,
      ...(auto === undefined ? {} : { autoScroll: auto }),
      onChange: change,
    }
    let directory: ReactNode
    if (kind === 'root')
      directory = (
        <Anchor
          ref={anchor}
          {...shared}
          className="w-52 [&_a]:min-h-[30px]"
          style={{ height: '320px', overflow: 'auto' }}
        />
      )
    else if (kind === 'native')
      directory = (
        <div ref={toc} style={portStyle}>
          <Anchor ref={anchor} {...shared} className="[&_a]:min-h-[30px]" />
        </div>
      )
    else
      directory = (
        <ScrollArea ref={area} style={portStyle}>
          <Anchor ref={anchor} {...shared} className="[&_a]:min-h-[30px]" />
        </ScrollArea>
      )
    return (
      <div style={{ display: 'flex', gap: '24px' }}>
        <div ref={article} style={{ height: '320px', width: '320px', overflow: 'auto' }}>
          {list.map(item => (
            <section key={item.id} id={item.id} style={{ height: `${sectionHeight}px` }}>
              {item.label}
            </section>
          ))}
        </div>
        {directory}
      </div>
    )
  }

  const wrapper = await mount(<Harness />)
  const nav = () => wrapper.container.querySelector('nav') as HTMLElement
  const port = () =>
    kind === 'root' ? nav() : kind === 'native' ? toc.current! : area.current!.viewport!
  const active = () => nav().querySelector<HTMLElement>('a[aria-current]')!
  const covered = () => Array.from(nav().querySelectorAll<HTMLElement>('a.font-medium'))
  const expectBoundsVisible = (first: HTMLElement, last = first) => {
    const viewport = port()
    const top = viewport.getBoundingClientRect().top + viewport.clientTop
    expect(first.getBoundingClientRect().top).toBeGreaterThanOrEqual(top - 1)
    expect(last.getBoundingClientRect().bottom).toBeLessThanOrEqual(top + viewport.clientHeight + 1)
  }
  const expectVisible = () => expectBoundsVisible(active())
  const expectRangeVisible = () => expectBoundsVisible(covered()[0]!, covered().at(-1)!)
  const go = async (index: number) => {
    article.current!.scrollTop = sectionHeight * index
    await vi.waitFor(() => expect(anchor.current?.current).toBe(`follow-${index}`))
  }
  return {
    wrapper,
    items,
    autoScroll,
    article: {
      get value() {
        return article.current
      },
    },
    anchor: {
      get value() {
        return anchor.current
      },
    },
    change,
    port,
    active,
    covered,
    expectVisible,
    expectRangeVisible,
    go,
  }
}

it.each(['native', 'scroll-area', 'root'] as const)(
  'keeps the current entry visible by default in a long %s directory without moving the article or focus',
  async kind => {
    const { go, port, expectVisible, article, change, anchor } = await setup(kind)
    await vi.waitFor(() => expect(anchor.value?.current).toBe('follow-0'))
    await settle()
    expect(port().scrollTop).toBe(0)
    const focused = document.activeElement
    const pageTop = window.scrollY
    await go(28)
    await vi.waitFor(expectVisible)
    expect(port().scrollTop).toBeGreaterThan(500)
    expect(article.value!.scrollTop).toBe(28 * 240)
    expect(window.scrollY).toBe(pageTop)
    expect(document.activeElement).toBe(focused)
    expect(change).toHaveBeenLastCalledWith('follow-28')
    await go(2)
    await vi.waitFor(expectVisible)
    expect(article.value!.scrollTop).toBe(2 * 240)
  },
)

it.each(['native', 'scroll-area', 'root'] as const)(
  'follows the entire highlighted range in a %s directory when only its end changes',
  async kind => {
    const { go, article, anchor, port, covered, expectRangeVisible, change } = await setup(
      kind,
      undefined,
      40,
    )
    article.value!.style.height = '80px'
    await go(8)
    await vi.waitFor(() => expect(covered()).toHaveLength(2))
    await settle()
    expectRangeVisible()
    expect(port().scrollTop).toBe(0)
    const scroll = vi.spyOn(port(), 'scrollTo')
    const changes = change.mock.calls.length
    const focused = document.activeElement
    const pageTop = window.scrollY

    article.value!.style.height = '160px'
    await vi.waitFor(() => expect(covered()).toHaveLength(4))
    await vi.waitFor(expectRangeVisible)
    await vi.waitFor(() => {
      const options = scroll.mock.lastCall?.[0] as ScrollToOptions | undefined
      expect(options?.behavior).toBe('smooth')
      expect(port().scrollTop).toBeCloseTo(options!.top!, 0)
    })
    expect(port().scrollTop).toBeGreaterThan(0)
    expect(anchor.value?.current).toBe('follow-8')
    expect(change).toHaveBeenCalledTimes(changes)
    expect(article.value!.scrollTop).toBe(8 * 40)
    expect(window.scrollY).toBe(pageTop)
    expect(document.activeElement).toBe(focused)

    const top = port().scrollTop
    scroll.mockClear()
    article.value!.style.height = '120px'
    await vi.waitFor(() => expect(covered()).toHaveLength(3))
    await settle()
    expectRangeVisible()
    expect(port().scrollTop).toBe(top)
    expect(scroll).not.toHaveBeenCalled()
  },
)

it('falls back to the first entry for an oversized range without alternating between its ends', async () => {
  const { go, article, port, autoScroll, covered, expectVisible } = await setup('native', false, 40)
  port().style.height = '90px'
  await go(28)
  await vi.waitFor(() => expect(covered()).toHaveLength(8))
  autoScroll.value = true
  await vi.waitFor(expectVisible)
  await settle()
  const top = port().scrollTop
  expect(top).toBeGreaterThan(0)
  expect(covered().at(-1)!.getBoundingClientRect().bottom).toBeGreaterThan(
    port().getBoundingClientRect().bottom,
  )
  const scroll = vi.spyOn(port(), 'scrollTo')
  for (const height of [280, 320, 280, 320]) {
    article.value!.style.height = `${height}px`
    await vi.waitFor(() => expect(covered()).toHaveLength(height / 40))
    await settle()
    expectVisible()
    expect(port().scrollTop).toBe(top)
  }
  port().style.width = '230px'
  await settle()
  expect(port().scrollTop).toBe(top)
  expect(scroll).not.toHaveBeenCalled()
})

it('does not recenter visible entries or undo manual browsing of the directory', async () => {
  const { go, port, items, anchor, change } = await setup()
  await vi.waitFor(() => expect(anchor.value?.current).toBe('follow-0'))
  await go(2)
  await settle()
  expect(port().scrollTop).toBe(0)
  port().scrollTop = 900
  await settle()
  expect(port().scrollTop).toBe(900)
  const calls = change.mock.calls.length
  items.value = items.value.map(item => ({ ...item, label: item.label + ' updated' }))
  await settle()
  expect(change).toHaveBeenCalledTimes(calls)
  expect(port().scrollTop).toBe(900)
})

it('can disable following while still exposing and emitting the current entry', async () => {
  const { go, port, expectVisible, autoScroll, change } = await setup('scroll-area', false)
  await go(28)
  await settle()
  expect(port().scrollTop).toBe(0)
  expect(change).toHaveBeenLastCalledWith('follow-28')
  autoScroll.value = true
  await tick()
  await vi.waitFor(expectVisible)
})

it('uses instant movement for reduced motion even with smooth scrolling set on the viewport', async () => {
  const matchMedia = window.matchMedia.bind(window)
  vi.spyOn(window, 'matchMedia').mockImplementation(query =>
    query === '(prefers-reduced-motion: reduce)'
      ? ({ ...matchMedia(query), matches: true } as MediaQueryList)
      : matchMedia(query),
  )
  const { go, port, expectVisible, anchor } = await setup()
  await vi.waitFor(() => expect(anchor.value?.current).toBe('follow-0'))
  await settle()
  port().style.scrollBehavior = 'smooth'
  const scroll = vi.spyOn(port(), 'scrollTo')
  await go(28)
  await vi.waitFor(expectVisible)
  expect(scroll).toHaveBeenCalledWith(expect.objectContaining({ behavior: 'instant' }))
})

it('keeps the active entry visible after the directory viewport shrinks', async () => {
  const { go, port, expectVisible } = await setup('native')
  await go(8)
  await settle()
  expect(port().scrollTop).toBe(0)
  port().style.height = '120px'
  await vi.waitFor(expectVisible)
  expect(port().scrollTop).toBeGreaterThan(100)
})

it('never scrolls an ancestor shared with the article to reveal an offscreen directory', async () => {
  const items = Array.from({ length: 51 }, (_, index) => ({
    id: `shared-${index}`,
    label: `Section ${index + 1}`,
  }))
  const viewport = createRef<HTMLDivElement>()
  const anchor = createRef<AnchorHandle>()
  await mount(
    <div ref={viewport} style={{ height: '320px', overflow: 'auto' }}>
      <Anchor ref={anchor} items={items} />
      {items.map(item => (
        <section key={item.id} id={item.id} style={{ height: '240px' }}>
          {item.label}
        </section>
      ))}
    </div>,
  )
  const target = document.getElementById('shared-28')!
  viewport.current!.scrollTop +=
    target.getBoundingClientRect().top - viewport.current!.getBoundingClientRect().top
  const top = viewport.current!.scrollTop
  await vi.waitFor(() => expect(anchor.current?.current).toBe('shared-28'))
  await settle()
  expect(viewport.current!.scrollTop).toBe(top)
})
