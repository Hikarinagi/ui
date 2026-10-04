import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { page } from 'vitest/browser'
import { createElement, useEffect, type ReactNode } from 'react'
import { renderToString } from 'react-dom/server'
import { hydrateRoot } from 'react-dom/client'
import { Image } from './Image'
import { mount } from '../../../test/mount'
import '../../../test/browser.css'

const wrappers: Array<{ unmount: () => Promise<void> }> = []
const source = (width: number, height: number) =>
  `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="teal"/></svg>`)}`
const source2048 = source(2048, 683)
beforeEach(async () => {
  document.body.innerHTML = ''
  await page.viewport(393, 852)
})
afterEach(async () => {
  for (const w of wrappers.splice(0)) await w.unmount()
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})

async function attach(ui: ReactNode) {
  const w = await mount(ui)
  wrappers.push(w)
  return w
}

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
  const w = await attach(
    <div className="flex items-center gap-2">
      {createElement(
        test.tag,
        {
          className: test.parent,
          'data-parent': '',
          type: test.tag === 'button' ? 'button' : undefined,
        },
        <Image
          src={test.src}
          alt="Badge"
          className={test.child}
          imageClass="object-contain"
          ratio={test.ratioProp ? test.ratio : undefined}
          preview={test.preview}
          lazy={false}
        />,
      )}
      <span>Sibling</span>
    </div>,
  )
  const img = w.element.querySelector('img') as HTMLImageElement
  await img.decode()
  await new Promise(resolve => setTimeout(resolve, 0))
  const parent = w.element.querySelector('[data-parent]')!
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
    const w = await attach(
      <div style={{ width: '262px' }}>
        <Image src={source(800, 400)} alt="Cover" ratio={0.707} preview={preview} />
      </div>,
    )
    const root = w.element.firstElementChild as HTMLElement
    const before = root.getBoundingClientRect()
    expect(before.width).toBe(262)
    expect(Math.abs(before.height - 262 / 0.707)).toBeLessThan(0.1)
    const skeleton = root.querySelector('.hn-skeleton')!.getBoundingClientRect()
    expect([skeleton.width, skeleton.height]).toEqual([before.width, before.height])
    const img = root.querySelector('img') as HTMLImageElement
    await vi.waitFor(() => expect(img.naturalWidth).toBe(800))
    const after = root.getBoundingClientRect()
    expect([after.width, after.height]).toEqual([before.width, before.height])
    expect(img.getBoundingClientRect().width).toBe(262)
  },
)

it.each([
  { source: source(800, 400), height: 131 },
  { source: source(1, 1), height: 262 },
])('preserves natural height and full-width scaling without an explicit ratio', async test => {
  const w = await attach(
    <div style={{ width: '262px' }}>
      <Image src={test.source} lazy={false} />
    </div>,
  )
  const root = w.element.firstElementChild as HTMLElement
  const img = root.querySelector('img') as HTMLImageElement
  await img.decode()
  const rect = root.getBoundingClientRect()
  expect([rect.width, rect.height]).toEqual([262, test.height])
  expect(img.getBoundingClientRect().width).toBe(262)
})

it('preserves fixed frames and caller overrides on the image itself', async () => {
  const w = await attach(
    <Image
      src={source2048}
      lazy={false}
      style={{ width: '160px', height: '90px' }}
      imageClass="w-12 object-contain"
    />,
  )
  const img = w.element.querySelector('img') as HTMLImageElement
  await img.decode()
  const box = w.element.getBoundingClientRect()
  expect([box.width, box.height]).toEqual([160, 90])
  expect(img.getBoundingClientRect().width).toBe(48)
})

it.each([false, true])(
  'SSR and hydration reserve height-led sizing in shrink-to-fit ancestors, lazy=%s',
  async lazy => {
    let hydrated = false
    function Hydrated({ children }: { children: ReactNode }) {
      useEffect(() => {
        hydrated = true
      }, [])
      return children
    }
    const render = () => (
      <Hydrated>
        <a className="inline-flex">
          <Image src={source2048} lazy={lazy} alt="Wordmark" ratio={2048 / 683} className="h-5" />
        </a>
      </Hydrated>
    )
    const host = document.createElement('div')
    host.innerHTML = renderToString(render())
    document.body.append(host)
    const img = host.querySelector('img')!
    if (!lazy) await img.decode()
    const root = img.parentElement!
    const anchor = host.querySelector('a')!
    expect(Math.abs(root.getBoundingClientRect().width - (20 * 2048) / 683)).toBeLessThan(0.1)
    expect(
      Math.abs(anchor.getBoundingClientRect().width - root.getBoundingClientRect().width),
    ).toBeLessThan(0.1)
    const error = vi.spyOn(console, 'error')
    const warn = vi.spyOn(console, 'warn')
    const recoverable = vi.fn()
    const app = hydrateRoot(host, render(), { onRecoverableError: recoverable })
    try {
      await vi.waitFor(() => expect(hydrated).toBe(true))
      await vi.waitFor(() => expect(img.naturalWidth).toBe(2048))
      expect(recoverable).not.toHaveBeenCalled()
      expect(host.querySelector('img')).toBe(img)
      expect(Math.abs(root.getBoundingClientRect().width - (20 * 2048) / 683)).toBeLessThan(0.1)
      expect(
        Math.abs(anchor.getBoundingClientRect().width - root.getBoundingClientRect().width),
      ).toBeLessThan(0.1)
      expect(error).not.toHaveBeenCalled()
      expect(warn).not.toHaveBeenCalled()
    } finally {
      app.unmount()
    }
  },
)
