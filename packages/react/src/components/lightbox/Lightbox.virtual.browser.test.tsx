import { afterEach, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { Lightbox } from './Lightbox'
import type { LightboxItem } from './types'
import type { Rect } from '../../../../shared/src/lib/lightbox/pose'
import { mount } from '../../../test/mount'
import { signal } from '../../../test/signal'
import '../../../test/browser.css'

function frameRect(element: HTMLElement): DOMRect {
  const width = Number.parseFloat(element.style.width)
  const height = Number.parseFloat(element.style.height)
  const x = Number.parseFloat(element.style.left) + width / 2
  const y = Number.parseFloat(element.style.top) + height / 2
  const matrix = new DOMMatrix(element.style.transform)
  const corners = [
    [-width / 2, -height / 2],
    [width / 2, -height / 2],
    [width / 2, height / 2],
    [-width / 2, height / 2],
  ].map(([x, y]) => matrix.transformPoint({ x, y }))
  const left = Math.min(...corners.map(point => point.x))
  const top = Math.min(...corners.map(point => point.y))
  const right = Math.max(...corners.map(point => point.x))
  const bottom = Math.max(...corners.map(point => point.y))
  return new DOMRect(x + left, y + top, right - left, bottom - top)
}

let wrapper: { unmount: () => Promise<void> } | undefined
const urls: string[] = []

afterEach(async () => {
  await wrapper?.unmount()
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

function harness(initial: { open: boolean; items: LightboxItem[] }) {
  const props = signal(initial)
  const onOpenChange = vi.fn()
  function Harness() {
    const { open, items } = props.use()
    return <Lightbox open={open} items={items} onOpenChange={onOpenChange} />
  }
  return {
    props,
    onOpenChange,
    setProps: (next: Partial<{ open: boolean; items: LightboxItem[] }>) => {
      props.value = { ...props.value, ...next }
    },
    render: async () => {
      wrapper = await mount(<Harness />)
    },
  }
}

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
  const view = harness({
    open: false,
    items: [{ id: 'canvas', src: blobUrl, alt: '图片', source: () => bounds }],
  })
  await view.render()
  expect(document.querySelector('img')).toBeNull()
  const origin = { ...bounds }
  const enter: DOMRect[] = []
  view.setProps({ open: true })
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
  expect(frame()!.getBoundingClientRect().width).toBeCloseTo(400, 0)
  bounds = { x: 280, y: 160, width: 160, height: 80 }
  const target = frame()!
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
  await vi.waitFor(() => expect(dialog()).toBeNull(), { timeout: 3000 })
  const last = frameRect(target)
  expect(Math.hypot(last.x - bounds.x, last.y - bounds.y)).toBeLessThan(4)
  expect(last.width).toBeCloseTo(bounds.width, 0)
  expect(last.height).toBeCloseTo(bounds.height, 0)
  expect(view.onOpenChange).toHaveBeenCalledWith(false)
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
  const view = harness({
    open: true,
    items: [
      {
        id: 'pending',
        src: picture(),
        alt: '等待解码',
        source: () => ({ x: 80, y: 64, width: 160, height: 80 }),
      },
    ],
  })
  await view.render()
  await vi.waitFor(() => expect(pending).toHaveBeenCalledOnce())
  expect(dialog()).toBeNull()
  if (action === '关闭') view.setProps({ open: false })
  else {
    await wrapper!.unmount()
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
  const view = harness({ open: true, items: [item(first)] })
  await view.render()
  await vi.waitFor(() => expect(pending).toHaveBeenCalledOnce())
  view.setProps({ items: [item(second)] })
  release()
  await vi.waitFor(() => {
    expect(dialog()?.dataset.hnPhase).toBe('open')
    expect(frame()!.querySelector('img')!.src).toBe(second)
    expect(frame()!.getBoundingClientRect().width).toBeCloseTo(200, 0)
  })
  expect(pending).toHaveBeenCalledTimes(2)
  await userEvent.keyboard('{Escape}')
  await vi.waitFor(() => expect(dialog()).toBeNull())
  view.setProps({ open: false })
  await nextFrame()
  view.setProps({ items: [item(first)], open: true })
  await vi.waitFor(() => {
    expect(dialog()?.dataset.hnPhase).toBe('open')
    expect(frame()!.getBoundingClientRect().width).toBeCloseTo(400, 0)
  })
  expect(pending).toHaveBeenCalledTimes(3)
})

it.each([
  { x: 0, y: 0, width: 0, height: 80 },
  { x: Number.NaN, y: 0, width: 160, height: 80 },
  { x: 2048, y: 0, width: 160, height: 80 },
])('无效或不可见的矩形不参与 Hero 动画: $x,$width', async bounds => {
  await page.viewport(1024, 768)
  wrapper = await mount(
    <Lightbox
      open
      items={[{ id: 'invalid', src: picture(), alt: '图片', source: () => bounds }]}
    />,
  )
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
  wrapper = await mount(
    <Lightbox
      open
      items={[
        {
          id: 'failed',
          src,
          alt: '图片',
          source: () => ({ x: 80, y: 64, width: 160, height: 80 }),
        },
      ]}
    />,
  )
  await vi.waitFor(() => expect(dialog()?.dataset.hnPhase).toBe('open'))
  await userEvent.keyboard('{Escape}')
  await vi.waitFor(() => expect(dialog()).toBeNull())
})
