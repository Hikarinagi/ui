import { afterEach, beforeEach, expect, it, onTestFinished, vi } from 'vitest'
import { page, userEvent } from '@vitest/browser/context'
import { mount, type VueWrapper } from '@vue/test-utils'
import { h } from 'vue'
import Lightbox from './Lightbox.vue'
import Image from '../image/Image.vue'
import ImageGroup from '../image/ImageGroup.vue'
import '../../../test/browser.css'

let wrapper: VueWrapper | undefined
const urls: string[] = []

beforeEach(async () => {
  await page.viewport(1440, 900)
})

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
  vi.restoreAllMocks()
  for (const url of urls.splice(0)) URL.revokeObjectURL(url)
  document.body.innerHTML = ''
})

function picture(width: number, height: number) {
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="' +
    width +
    '" height="' +
    height +
    '"><rect width="100%" height="100%" fill="#39c5bb"/></svg>'
  const src = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }))
  urls.push(src)
  return src
}

const dialog = () => document.querySelector<HTMLElement>('[role="dialog"]')
const frame = () => dialog()!.querySelector<HTMLElement>('[data-hn-frame][class*="cursor-"]')!
const tool = (name: string) =>
  dialog()!.querySelector<HTMLButtonElement>('[aria-label="' + name + '"]')!
const width = () => frame().getBoundingClientRect().width
const nextFrame = () => new Promise<void>(resolve => requestAnimationFrame(() => resolve()))

async function ready() {
  await vi.waitFor(() => expect(dialog()?.dataset.hnPhase).toBe('open'), { timeout: 3000 })
}

async function nearWidth(expected: number) {
  await vi.waitFor(() => expect(width()).toBeCloseTo(expected, 0), { timeout: 3000 })
}

function wheel(deltaY: number) {
  frame().dispatchEvent(
    new WheelEvent('wheel', {
      bubbles: true,
      cancelable: true,
      deltaY,
      clientX: innerWidth / 2,
      clientY: innerHeight / 2,
    }),
  )
}

async function image(src: string, preview: boolean | string = true) {
  wrapper = mount(Image, {
    props: {
      src,
      preview,
      alt: '预览图片',
      lazy: false,
      style: { width: '160px', height: '80px' },
    },
    attachTo: document.body,
  })
  await vi.waitFor(() =>
    expect((wrapper!.find('img').element as HTMLImageElement).naturalWidth).toBeGreaterThan(0),
  )
  await userEvent.click(wrapper.find('button').element)
}

it.each(['Image', 'Lightbox'])(
  '%s 的小图不被自动放大,手动上限为原图两倍且按钮反映边界',
  async component => {
    const src = picture(100, 50)
    if (component === 'Image') await image(src)
    else
      wrapper = mount(Lightbox, {
        props: { open: true, items: [{ id: 'small', src, alt: '小图' }] },
        attachTo: document.body,
      })
    await ready()
    await nearWidth(100)
    expect(frame().getBoundingClientRect().height).toBeCloseTo(50, 0)
    expect(frame().className).toContain('cursor-default')
    expect(tool('原始尺寸').disabled).toBe(true)
    expect(tool('缩小').disabled).toBe(true)
    await userEvent.dblClick(frame())
    await nearWidth(100)
    await userEvent.click(tool('放大'))
    await nearWidth(150)
    await userEvent.click(tool('放大'))
    await nearWidth(200)
    await vi.waitFor(() => expect(tool('放大').disabled).toBe(true))
    expect(tool('缩小').disabled).toBe(false)
    await userEvent.click(tool('适应窗口'))
    await nearWidth(100)
  },
)

it('大图初始避让工具栏,双击显示原始尺寸,旋转和窗口变化不会改变原始尺寸上限', async () => {
  await image(picture(2400, 1600))
  await ready()
  const initial = frame().getBoundingClientRect()
  const chrome = dialog()!.querySelector('[data-hn-chrome]')!.getBoundingClientRect()
  expect(initial.left).toBeGreaterThanOrEqual(24)
  expect(initial.top).toBeGreaterThan(0)
  expect(initial.bottom).toBeLessThan(chrome.top)
  await userEvent.dblClick(frame())
  await nearWidth(2400)
  await page.viewport(1024, 768)
  await nearWidth(2400)
  await userEvent.click(tool('旋转'))
  await vi.waitFor(() => expect(frame().getBoundingClientRect().height).toBeLessThan(768))
  await userEvent.click(tool('原始尺寸'))
  await nearWidth(1600)
  await vi.waitFor(() => expect(frame().getBoundingClientRect().height).toBeCloseTo(2400, 0))
  wheel(-10000)
  await nearWidth(3200)
  await vi.waitFor(() => expect(tool('放大').disabled).toBe(true))
})

it('窄屏长图双击适配宽度,原始尺寸和手动上限仍可到达', async () => {
  await page.viewport(390, 844)
  await image(picture(1000, 12000))
  await ready()
  expect(width()).toBeLessThan(100)
  await userEvent.dblClick(frame())
  await nearWidth(358)
  await userEvent.click(tool('原始尺寸'))
  await nearWidth(1000)
  wheel(-10000)
  await nearWidth(2000)
})

it('小图旋转、调整视口并复位后也不会自动撑满', async () => {
  await image(picture(100, 50))
  await ready()
  await userEvent.click(tool('旋转'))
  await nearWidth(50)
  await vi.waitFor(() => expect(frame().getBoundingClientRect().height).toBeCloseTo(100, 0))
  await page.viewport(390, 844)
  await nearWidth(50)
  wheel(-10000)
  await nearWidth(100)
  await userEvent.click(tool('适应窗口'))
  await nearWidth(50)
})

it.each(['entering', 'open'])(
  '高清 preview 在 %s 时到达,不打断 Hero 且平滑更新尺寸和缩放上限',
  async phase => {
    const small = picture(320, 180)
    const large = picture(1920, 1080)
    let release!: () => void
    const gate = new Promise<void>(resolve => {
      release = resolve
    })
    const decode = HTMLImageElement.prototype.decode
    vi.spyOn(HTMLImageElement.prototype, 'decode').mockImplementation(function (
      this: HTMLImageElement,
    ) {
      const pending = decode.call(this)
      return this.src === large ? pending.then(() => gate) : pending
    })
    await image(small, large)
    if (phase === 'open') {
      await ready()
      await nearWidth(320)
    }
    const samples: Array<{ phase: string; width: number }> = []
    let sampling = true
    const sample = () => {
      if (!sampling) return
      if (dialog()) samples.push({ phase: dialog()!.dataset.hnPhase!, width: width() })
      requestAnimationFrame(sample)
    }
    requestAnimationFrame(sample)
    release()
    await ready()
    await vi.waitFor(() => expect(width()).toBeGreaterThan(1000), { timeout: 3000 })
    await vi.waitFor(
      () => expect(new DOMMatrix(getComputedStyle(frame()).transform).a).toBeCloseTo(1, 3),
      {
        timeout: 3000,
      },
    )
    sampling = false
    const target = width()
    expect(
      samples.some(
        sample => sample.phase === 'open' && sample.width > 340 && sample.width < target - 20,
      ),
    ).toBe(true)
    expect(
      samples.filter(sample => sample.phase === 'entering').every(sample => sample.width <= 321),
    ).toBe(true)
    const opened = samples.filter(sample => sample.phase === 'open')
    expect(
      opened.every((sample, index) => index === 0 || sample.width >= opened[index - 1]!.width - 1),
    ).toBe(true)
    expect(frame().querySelectorAll('img')).toHaveLength(2)
    await userEvent.click(tool('原始尺寸'))
    await nearWidth(1920)
    wheel(-10000)
    await nearWidth(3840)
    const origin = wrapper!.find('button').element.getBoundingClientRect()
    await userEvent.keyboard('{Escape}')
    const leaving: DOMRect[] = []
    while (dialog()) {
      leaving.push(frame().getBoundingClientRect())
      await nextFrame()
    }
    expect(leaving.at(-1)!.width).toBeCloseTo(origin.width, 0)
  },
)

it('高清图加载失败时保留小图尺寸与可用交互', async () => {
  const small = picture(320, 180)
  const large = picture(1920, 1080)
  const decode = HTMLImageElement.prototype.decode
  vi.spyOn(HTMLImageElement.prototype, 'decode').mockImplementation(function (
    this: HTMLImageElement,
  ) {
    return this.src === large ? Promise.reject(new Error('decode failed')) : decode.call(this)
  })
  await image(small, large)
  await ready()
  await nearWidth(320)
  expect(frame().querySelectorAll('img')).toHaveLength(1)
  wheel(-10000)
  await nearWidth(640)
})

it('独立灯箱的来源缩略图与 src 不同时,按 src 的真实尺寸缩放', async () => {
  const thumbnail = document.createElement('img')
  thumbnail.src = picture(100, 50)
  thumbnail.style.cssText = 'position:fixed;left:40px;top:40px;width:100px;height:50px'
  document.body.appendChild(thumbnail)
  await thumbnail.decode()
  const src = picture(2400, 1200)
  wrapper = mount(Lightbox, {
    props: { open: true, items: [{ id: 'full', src, alt: '原图', source: () => thumbnail }] },
    attachTo: document.body,
  })
  await ready()
  expect(width()).toBeGreaterThan(1000)
  await userEvent.click(tool('原始尺寸'))
  await nearWidth(2400)
  wheel(-10000)
  await nearWidth(4800)
  await userEvent.keyboard('{Escape}')
  const leaving: DOMRect[] = []
  while (dialog()) {
    leaving.push(frame().getBoundingClientRect())
    await nextFrame()
  }
  expect(leaving.at(-1)!.width).toBeCloseTo(100, 0)
})

it.each(['Image', 'ImageGroup'])(
  '%s 的 previewSize 让开场直接到最终尺寸,高清替换时大小和缩放保持稳定',
  async component => {
    const small = picture(320, 180)
    const large = picture(1920, 1080)
    let release!: () => void
    const gate = new Promise<void>(resolve => {
      release = resolve
    })
    const decode = HTMLImageElement.prototype.decode
    vi.spyOn(HTMLImageElement.prototype, 'decode').mockImplementation(function (
      this: HTMLImageElement,
    ) {
      const pending = decode.call(this)
      return this.src === large ? pending.then(() => gate) : pending
    })
    const props = {
      src: small,
      preview: large,
      previewSize: { width: 1920, height: 1080 },
      alt: '已知尺寸',
      lazy: false,
      style: { width: '160px', height: '90px' },
    }
    wrapper =
      component === 'Image'
        ? mount(Image, { props, attachTo: document.body })
        : mount(ImageGroup, { slots: { default: () => h(Image, props) }, attachTo: document.body })
    await vi.waitFor(() =>
      expect((wrapper!.find('img').element as HTMLImageElement).naturalWidth).toBe(320),
    )
    const trigger = wrapper.find('button').element
    const source = trigger.getBoundingClientRect()
    expect(source.width).toBe(160)
    expect(source.height).toBe(90)
    expect(wrapper.find('img').attributes('previewsize')).toBeUndefined()
    await userEvent.click(trigger)
    const entering: DOMRect[] = []
    while (dialog()?.dataset.hnPhase !== 'open') {
      if (dialog()) entering.push(frame().getBoundingClientRect())
      await nextFrame()
    }
    expect(Math.min(...entering.map(rect => rect.width))).toBeLessThan(240)
    expect(width()).toBeGreaterThan(1000)
    expect(frame().querySelectorAll('img')).toHaveLength(1)
    const initial = frame().getBoundingClientRect()
    await userEvent.click(tool('原始尺寸'))
    await nearWidth(1920)
    const samples: DOMRect[] = []
    let sampling = true
    const sample = () => {
      if (!sampling) return
      samples.push(frame().getBoundingClientRect())
      requestAnimationFrame(sample)
    }
    requestAnimationFrame(sample)
    release()
    await vi.waitFor(() => expect(frame().querySelectorAll('img')).toHaveLength(2))
    for (let count = 0; count < 20; count++) await nextFrame()
    sampling = false
    expect(samples.length).toBeGreaterThan(10)
    expect(samples.every(rect => Math.abs(rect.width - 1920) < 1)).toBe(true)
    wheel(-10000)
    await nearWidth(3840)
    await userEvent.click(tool('适应窗口'))
    await nearWidth(initial.width)
    await userEvent.keyboard('{Escape}')
    const leaving: DOMRect[] = []
    while (dialog()) {
      leaving.push(frame().getBoundingClientRect())
      await nextFrame()
    }
    expect(leaving.at(-1)!.width).toBeCloseTo(source.width, 0)
    expect(leaving.at(-1)!.height).toBeCloseTo(source.height, 0)
  },
)

it.each([false, true])('独立灯箱有 previewSize 时不等待 src 解码,矩形来源=%s', async virtual => {
  const src = picture(1920, 1080)
  const bounds = { x: 80, y: 60, width: 160, height: 90 }
  const pending = vi
    .spyOn(HTMLImageElement.prototype, 'decode')
    .mockImplementation(() => new Promise(() => {}))
  const entering: DOMRect[] = []
  const observer = new MutationObserver(() => {
    const target = dialog()?.dataset.hnPhase === 'entering' ? frame() : undefined
    if (target) entering.push(target.getBoundingClientRect())
  })
  onTestFinished(() => observer.disconnect())
  observer.observe(document.body, { subtree: true, attributes: true, attributeFilter: ['style'] })
  wrapper = mount(Lightbox, {
    props: {
      open: true,
      items: [
        {
          id: 'known',
          src,
          previewSize: { width: 1920, height: 1080 },
          alt: '已知尺寸',
          source: virtual ? () => bounds : undefined,
        },
      ],
    },
    attachTo: document.body,
  })
  await ready()
  observer.disconnect()
  expect(pending).not.toHaveBeenCalled()
  expect(width()).toBeGreaterThan(1000)
  if (virtual) {
    expect(
      Math.min(...entering.map(rect => Math.hypot(rect.x - bounds.x, rect.y - bounds.y))),
    ).toBeLessThan(8)
    expect(Math.min(...entering.map(rect => rect.width))).toBeLessThan(200)
  }
  await userEvent.click(tool('原始尺寸'))
  await nearWidth(1920)
  await userEvent.keyboard('{Escape}')
  const leaving: DOMRect[] = []
  while (dialog()) {
    leaving.push(frame().getBoundingClientRect())
    await nextFrame()
  }
  if (virtual) {
    const last = leaving.at(-1)!
    expect(last.width).toBeCloseTo(bounds.width, 0)
    expect(Math.hypot(last.x - bounds.x, last.y - bounds.y)).toBeLessThan(4)
  }
})
