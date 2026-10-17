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
const HASH = 'YMcJJIIhukWZenmwmHWb9Pc5nw=='
const rootOf = (img: HTMLElement, thumbhash?: string) =>
  thumbhash ? img.parentElement!.parentElement! : img.parentElement!
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

it.each(
  cases.flatMap(test => [
    { ...test, thumbhash: undefined as string | undefined },
    { ...test, name: `${test.name} with a thumbhash`, thumbhash: HASH },
  ]),
)('does not propagate intrinsic width: $name', async test => {
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
          thumbhash={test.thumbhash}
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
  const root = rootOf(img, test.thumbhash)
  for (const element of [parent, root, img.parentElement!, img]) {
    const box = element.getBoundingClientRect()
    expect(Math.abs(box.width - test.height * test.ratio)).toBeLessThan(0.1)
    expect(box.height).toBe(test.height)
  }
  expect(document.documentElement.scrollWidth).toBe(document.documentElement.clientWidth)
})

it.each([
  { preview: false, thumbhash: undefined },
  { preview: true, thumbhash: undefined },
  { preview: false, thumbhash: HASH },
  { preview: true, thumbhash: HASH },
])(
  'retains full width and reserved ratio before and after load, preview=$preview thumbhash=$thumbhash',
  async ({ preview, thumbhash }) => {
    const w = await attach(
      <div style={{ width: '262px' }}>
        <Image
          src={source(800, 400)}
          alt="Cover"
          ratio={0.707}
          preview={preview}
          thumbhash={thumbhash}
        />
      </div>,
    )
    const root = w.element.firstElementChild as HTMLElement
    const before = root.getBoundingClientRect()
    expect(before.width).toBe(262)
    expect(Math.abs(before.height - 262 / 0.707)).toBeLessThan(0.1)
    const skeleton = root
      .querySelector(thumbhash ? 'span[aria-hidden="true"]' : '.hn-skeleton')!
      .getBoundingClientRect()
    expect([skeleton.width, skeleton.height]).toEqual([before.width, before.height])
    const img = root.querySelector('img') as HTMLImageElement
    await vi.waitFor(() => expect(img.naturalWidth).toBe(800))
    const after = root.getBoundingClientRect()
    expect([after.width, after.height]).toEqual([before.width, before.height])
    expect(img.getBoundingClientRect().width).toBe(262)
  },
)

it.each([
  { source: source(800, 400), height: 131, thumbhash: undefined },
  { source: source(1, 1), height: 262, thumbhash: undefined },
  { source: source(800, 400), height: 131, thumbhash: HASH },
  { source: source(1, 1), height: 262, thumbhash: HASH },
])(
  'preserves natural height and full-width scaling without an explicit ratio, thumbhash=$thumbhash',
  async test => {
    const w = await attach(
      <div style={{ width: '262px' }}>
        <Image src={test.source} lazy={false} thumbhash={test.thumbhash} />
      </div>,
    )
    const root = w.element.firstElementChild as HTMLElement
    const img = root.querySelector('img') as HTMLImageElement
    await img.decode()
    const rect = root.getBoundingClientRect()
    expect([rect.width, rect.height]).toEqual([262, test.height])
    expect(img.getBoundingClientRect().width).toBe(262)
  },
)

it.each([undefined, HASH])(
  'preserves fixed frames and caller overrides on the image itself, thumbhash=%s',
  async thumbhash => {
    const w = await attach(
      <Image
        src={source2048}
        thumbhash={thumbhash}
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
  },
)

it.each([
  { lazy: false, thumbhash: undefined },
  { lazy: true, thumbhash: undefined },
  { lazy: false, thumbhash: HASH },
  { lazy: true, thumbhash: HASH },
])(
  'SSR and hydration reserve height-led sizing in shrink-to-fit ancestors, lazy=$lazy thumbhash=$thumbhash',
  async ({ lazy, thumbhash }) => {
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
          <Image
            src={source2048}
            lazy={lazy}
            thumbhash={thumbhash}
            alt="Wordmark"
            ratio={2048 / 683}
            className="h-5"
          />
        </a>
      </Hydrated>
    )
    const host = document.createElement('div')
    host.innerHTML = renderToString(render())
    document.body.append(host)
    const img = host.querySelector('img')!
    if (!lazy) await img.decode()
    const root = rootOf(img, thumbhash)
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
