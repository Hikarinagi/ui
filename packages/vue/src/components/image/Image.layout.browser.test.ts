import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { page } from 'vitest/browser'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createSSRApp, h, nextTick } from 'vue'
import { renderToString } from 'vue/server-renderer'
import Image from './Image.vue'
import '../../../test/browser.css'

const wrappers: VueWrapper[] = []
const source = (width: number, height: number) =>
  `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="teal"/></svg>`)}`
const source2048 = source(2048, 683)
beforeEach(async () => {
  document.body.innerHTML = ''
  await page.viewport(393, 852)
})
afterEach(() => {
  wrappers.splice(0).forEach(w => w.unmount())
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})

const cases = [
  {
    name: 'height and CSS ratio in a nonshrinking flex link',
    tag: 'a',
    parent: 'flex shrink-0 items-center',
    child: 'aspect-2048/683 h-5',
    height: 20,
    ratio: 2048 / 683,
    src: source2048,
  },
  {
    name: 'auto width and percentage height inside an inline-flex button',
    tag: 'button',
    parent: 'inline-flex h-4 items-center border-0 p-0',
    child: 'aspect-2048/683 h-full w-auto',
    height: 16,
    ratio: 2048 / 683,
    src: source2048,
  },
  {
    name: 'wordmark with a CSS aspect ratio',
    tag: 'a',
    parent: 'flex shrink-0 items-center',
    child: 'aspect-792/191 h-5',
    height: 20,
    ratio: 792 / 191,
    src: source(792, 191),
  },
  {
    name: 'inline-block ancestor and ratio prop',
    tag: 'div',
    parent: 'inline-block',
    child: 'h-5',
    height: 20,
    ratio: 2048 / 683,
    src: source2048,
    ratioProp: true,
  },
  {
    name: 'preview button inside a shrink-to-fit wrapper',
    tag: 'div',
    parent: 'inline-flex',
    child: 'aspect-2048/683 h-5',
    height: 20,
    ratio: 2048 / 683,
    src: source2048,
    preview: true,
  },
]

it.each(cases)('does not propagate intrinsic width: $name', async test => {
  const host = document.createElement('div')
  document.body.append(host)
  const w = mount(
    {
      render: () =>
        h('div', { class: 'flex items-center gap-2' }, [
          h(
            test.tag,
            {
              class: test.parent,
              'data-parent': '',
              type: test.tag === 'button' ? 'button' : undefined,
            },
            [
              h(Image, {
                src: test.src,
                alt: 'Badge',
                class: test.child,
                imageClass: 'object-contain',
                ratio: test.ratioProp ? test.ratio : undefined,
                preview: test.preview,
                lazy: false,
              }),
            ],
          ),
          h('span', 'Sibling'),
        ]),
    },
    { attachTo: host },
  )
  wrappers.push(w)
  const img = w.get('img').element as HTMLImageElement
  await img.decode()
  await nextTick()
  const parent = w.get('[data-parent]').element
  const root = img.parentElement!
  for (const element of [parent, root, img]) {
    const box = element.getBoundingClientRect()
    expect(Math.abs(box.width - test.height * test.ratio)).toBeLessThan(0.1)
    expect(box.height).toBe(test.height)
  }
  expect(document.documentElement.scrollWidth).toBe(document.documentElement.clientWidth)
})

it.each([false, true])(
  'retains full width and reserved ratio before and after load, preview=%s',
  async preview => {
    const host = document.createElement('div')
    host.style.width = '262px'
    document.body.append(host)
    const w = mount(Image, {
      props: { src: source(800, 400), alt: 'Cover', ratio: 0.707, preview },
      attachTo: host,
    })
    wrappers.push(w)
    const before = w.element.getBoundingClientRect()
    expect(before.width).toBe(262)
    expect(Math.abs(before.height - 262 / 0.707)).toBeLessThan(0.1)
    const skeleton = w.get('.hn-skeleton').element.getBoundingClientRect()
    expect([skeleton.width, skeleton.height]).toEqual([before.width, before.height])
    const img = w.get('img').element as HTMLImageElement
    await vi.waitFor(() => expect(img.naturalWidth).toBe(800))
    const after = w.element.getBoundingClientRect()
    expect([after.width, after.height]).toEqual([before.width, before.height])
    expect(img.getBoundingClientRect().width).toBe(262)
  },
)

it.each([
  { source: source(800, 400), height: 131 },
  { source: source(1, 1), height: 262 },
])('preserves natural height and full-width scaling without an explicit ratio', async test => {
  const host = document.createElement('div')
  host.style.width = '262px'
  document.body.append(host)
  const w = mount(Image, { props: { src: test.source, lazy: false }, attachTo: host })
  wrappers.push(w)
  const img = w.get('img').element as HTMLImageElement
  await img.decode()
  const rect = w.element.getBoundingClientRect()
  expect([rect.width, rect.height]).toEqual([262, test.height])
  expect(img.getBoundingClientRect().width).toBe(262)
})

it('preserves fixed frames and caller overrides on the image itself', async () => {
  const w = mount(Image, {
    props: {
      src: source2048,
      lazy: false,
      style: { width: '160px', height: '90px' },
      imageClass: 'w-12 object-contain',
    },
    attachTo: document.body,
  })
  wrappers.push(w)
  const img = w.get('img').element as HTMLImageElement
  await img.decode()
  const box = w.element.getBoundingClientRect()
  expect([box.width, box.height]).toEqual([160, 90])
  expect(img.getBoundingClientRect().width).toBe(48)
})

it.each([false, true])(
  'SSR and hydration reserve height-led sizing in shrink-to-fit ancestors, lazy=%s',
  async lazy => {
    const render = () =>
      h('a', { class: 'inline-flex' }, [
        h(Image, { src: source2048, lazy, alt: 'Wordmark', ratio: 2048 / 683, class: 'h-5' }),
      ])
    const host = document.createElement('div')
    host.innerHTML = await renderToString(createSSRApp({ render }))
    document.body.append(host)
    const img = host.querySelector('img')!
    if (!lazy) await img.decode()
    const root = img.parentElement!
    expect(Math.abs(root.getBoundingClientRect().width - (20 * 2048) / 683)).toBeLessThan(0.1)
    expect(
      Math.abs(
        host.firstElementChild!.getBoundingClientRect().width - root.getBoundingClientRect().width,
      ),
    ).toBeLessThan(0.1)
    const error = vi.spyOn(console, 'error')
    const warn = vi.spyOn(console, 'warn')
    const app = createSSRApp({ render })
    app.mount(host)
    try {
      await vi.waitFor(() => expect(img.naturalWidth).toBe(2048))
      expect(host.querySelector('img')).toBe(img)
      expect(Math.abs(root.getBoundingClientRect().width - (20 * 2048) / 683)).toBeLessThan(0.1)
      expect(
        Math.abs(
          host.firstElementChild!.getBoundingClientRect().width -
            root.getBoundingClientRect().width,
        ),
      ).toBeLessThan(0.1)
      expect(error).not.toHaveBeenCalled()
      expect(warn).not.toHaveBeenCalled()
    } finally {
      app.unmount()
    }
  },
)
