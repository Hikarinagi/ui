import { afterEach, expect, it, vi } from 'vitest'
import { page, userEvent } from '@vitest/browser/context'
import { mount, type VueWrapper } from '@vue/test-utils'
import Lightbox from './Lightbox.vue'
import type { Rect } from './utils/pose'
import '../../../test/browser.css'

let wrapper: VueWrapper | undefined
const urls: string[] = []

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
  vi.restoreAllMocks()
  for (const url of urls.splice(0)) URL.revokeObjectURL(url)
  document.body.innerHTML = ''
})

function picture(width = 400, height = 200) {
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="' +
    width +
    '" height="' +
    height +
    '"><rect width="100%" height="100%" fill="#39c5bb"/></svg>'
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }))
  urls.push(url)
  return url
}

const dialog = () => document.querySelector('[role="dialog"]') as HTMLElement | null
const frame = () =>
  dialog()?.querySelector('[data-hn-frame][class*="cursor-"]') as HTMLElement | null
const nextFrame = () => new Promise<void>(resolve => requestAnimationFrame(() => resolve()))

function pointer(type: string, target: HTMLElement, y: number) {
  target.dispatchEvent(
    new PointerEvent(type, {
      bubbles: true,
      cancelable: true,
      clientX: 512,
      clientY: y,
      pointerId: 1,
      pointerType: 'mouse',
      isPrimary: true,
      button: 0,
      buttons: type === 'pointerup' ? 0 : 1,
    }),
  )
}

it.each(['Escape', '下滑'])('首次打开 blob 从矩形展开,%s关闭时回到更新后的矩形', async method => {
  await page.viewport(1024, 768)
  let bounds: Rect = { x: 80, y: 64, width: 160, height: 80 }
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 768
  canvas.style.cssText = 'position:fixed;inset:0'
  const context = canvas.getContext('2d')!
  context.fillStyle = '#39c5bb'
  context.fillRect(bounds.x, bounds.y, bounds.width, bounds.height)
  document.body.appendChild(canvas)
  const blobUrl = picture()
  wrapper = mount(Lightbox, {
    props: {
      open: false,
      items: [{ id: 'canvas', src: blobUrl, alt: '图片', source: () => bounds }],
    },
    attachTo: document.body,
  })
  expect(document.querySelector('img')).toBeNull()
  const origin = { ...bounds }
  const enter: DOMRect[] = []
  await wrapper.setProps({ open: true })
  while (dialog()?.dataset.hnPhase !== 'open') {
    if (frame()) enter.push(frame()!.getBoundingClientRect())
    await nextFrame()
  }
  expect(enter.length).toBeGreaterThan(2)
  expect(
    Math.min(...enter.map(rect => Math.hypot(rect.x - origin.x, rect.y - origin.y))),
  ).toBeLessThan(8)
  expect(Math.min(...enter.map(rect => rect.width))).toBeLessThan(200)
  expect(frame()!.querySelector('img')!.naturalWidth).toBe(400)
  expect(frame()!.getBoundingClientRect().width).toBeCloseTo(1024, 0)
  bounds = { x: 280, y: 160, width: 160, height: 80 }
  if (method === 'Escape') {
    await userEvent.keyboard('{Escape}')
  } else {
    pointer('pointerdown', frame()!, 384)
    for (let step = 1; step <= 6; step += 1) {
      pointer('pointermove', dialog()!, 384 + step * 30)
      await nextFrame()
    }
    pointer('pointerup', dialog()!, 564)
  }
  const leave: DOMRect[] = []
  while (dialog()) {
    if (frame()) leave.push(frame()!.getBoundingClientRect())
    await nextFrame()
  }
  const last = leave.at(-1)!
  expect(Math.hypot(last.x - bounds.x, last.y - bounds.y)).toBeLessThan(4)
  expect(last.width).toBeCloseTo(bounds.width, 0)
  expect(last.height).toBeCloseTo(bounds.height, 0)
  expect(wrapper.emitted('update:open')).toContainEqual([false])
})

it.each(['关闭', '卸载'])('矩形来源解码期间%s,完成后不会重新打开或锁住页面', async action => {
  await page.viewport(1024, 768)
  let release!: () => void
  const gate = new Promise<void>(resolve => {
    release = resolve
  })
  const decode = HTMLImageElement.prototype.decode
  const pending = vi.spyOn(HTMLImageElement.prototype, 'decode').mockImplementation(function (
    this: HTMLImageElement,
  ) {
    return decode.call(this).then(() => gate)
  })
  wrapper = mount(Lightbox, {
    props: {
      open: true,
      items: [
        {
          id: 'pending',
          src: picture(),
          alt: '等待解码',
          source: () => ({ x: 80, y: 64, width: 160, height: 80 }),
        },
      ],
    },
    attachTo: document.body,
  })
  await vi.waitFor(() => expect(pending).toHaveBeenCalledOnce())
  expect(dialog()).toBeNull()
  if (action === '关闭') await wrapper.setProps({ open: false })
  else {
    wrapper.unmount()
    wrapper = undefined
  }
  release()
  for (let frame = 0; frame < 5; frame += 1) await nextFrame()
  expect(dialog()).toBeNull()
  expect(document.body.style.overflow).toBe('')
  expect(document.body.style.pointerEvents).toBe('')
})

it('解码期间换图,从最新条目的矩形和尺寸展开', async () => {
  await page.viewport(1024, 768)
  let release!: () => void
  const gate = new Promise<void>(resolve => {
    release = resolve
  })
  const first = picture()
  const second = picture(200, 400)
  const decode = HTMLImageElement.prototype.decode
  const pending = vi.spyOn(HTMLImageElement.prototype, 'decode').mockImplementation(function (
    this: HTMLImageElement,
  ) {
    return decode.call(this).then(() => (this.src === first ? gate : undefined))
  })
  const item = (src: string) => ({
    id: 'same-id',
    src,
    alt: '最新图片',
    source: () => ({ x: 80, y: 64, width: 80, height: 160 }),
  })
  wrapper = mount(Lightbox, {
    props: { open: true, items: [item(first)] },
    attachTo: document.body,
  })
  await vi.waitFor(() => expect(pending).toHaveBeenCalledOnce())
  await wrapper.setProps({ items: [item(second)] })
  release()
  await vi.waitFor(() => {
    expect(dialog()?.dataset.hnPhase).toBe('open')
    expect(frame()!.querySelector('img')!.src).toBe(second)
    expect(frame()!.getBoundingClientRect().width).toBeCloseTo(384, 0)
  })
  expect(pending).toHaveBeenCalledTimes(2)
  await userEvent.keyboard('{Escape}')
  await vi.waitFor(() => expect(dialog()).toBeNull())
  await wrapper.setProps({ open: false })
  await wrapper.setProps({ items: [item(first)], open: true })
  await vi.waitFor(() => {
    expect(dialog()?.dataset.hnPhase).toBe('open')
    expect(frame()!.getBoundingClientRect().width).toBeCloseTo(1024, 0)
  })
  expect(pending).toHaveBeenCalledTimes(3)
})

it.each([
  { x: 0, y: 0, width: 0, height: 80 },
  { x: Number.NaN, y: 0, width: 160, height: 80 },
  { x: 2048, y: 0, width: 160, height: 80 },
])('无效或不可见的矩形不参与 Hero 动画: $x,$width', async bounds => {
  await page.viewport(1024, 768)
  wrapper = mount(Lightbox, {
    props: {
      open: true,
      items: [{ id: 'invalid', src: picture(), alt: '图片', source: () => bounds }],
    },
    attachTo: document.body,
  })
  await vi.waitFor(() => expect(dialog()?.dataset.hnPhase).toBe('open'))
  const matrix = new DOMMatrix(getComputedStyle(frame()!).transform)
  expect(matrix.a).toBeCloseTo(1, 2)
  expect(matrix.e).toBeCloseTo(0, 2)
  expect(matrix.f).toBeCloseTo(0, 2)
  await userEvent.keyboard('{Escape}')
  await vi.waitFor(() => expect(dialog()).toBeNull())
})

it('矩形来源图片解码失败时仍可打开和关闭', async () => {
  const src = URL.createObjectURL(new Blob(['invalid'], { type: 'image/png' }))
  urls.push(src)
  wrapper = mount(Lightbox, {
    props: {
      open: true,
      items: [
        {
          id: 'failed',
          src,
          alt: '图片',
          source: () => ({ x: 80, y: 64, width: 160, height: 80 }),
        },
      ],
    },
    attachTo: document.body,
  })
  await vi.waitFor(() => expect(dialog()?.dataset.hnPhase).toBe('open'))
  await userEvent.keyboard('{Escape}')
  await vi.waitFor(() => expect(dialog()).toBeNull())
})
