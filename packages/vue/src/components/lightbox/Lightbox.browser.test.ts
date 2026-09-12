import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import { page, userEvent } from '@vitest/browser/context'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import Image from '../image/Image.vue'
import ImageGroup from '../image/ImageGroup.vue'
import { ZOOM_DOUBLE_TAP, ZOOM_MAX } from './utils/zoom'
import '../../../test/browser.css'

let mounted: VueWrapper[] = []

beforeEach(async () => {
  document.body.innerHTML = ''
  await page.viewport(1024, 768)
})

afterEach(() => {
  mounted.forEach(w => w.unmount())
  mounted = []
})

function picture(width: number, height: number): string {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#39c5bb'
  ctx.fillRect(0, 0, width, height)
  ctx.fillStyle = '#171717'
  ctx.fillRect(0, 0, width / 2, height)
  return canvas.toDataURL()
}

async function harness() {
  const src = picture(400, 200)
  const host = document.createElement('div')
  document.body.appendChild(host)
  const w = mount(
    defineComponent({
      setup: () => () =>
        h(
          'div',
          { style: 'padding: 80px' },
          h(Image, { src, alt: '海边', lazy: false, preview: true, class: 'size-48' }),
        ),
    }),
    { attachTo: host },
  )
  mounted.push(w)
  const img = w.find('img').element as HTMLImageElement
  await vi.waitFor(() => expect(img.naturalWidth).toBe(400))
  return { w, img, trigger: w.find('button').element as HTMLElement }
}

const dialog = () => document.querySelector('[role="dialog"]') as HTMLElement | null
const frame = () => (dialog()?.querySelector('[class*="cursor-"]') ?? null) as HTMLElement | null
const scrim = () => (dialog()?.querySelector('.hn-scrim') ?? null) as HTMLElement | null
const strip = () => frame()?.parentElement?.parentElement ?? null
const title = () => {
  const id = dialog()?.getAttribute('aria-labelledby')
  return id ? document.getElementById(id)?.textContent : undefined
}
const thumbs = () => [...(dialog()?.querySelectorAll('[aria-current]') ?? [])] as HTMLElement[]
const thumbButtons = () =>
  [...(dialog()?.querySelectorAll('[data-hn-thumbs] button') ?? [])] as HTMLElement[]
const tool = (label: string) =>
  dialog()?.querySelector(`[data-hn-chrome] [aria-label="${label}"]`) as HTMLButtonElement | null

async function groupHarness(loop = false) {
  const sources = [picture(400, 200), picture(200, 400), picture(300, 300)]
  const host = document.createElement('div')
  document.body.appendChild(host)
  const w = mount(
    defineComponent({
      setup: () => () =>
        h(ImageGroup, { loop }, () =>
          h(
            'div',
            { style: 'padding: 80px; display: flex; gap: 16px' },
            ['第一张', '第二张', '第三张'].map((alt, at) =>
              h(Image, { src: sources[at], alt, lazy: false, preview: true, class: 'size-48' }),
            ),
          ),
        ),
    }),
    { attachTo: host },
  )
  mounted.push(w)
  const images = w.findAll('img').map(node => node.element as HTMLImageElement)
  await vi.waitFor(() => expect(images.every(img => img.naturalWidth > 0)).toBe(true))
  return { w, triggers: w.findAll('button').map(node => node.element as HTMLElement) }
}

const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms))

interface PointerInit {
  id?: number
  type?: 'mouse' | 'touch'
}

function pointer(type: string, target: EventTarget, x: number, y: number, init: PointerInit = {}) {
  target.dispatchEvent(
    new PointerEvent(type, {
      bubbles: true,
      cancelable: true,
      clientX: x,
      clientY: y,
      pointerId: init.id ?? 1,
      pointerType: init.type ?? 'mouse',
      isPrimary: (init.id ?? 1) === 1,
      button: 0,
      buttons: type === 'pointerup' ? 0 : 1,
    }),
  )
}

async function drag(from: [number, number], to: [number, number], steps = 6, pause = 20) {
  const el = frame()!
  pointer('pointerdown', el, from[0], from[1])
  for (let step = 1; step <= steps; step += 1) {
    await sleep(pause)
    pointer(
      'pointermove',
      dialog()!,
      from[0] + ((to[0] - from[0]) * step) / steps,
      from[1] + ((to[1] - from[1]) * step) / steps,
    )
  }
}

async function dragFrame(dy: number, midway?: () => void) {
  const rect = frame()!.getBoundingClientRect()
  const x = rect.x + rect.width / 2
  const y = rect.y + rect.height / 2
  await drag([x, y], [x, y + dy])
  await sleep(20)
  midway?.()
  pointer('pointerup', dialog()!, x, y + dy)
}

async function slowDrag(from: [number, number], dx: number, dy: number) {
  await drag(from, [from[0] + dx, from[1] + dy])
  await sleep(60)
  pointer('pointerup', dialog()!, from[0] + dx, from[1] + dy)
}

async function tap(x: number, y: number) {
  pointer('pointerdown', frame()!, x, y)
  await sleep(30)
  pointer('pointerup', dialog()!, x, y)
}

function matrix() {
  const transform = getComputedStyle(frame()!).transform
  return transform === 'none' ? new DOMMatrix() : new DOMMatrix(transform)
}

async function open(trigger: HTMLElement) {
  await userEvent.click(trigger)
  await vi.waitFor(() => expect(dialog()).toBeTruthy())
}

function expectAtRest() {
  const rect = frame()!.getBoundingClientRect()
  expect(rect.x).toBeCloseTo(0, 0)
  expect(rect.y).toBeCloseTo(128, 0)
  expect(rect.width).toBeCloseTo(1024, 0)
  expect(rect.height).toBeCloseTo(512, 0)
}

const CENTER = { x: 512, y: 384 }

function pointUnder(point: { x: number; y: number }) {
  const m = matrix()
  return { x: (point.x - CENTER.x - m.e) / m.a, y: (point.y - CENTER.y - m.f) / m.a }
}

function expectFixedPoint(
  point: { x: number; y: number },
  before: { x: number; y: number },
  axes: 'x' | 'both' = 'both',
) {
  const now = pointUnder(point)
  expect(now.x).toBeCloseTo(before.x, 0)
  if (axes === 'both') expect(now.y).toBeCloseTo(before.y, 0)
}

async function settled() {
  await vi.waitFor(() => expect(dialog()?.getAttribute('data-hn-phase')).toBe('open'), {
    timeout: 3000,
  })
  await vi.waitFor(() => expect(getComputedStyle(frame()!).transform).toBe('none'), {
    timeout: 3000,
  })
  await sleep(50)
}

async function openAtRest() {
  const { trigger } = await harness()
  await open(trigger)
  await vi.waitFor(expectAtRest, { timeout: 3000 })
  await settled()
  return trigger
}

describe('lightbox · 打开与关闭', () => {
  it('从缩略图长到舞台中央;标题是 alt;锁滚;焦点进舞台;舞台是恒暗环境', async () => {
    const { trigger } = await harness()
    expect(dialog()).toBeNull()

    await open(trigger)
    const stage = dialog()!
    expect(stage.classList.contains('dark')).toBe(true)
    expect(scrim()).toBeTruthy()
    expect(getComputedStyle(frame()!).transform).not.toBe('none')

    const labelId = stage.getAttribute('aria-labelledby')!
    expect(document.getElementById(labelId)!.textContent).toBe('海边')
    expect(document.body.style.overflow).toBe('hidden')
    expect(document.body.style.pointerEvents).toBe('none')
    expect(stage.contains(document.activeElement)).toBe(true)

    await vi.waitFor(expectAtRest, { timeout: 2000 })
    expect(Number(getComputedStyle(scrim()!).opacity)).toBeCloseTo(1, 1)
  })

  it('Esc 关闭并把焦点还给缩略图', async () => {
    const { trigger } = await harness()
    await open(trigger)
    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(dialog()).toBeNull())
    expect(document.activeElement).toBe(trigger)
    expect(document.body.style.overflow).toBe('')
  })

  it('右上角关闭钮与轻点暗色区域都能关闭', async () => {
    const { trigger } = await harness()
    await open(trigger)
    const close = dialog()!.querySelector('[aria-label="关闭"]') as HTMLElement
    expect(close).toBeTruthy()
    await userEvent.click(close)
    await vi.waitFor(() => expect(dialog()).toBeNull())

    await open(trigger)
    await settled()
    await userEvent.click(dialog()!, { force: true, position: { x: 4, y: 4 } })
    await vi.waitFor(() => expect(dialog()).toBeNull())
  })

  it('入场中再点一下是打断入场:原路退回并关闭', async () => {
    const { trigger } = await harness()
    await open(trigger)
    await sleep(40)
    expect(getComputedStyle(frame()!).transform).not.toBe('none')
    await tap(CENTER.x, CENTER.y)
    await vi.waitFor(() => expect(dialog()).toBeNull(), { timeout: 3000 })
  })

  it('入场中的滚轮与拖动不响应', async () => {
    const { trigger } = await harness()
    await open(trigger)
    await sleep(40)
    frame()!.dispatchEvent(
      new WheelEvent('wheel', {
        bubbles: true,
        cancelable: true,
        deltaY: -400,
        clientX: 600,
        clientY: 300,
      }),
    )
    await drag([CENTER.x, CENTER.y], [CENTER.x, CENTER.y + 200])
    pointer('pointerup', dialog()!, CENTER.x, CENTER.y + 200)
    await settled()
    expect(dialog()).toBeTruthy()
    expect(matrix().a).toBeCloseTo(1, 2)
    expectAtRest()
  })

  it('退场中再点一下是打断退场:回到打开态', async () => {
    await openAtRest()
    await userEvent.keyboard('{Escape}')
    await sleep(60)
    expect(dialog()).toBeTruthy()
    await tap(CENTER.x, CENTER.y)
    await sleep(600)
    expect(dialog()).toBeTruthy()
    await settled()
    expectAtRest()
    expect(Number(getComputedStyle(scrim()!).opacity)).toBeCloseTo(1, 1)
    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(dialog()).toBeNull(), { timeout: 3000 })
  })

  it('向下拖过提交距离即关闭,拖动期间图片缩小、背景透出', async () => {
    await openAtRest()
    await dragFrame(300, () => {
      expect(Number(getComputedStyle(scrim()!).opacity)).toBeLessThan(1)
      const rect = frame()!.getBoundingClientRect()
      expect(rect.width).toBeLessThan(1024)
      expect(rect.y).toBeGreaterThan(128)
    })
    await vi.waitFor(() => expect(dialog()).toBeNull(), { timeout: 2000 })
  })

  it('拖动距离不够时弹回原位,预览保持打开', async () => {
    await openAtRest()
    await dragFrame(40)
    await sleep(400)
    expect(dialog()).toBeTruthy()
    await vi.waitFor(expectAtRest, { timeout: 2000 })
    expect(Number(getComputedStyle(scrim()!).opacity)).toBeCloseTo(1, 1)
  })
})

describe('lightbox · 缩放与拖动', () => {
  it('滚轮以指针所指的点为中心缩放,缩回原始大小时位移归零', async () => {
    await openAtRest()
    const point = { x: 700, y: 300 }
    const wheel = (deltaY: number) =>
      frame()!.dispatchEvent(
        new WheelEvent('wheel', {
          bubbles: true,
          cancelable: true,
          deltaY,
          clientX: point.x,
          clientY: point.y,
        }),
      )

    const first = pointUnder(point)
    wheel(-200)
    await vi.waitFor(() => expect(matrix().a).toBeGreaterThan(1))
    expect(matrix().f).toBe(0)
    expectFixedPoint(point, first, 'x')

    const second = pointUnder(point)
    wheel(-200)
    await vi.waitFor(() => expect(matrix().a).toBeGreaterThan(1.4))
    expectFixedPoint(point, second)

    wheel(2000)
    await vi.waitFor(() => expect(matrix().a).toBeCloseTo(1, 3))
    expect(matrix().e).toBeCloseTo(0, 3)
    expect(matrix().f).toBeCloseTo(0, 3)
  })

  it('动画进行中滚轮缩放不会把画面推出边界', async () => {
    await openAtRest()
    await tap(CENTER.x, CENTER.y)
    await sleep(60)
    await tap(CENTER.x, CENTER.y)
    await vi.waitFor(() => expect(matrix().a).toBeCloseTo(ZOOM_DOUBLE_TAP, 2), { timeout: 2000 })

    await drag([CENTER.x, CENTER.y], [CENTER.x - 160, CENTER.y - 120], 4, 16)
    pointer('pointerup', dialog()!, CENTER.x - 160, CENTER.y - 120)
    await sleep(40)
    frame()!.dispatchEvent(
      new WheelEvent('wheel', {
        bubbles: true,
        cancelable: true,
        deltaY: 300,
        clientX: 200,
        clientY: 200,
      }),
    )
    await sleep(1500)
    const rect = frame()!.getBoundingClientRect()
    if (rect.width > 1024) {
      expect(rect.left).toBeLessThanOrEqual(0.5)
      expect(rect.right).toBeGreaterThanOrEqual(1023.5)
    } else {
      expect(rect.left + rect.width / 2).toBeCloseTo(512, 0)
    }
    if (rect.height > 768) {
      expect(rect.top).toBeLessThanOrEqual(0.5)
      expect(rect.bottom).toBeGreaterThanOrEqual(767.5)
    } else {
      expect(rect.top + rect.height / 2).toBeCloseTo(384, 0)
    }
  })

  it('双击在指下放大到规格倍数,再双击回到原始大小', async () => {
    await openAtRest()
    const point = { x: 700, y: 300 }
    const under = { x: point.x - CENTER.x, y: point.y - CENTER.y }

    await tap(point.x, point.y)
    await sleep(60)
    await tap(point.x, point.y)
    await vi.waitFor(() => expect(matrix().a).toBeCloseTo(ZOOM_DOUBLE_TAP, 2), { timeout: 2000 })
    expectFixedPoint(point, under)
    expect(frame()!.className).toContain('cursor-grab')

    await tap(point.x, point.y)
    await sleep(60)
    await tap(point.x, point.y)
    await vi.waitFor(() => expect(matrix().a).toBeCloseTo(1, 2), { timeout: 2000 })
    await vi.waitFor(() => expect(matrix().e).toBeCloseTo(0, 1))
    expect(frame()!.className).not.toContain('cursor-grab')
  })

  it('双指捏合实时跟手,越过上限有阻力,松手弹回上限', async () => {
    await openAtRest()
    const el = frame()!
    const stage = dialog()!
    const touch = (type: string, id: number, x: number) =>
      pointer(type, type === 'pointerdown' ? el : stage, x, CENTER.y, { id, type: 'touch' })

    touch('pointerdown', 1, 462)
    touch('pointerdown', 2, 562)
    await sleep(20)
    touch('pointermove', 1, 362)
    touch('pointermove', 2, 662)
    await vi.waitFor(() => expect(matrix().a).toBeCloseTo(3, 2))
    touch('pointerup', 1, 362)
    touch('pointerup', 2, 662)
    await sleep(300)
    expect(matrix().a).toBeCloseTo(3, 2)

    touch('pointerdown', 1, 412)
    touch('pointerdown', 2, 612)
    await sleep(20)
    touch('pointermove', 1, 112)
    touch('pointermove', 2, 912)
    await vi.waitFor(() => expect(matrix().a).toBeGreaterThan(ZOOM_MAX))
    expect(matrix().a).toBeLessThan(12)
    touch('pointerup', 1, 112)
    touch('pointerup', 2, 912)
    await vi.waitFor(() => expect(matrix().a).toBeCloseTo(ZOOM_MAX, 2), { timeout: 2000 })
  })

  it('放大后拖动一比一跟手,越过边缘有阻力,松手弹回边界', async () => {
    await openAtRest()
    await tap(CENTER.x, CENTER.y)
    await sleep(60)
    await tap(CENTER.x, CENTER.y)
    await vi.waitFor(() => expect(matrix().a).toBeCloseTo(ZOOM_DOUBLE_TAP, 2), { timeout: 2000 })
    expect(matrix().e).toBeCloseTo(0, 1)

    await slowDrag([CENTER.x, CENTER.y], 300, 0)
    await sleep(100)
    expect(matrix().e).toBeCloseTo(300, 0)
    expect(frame()!.className).toContain('cursor-grab')

    await drag([CENTER.x, CENTER.y], [CENTER.x + 900, CENTER.y])
    await vi.waitFor(() => expect(matrix().e).toBeGreaterThan(768))
    expect(matrix().e).toBeLessThan(1200)
    await sleep(60)
    pointer('pointerup', dialog()!, CENTER.x + 900, CENTER.y)
    await vi.waitFor(() => expect(matrix().e).toBeCloseTo(768, 0), { timeout: 2000 })
  })

  it('快速甩动后继续滑行并停在边界之内', async () => {
    await openAtRest()
    await tap(CENTER.x, CENTER.y)
    await sleep(60)
    await tap(CENTER.x, CENTER.y)
    await vi.waitFor(() => expect(matrix().a).toBeCloseTo(ZOOM_DOUBLE_TAP, 2), { timeout: 2000 })

    await drag([CENTER.x, CENTER.y], [CENTER.x - 160, CENTER.y], 4, 16)
    pointer('pointerup', dialog()!, CENTER.x - 160, CENTER.y)
    const released = matrix().e
    await sleep(150)
    expect(matrix().e).toBeLessThan(released)
    await sleep(1500)
    const settled = matrix().e
    expect(settled).toBeGreaterThanOrEqual(-768.5)
    expect(settled).toBeLessThan(released)
    await sleep(100)
    expect(matrix().e).toBeCloseTo(settled, 1)
  })

  it('放大状态下向下拖只平移画面,不关闭也不透出背景', async () => {
    await openAtRest()
    await tap(CENTER.x, CENTER.y)
    await sleep(60)
    await tap(CENTER.x, CENTER.y)
    await vi.waitFor(() => expect(matrix().a).toBeCloseTo(ZOOM_DOUBLE_TAP, 2), { timeout: 2000 })

    await slowDrag([CENTER.x, CENTER.y], 0, 200)
    await sleep(100)
    expect(dialog()).toBeTruthy()
    expect(matrix().f).toBeCloseTo(200, 0)
    expect(matrix().a).toBeCloseTo(ZOOM_DOUBLE_TAP, 2)
    expect(Number(getComputedStyle(scrim()!).opacity)).toBeCloseTo(1, 1)
  })

  it('只有一张图时没有左右按钮和缩略图条,工具栏仍在', async () => {
    await openAtRest()
    expect(dialog()!.querySelector('[aria-label="上一页"]')).toBeNull()
    expect(dialog()!.querySelector('[data-hn-thumbs]')).toBeNull()
    expect(tool('旋转')).toBeTruthy()
    expect(tool('下载')).toBeTruthy()
  })

  it('工具栏按钮以画面中心缩放,复位常驻且只在放大后可用', async () => {
    await openAtRest()
    expect(tool('恢复原始大小')!.disabled).toBe(true)
    await userEvent.click(tool('放大')!)
    await vi.waitFor(() => expect(matrix().a).toBeCloseTo(1.5, 2), { timeout: 2000 })
    expect(matrix().e).toBeCloseTo(0, 1)
    await vi.waitFor(() => expect(tool('恢复原始大小')!.disabled).toBe(false))
    await userEvent.click(tool('放大')!)
    await vi.waitFor(() => expect(matrix().a).toBeCloseTo(2.25, 2), { timeout: 2000 })
    await userEvent.click(tool('缩小')!)
    await vi.waitFor(() => expect(matrix().a).toBeCloseTo(1.5, 2), { timeout: 2000 })
    await userEvent.click(tool('恢复原始大小')!)
    await vi.waitFor(() => expect(matrix().a).toBeCloseTo(1, 2), { timeout: 2000 })
    await vi.waitFor(() => expect(tool('恢复原始大小')!.disabled).toBe(true), { timeout: 2000 })
  })

  it('旋转每次 90 度,横图转竖后缩到能放进舞台,缩放与位置复位', async () => {
    await openAtRest()
    await tap(700, 300)
    await sleep(60)
    await tap(700, 300)
    await vi.waitFor(() => expect(matrix().a).toBeCloseTo(ZOOM_DOUBLE_TAP, 2), { timeout: 2000 })

    await userEvent.click(tool('旋转')!)
    await vi.waitFor(
      () => {
        const m = matrix()
        expect(m.a).toBeCloseTo(0, 2)
        expect(m.b).toBeCloseTo(0.75, 2)
        expect(m.e).toBeCloseTo(0, 1)
        expect(m.f).toBeCloseTo(0, 1)
      },
      { timeout: 2000 },
    )
    const rect = frame()!.getBoundingClientRect()
    expect(rect.height).toBeCloseTo(768, 0)
    expect(rect.width).toBeCloseTo(384, 0)

    await userEvent.click(tool('旋转')!)
    await userEvent.click(tool('旋转')!)
    await userEvent.click(tool('旋转')!)
    await vi.waitFor(
      () => {
        const m = matrix()
        expect(m.a).toBeCloseTo(1, 2)
        expect(m.b).toBeCloseTo(0, 2)
      },
      { timeout: 3000 },
    )

    await userEvent.keyboard('{Escape}')
    await sleep(100)
    const m = matrix()
    expect(Math.abs(Math.atan2(m.b, m.a))).toBeLessThan(0.05)
    await vi.waitFor(() => expect(dialog()).toBeNull(), { timeout: 3000 })
  })

  it('下载能直接保存时走下载,否则在新标签打开', async () => {
    await openAtRest()
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
    const opened = vi.spyOn(window, 'open').mockImplementation(() => null)
    await userEvent.click(tool('下载')!)
    await vi.waitFor(() => expect(click).toHaveBeenCalledTimes(1))
    expect(opened).not.toHaveBeenCalled()
    click.mockRestore()
    opened.mockRestore()
  })

  it('关掉再打开一切复位', async () => {
    const trigger = await openAtRest()
    await tap(700, 300)
    await sleep(60)
    await tap(700, 300)
    await vi.waitFor(() => expect(matrix().a).toBeCloseTo(ZOOM_DOUBLE_TAP, 2), { timeout: 2000 })

    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(dialog()).toBeNull(), { timeout: 2000 })
    await open(trigger)
    await vi.waitFor(expectAtRest, { timeout: 2000 })
    await vi.waitFor(() => expect(matrix().a).toBeCloseTo(1, 2))
    await vi.waitFor(() => expect(matrix().e).toBeCloseTo(0, 1))
  })
})

describe('lightbox · 两档清晰度', () => {
  it('先用页面上的小图,大图到位后叠在上面', async () => {
    const small = picture(400, 200)
    const big = picture(800, 400)
    const host = document.createElement('div')
    document.body.appendChild(host)
    const w = mount(
      defineComponent({
        setup: () => () =>
          h(
            'div',
            { style: 'padding: 80px' },
            h(Image, { src: small, alt: '海边', lazy: false, preview: big, class: 'size-48' }),
          ),
      }),
      { attachTo: host },
    )
    mounted.push(w)
    const thumb = w.find('img').element as HTMLImageElement
    await vi.waitFor(() => expect(thumb.naturalWidth).toBe(400))
    await open(w.find('button').element as HTMLElement)
    expect(frame()!.querySelector('img')!.getAttribute('src')).toBe(small)
    await vi.waitFor(
      () => {
        const layers = frame()!.querySelectorAll('img')
        expect(layers).toHaveLength(2)
        expect(layers[1]!.getAttribute('src')).toBe(big)
      },
      { timeout: 3000 },
    )
    expect(frame()!.querySelector('img')!.getAttribute('src')).toBe(small)
  })

  it('大图与小图同址时不加载第二次', async () => {
    await openAtRest()
    await sleep(300)
    expect(frame()!.querySelectorAll('img')).toHaveLength(1)
  })
})

describe('lightbox · 分组与翻页', () => {
  async function openGroup(at: number, loop = false) {
    const { triggers } = await groupHarness(loop)
    await open(triggers[at]!)
    await settled()
    return triggers
  }

  const stripX = () => new DOMMatrix(getComputedStyle(strip()!).transform).e

  it('从组内任意一张打开,缩略图条标出当前项,左右按钮在首尾禁用', async () => {
    await openGroup(1)
    expect(title()).toBe('第二张')
    expect(thumbButtons()).toHaveLength(3)
    expect(thumbs()).toHaveLength(1)
    expect(thumbs()[0]!.getAttribute('aria-label')).toBe('第二张')
    const prev = dialog()!.querySelector('[aria-label="上一页"]') as HTMLButtonElement
    const next = dialog()!.querySelector('[aria-label="下一页"]') as HTMLButtonElement
    expect(prev.disabled).toBe(false)
    expect(next.disabled).toBe(false)

    await userEvent.keyboard('{ArrowRight}')
    await vi.waitFor(() => expect(title()).toBe('第三张'))
    await vi.waitFor(() => expect(stripX()).toBeCloseTo(-2048, 0), { timeout: 2000 })
    expect(next.disabled).toBe(true)
    expect(thumbs()[0]!.getAttribute('aria-label')).toBe('第三张')

    await userEvent.keyboard('{ArrowRight}')
    await sleep(400)
    expect(title()).toBe('第三张')

    await userEvent.click(prev)
    await vi.waitFor(() => expect(title()).toBe('第二张'))
    await userEvent.click(thumbButtons()[0]!)
    await vi.waitFor(() => expect(title()).toBe('第一张'))
    await vi.waitFor(() => expect(stripX()).toBeCloseTo(0, 0), { timeout: 2000 })
    expect(prev.disabled).toBe(true)
  })

  it('缩略图有悬停薄墨与按下波纹,墨在图片之上', async () => {
    await openGroup(0)
    const thumb = thumbButtons()[2]!
    const image = thumb.querySelector('img')!
    expect(getComputedStyle(thumb).isolation).toBe('isolate')
    expect(getComputedStyle(image).zIndex).toBe('-10')
    expect(thumb.querySelector('.hn-ripple')).toBeTruthy()

    const probe = document.createElement('span')
    probe.style.opacity = 'var(--hn-state-hover-opacity)'
    dialog()!.appendChild(probe)
    const hover = Number(getComputedStyle(probe).opacity)
    expect(hover).toBeGreaterThan(0)

    expect(Number(getComputedStyle(thumb, '::after').opacity)).toBe(0)
    await userEvent.hover(thumb)
    await vi.waitFor(() =>
      expect(Number(getComputedStyle(thumb, '::after').opacity)).toBeCloseTo(hover, 2),
    )
  })

  it('未放大时横向拖动翻页,相邻两张跟手露出,不到位则退回', async () => {
    await openGroup(0)
    await drag([CENTER.x, CENTER.y], [CENTER.x - 60, CENTER.y])
    await vi.waitFor(() => expect(stripX()).toBeCloseTo(-60, 0))
    expect(dialog()!.querySelectorAll('img').length).toBeGreaterThan(1)
    await sleep(60)
    pointer('pointerup', dialog()!, CENTER.x - 60, CENTER.y)
    await sleep(400)
    expect(title()).toBe('第一张')
    await vi.waitFor(() => expect(stripX()).toBeCloseTo(0, 0), { timeout: 2000 })

    await slowDrag([CENTER.x, CENTER.y], -300, 0)
    await vi.waitFor(() => expect(title()).toBe('第二张'))
    await vi.waitFor(() => expect(stripX()).toBeCloseTo(-1024, 0), { timeout: 2000 })
  })

  it('轻轻一甩也能翻,再快也只翻一张', async () => {
    await openGroup(0)
    await drag([CENTER.x, CENTER.y], [CENTER.x - 360, CENTER.y], 3, 16)
    pointer('pointerup', dialog()!, CENTER.x - 360, CENTER.y)
    await vi.waitFor(() => expect(title()).toBe('第二张'))
    await vi.waitFor(() => expect(stripX()).toBeCloseTo(-1024, 0), { timeout: 2000 })
    await sleep(300)
    expect(title()).toBe('第二张')
  })

  it('翻页动画中按下是接管:条带停在手里,松手去最近的一页', async () => {
    await openGroup(0)
    await userEvent.keyboard('{ArrowRight}')
    await sleep(70)
    pointer('pointerdown', frame()!, CENTER.x, CENTER.y)
    await sleep(30)
    const grabbed = stripX()
    expect(grabbed).toBeLessThan(0)
    expect(grabbed).toBeGreaterThan(-1024)
    await sleep(120)
    expect(stripX()).toBeCloseTo(grabbed, 0)
    pointer('pointerup', dialog()!, CENTER.x, CENTER.y)
    await sleep(100)
    expect(dialog()).toBeTruthy()
    const nearest = Math.round(-grabbed / 1024)
    await vi.waitFor(() => expect(stripX()).toBeCloseTo(-nearest * 1024, 0), { timeout: 3000 })
    expect(title()).toBe(nearest === 0 ? '第一张' : '第二张')
  })

  it('接管翻页时落在图片之间的暗区松手,不算轻点暗区,不关闭', async () => {
    await openGroup(0)
    await userEvent.keyboard('{ArrowRight}')
    await sleep(70)
    pointer('pointerdown', dialog()!, 8, 8)
    await sleep(30)
    pointer('pointerup', dialog()!, 8, 8)
    await sleep(500)
    expect(dialog()).toBeTruthy()
    await vi.waitFor(() => expect([0, -1024]).toContain(Math.round(stripX())), { timeout: 3000 })
  })

  it('翻页动画中按下再拖动,条带从手里的位置跟走而不是跳到目标页', async () => {
    await openGroup(0)
    await userEvent.keyboard('{ArrowRight}')
    await sleep(70)
    pointer('pointerdown', frame()!, CENTER.x, CENTER.y)
    await sleep(30)
    const grabbed = stripX()
    pointer('pointermove', dialog()!, CENTER.x + 40, CENTER.y)
    await vi.waitFor(() => expect(stripX()).toBeCloseTo(grabbed + 40, 0))
    await sleep(60)
    pointer('pointerup', dialog()!, CENTER.x + 40, CENTER.y)
    await vi.waitFor(() => expect([0, -1024]).toContain(Math.round(stripX())), { timeout: 3000 })
  })

  it('开启 loop 后翻到尽头自动回到另一端,箭头不再禁用,拖动没有阻力', async () => {
    await openGroup(2, true)
    const prev = dialog()!.querySelector('[aria-label="上一页"]') as HTMLButtonElement
    const next = dialog()!.querySelector('[aria-label="下一页"]') as HTMLButtonElement
    expect(prev.disabled).toBe(false)
    expect(next.disabled).toBe(false)

    await userEvent.keyboard('{ArrowRight}')
    await vi.waitFor(() => expect(title()).toBe('第一张'))
    await vi.waitFor(() => expect(stripX()).toBeCloseTo(-3072, 0), { timeout: 3000 })
    expect(thumbs()[0]!.getAttribute('aria-label')).toBe('第一张')

    await userEvent.keyboard('{ArrowLeft}')
    await vi.waitFor(() => expect(title()).toBe('第三张'))
    await vi.waitFor(() => expect(stripX()).toBeCloseTo(-2048, 0), { timeout: 3000 })

    await slowDrag([CENTER.x, CENTER.y], -300, 0)
    await vi.waitFor(() => expect(title()).toBe('第一张'))
    await vi.waitFor(() => expect(stripX()).toBeCloseTo(-3072, 0), { timeout: 3000 })

    await userEvent.click(thumbButtons()[2]!)
    await vi.waitFor(() => expect(title()).toBe('第三张'))
    await vi.waitFor(() => expect(stripX()).toBeCloseTo(-2048, 0), { timeout: 3000 })
  })

  it('拖到尽头有阻力并回弹', async () => {
    await openGroup(0)
    await drag([CENTER.x, CENTER.y], [CENTER.x + 300, CENTER.y])
    await vi.waitFor(() => expect(stripX()).toBeGreaterThan(0))
    expect(stripX()).toBeLessThan(300)
    await sleep(60)
    pointer('pointerup', dialog()!, CENTER.x + 300, CENTER.y)
    await vi.waitFor(() => expect(stripX()).toBeCloseTo(0, 0), { timeout: 2000 })
    expect(title()).toBe('第一张')
  })

  it('放大状态下横向拖动只平移不翻页,翻页时缩放复位', async () => {
    await openGroup(0)
    await tap(CENTER.x, CENTER.y)
    await sleep(60)
    await tap(CENTER.x, CENTER.y)
    await vi.waitFor(() => expect(matrix().a).toBeCloseTo(ZOOM_DOUBLE_TAP, 2), { timeout: 2000 })

    await slowDrag([CENTER.x, CENTER.y], -300, 0)
    await sleep(100)
    expect(title()).toBe('第一张')
    expect(stripX()).toBeCloseTo(0, 0)
    expect(matrix().e).toBeCloseTo(-300, 0)

    await userEvent.keyboard('{ArrowRight}')
    await vi.waitFor(() => expect(title()).toBe('第二张'))
    await vi.waitFor(() => expect(matrix().a).toBeCloseTo(1, 2), { timeout: 2000 })
    await vi.waitFor(() => expect(stripX()).toBeCloseTo(-1024, 0), { timeout: 2000 })
  })

  it('翻过页后关闭,退回的是当前那张的缩略图', async () => {
    const triggers = await openGroup(0)
    await userEvent.keyboard('{ArrowRight}')
    await vi.waitFor(() => expect(stripX()).toBeCloseTo(-1024, 0), { timeout: 2000 })

    const centerOf = (el: Element) => {
      const rect = el.getBoundingClientRect()
      return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 }
    }
    const targets = triggers.map(centerOf)
    await userEvent.keyboard('{Escape}')
    await sleep(120)
    const at = centerOf(frame()!)
    const gaps = targets.map(target => Math.hypot(target.x - at.x, target.y - at.y))
    expect(gaps[1]).toBeLessThan(gaps[0]!)
    expect(gaps[1]).toBeLessThan(gaps[2]!)
    await vi.waitFor(() => expect(dialog()).toBeNull(), { timeout: 2000 })
  })
})

it.each(['div', 'figure'])('开关灯箱时保留外层 %s 的圆角形变', async tag => {
  const w = mount(
    {
      setup: () => () =>
        h(
          tag,
          {
            style: 'width:192px;height:128px;overflow:hidden;border-radius:16px',
          },
          h(
            'div',
            { style: 'width:100%;height:100%' },
            h(Image, {
              src: picture(400, 200),
              alt: '圆角图片',
              preview: true,
              lazy: false,
              class: 'size-full',
            }),
          ),
        ),
    },
    { attachTo: document.body },
  )
  mounted.push(w)
  const img = w.find('img').element as HTMLImageElement
  await vi.waitFor(() => expect(img.naturalWidth).toBe(400))
  await open(w.find('button').element)
  const corner = () =>
    Number.parseFloat(getComputedStyle(frame()!).clipPath.match(/round ([\d.]+)/)?.[1] ?? '0')
  await vi.waitFor(() => expect(corner()).toBeGreaterThan(0))
  await vi.waitFor(() => expect(dialog()?.dataset.hnPhase).toBe('open'))
  await userEvent.keyboard('{Escape}')
  await vi.waitFor(() => expect(corner()).toBeGreaterThan(0))
  await vi.waitFor(() => expect(dialog()).toBeNull())
})
