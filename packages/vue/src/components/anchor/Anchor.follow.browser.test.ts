import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { page } from 'vitest/browser'
import { mount, type VueWrapper } from '@vue/test-utils'
import { h, nextTick, ref, shallowRef } from 'vue'
import Anchor from './Anchor.vue'
import ScrollArea from '../scroll-area/ScrollArea.vue'
import '../../../test/browser.css'

const wrappers: VueWrapper[] = []
beforeEach(async () => {
  await page.viewport(900, 700)
  history.replaceState(null, '', location.pathname)
})
afterEach(() => {
  wrappers.splice(0).forEach(wrapper => wrapper.unmount())
  document.body.innerHTML = ''
  history.replaceState(null, '', location.pathname)
  vi.restoreAllMocks()
})

async function settle() {
  for (let i = 0; i < 4; i++) await new Promise(requestAnimationFrame)
}

function setup(
  kind: 'native' | 'scroll-area' | 'root' = 'scroll-area',
  follow?: boolean,
  sectionHeight = 240,
) {
  const items = ref(
    Array.from({ length: 51 }, (_, index) => ({
      id: `follow-${index}`,
      label: `Section ${index + 1}`,
    })),
  )
  const autoScroll = ref(follow)
  const article = shallowRef<HTMLElement>()
  const area = shallowRef<InstanceType<typeof ScrollArea>>()
  const toc = shallowRef<HTMLElement>()
  const anchor = shallowRef<{ readonly current?: string }>()
  const change = vi.fn()
  const renderAnchor = () =>
    h(Anchor, {
      ref: anchor,
      items: items.value,
      ...(autoScroll.value === undefined ? {} : { autoScroll: autoScroll.value }),
      onChange: change,
      class: '[&_a]:min-h-[30px]',
    })
  const wrapper = mount(
    {
      setup: () => () =>
        h('div', { style: 'display:flex;gap:24px' }, [
          h(
            'div',
            { ref: article, style: 'height:320px;width:320px;overflow:auto' },
            items.value.map(item =>
              h('section', { id: item.id, style: `height:${sectionHeight}px` }, item.label),
            ),
          ),
          kind === 'root'
            ? h(Anchor, {
                ref: anchor,
                items: items.value,
                ...(autoScroll.value === undefined ? {} : { autoScroll: autoScroll.value }),
                onChange: change,
                class: 'w-52 [&_a]:min-h-[30px]',
                style: 'height:320px;overflow:auto',
              })
            : kind === 'native'
              ? h(
                  'div',
                  {
                    ref: toc,
                    style: 'height:320px;width:220px;overflow:auto;border:3px solid transparent',
                  },
                  [renderAnchor()],
                )
              : h(
                  ScrollArea,
                  {
                    ref: area,
                    style: 'height:320px;width:220px;overflow:auto;border:3px solid transparent',
                  },
                  { default: renderAnchor },
                ),
        ]),
    },
    { attachTo: document.body },
  )
  wrappers.push(wrapper)
  const nav = () => wrapper.get('nav').element as HTMLElement
  const port = () =>
    kind === 'root' ? nav() : kind === 'native' ? toc.value! : area.value!.viewport!
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
    article.value!.scrollTop = sectionHeight * index
    await vi.waitFor(() => expect(anchor.value?.current).toBe(`follow-${index}`))
  }
  return {
    wrapper,
    items,
    autoScroll,
    article,
    anchor,
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
    const { go, port, expectVisible, article, change, anchor } = setup(kind)
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
    const { go, article, anchor, port, covered, expectRangeVisible, change } = setup(
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
  const { go, article, port, autoScroll, covered, expectVisible } = setup('native', false, 40)
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
  const { go, port, items, anchor, change } = setup()
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
  const { go, port, expectVisible, autoScroll, change } = setup('scroll-area', false)
  await go(28)
  await settle()
  expect(port().scrollTop).toBe(0)
  expect(change).toHaveBeenLastCalledWith('follow-28')
  autoScroll.value = true
  await nextTick()
  await vi.waitFor(expectVisible)
})

it('uses instant movement for reduced motion even with smooth scrolling set on the viewport', async () => {
  const matchMedia = window.matchMedia.bind(window)
  vi.spyOn(window, 'matchMedia').mockImplementation(query =>
    query === '(prefers-reduced-motion: reduce)'
      ? ({ ...matchMedia(query), matches: true } as MediaQueryList)
      : matchMedia(query),
  )
  const { go, port, expectVisible, anchor } = setup()
  await vi.waitFor(() => expect(anchor.value?.current).toBe('follow-0'))
  await settle()
  port().style.scrollBehavior = 'smooth'
  const scroll = vi.spyOn(port(), 'scrollTo')
  await go(28)
  await vi.waitFor(expectVisible)
  expect(scroll).toHaveBeenCalledWith(expect.objectContaining({ behavior: 'instant' }))
})

it('keeps the active entry visible after the directory viewport shrinks', async () => {
  const { go, port, expectVisible } = setup('native')
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
  const viewport = shallowRef<HTMLElement>()
  const anchor = shallowRef<{ readonly current?: string }>()
  wrappers.push(
    mount(
      {
        setup: () => () =>
          h('div', { ref: viewport, style: 'height:320px;overflow:auto' }, [
            h(Anchor, { ref: anchor, items }),
            ...items.map(item => h('section', { id: item.id, style: 'height:240px' }, item.label)),
          ]),
      },
      { attachTo: document.body },
    ),
  )
  const target = document.getElementById('shared-28')!
  viewport.value!.scrollTop +=
    target.getBoundingClientRect().top - viewport.value!.getBoundingClientRect().top
  const top = viewport.value!.scrollTop
  await vi.waitFor(() => expect(anchor.value?.current).toBe('shared-28'))
  await settle()
  expect(viewport.value!.scrollTop).toBe(top)
})
