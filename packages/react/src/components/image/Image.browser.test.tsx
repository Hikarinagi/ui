import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import type { ReactNode } from 'react'
import { flushSync } from 'react-dom'
import { createRoot } from 'react-dom/client'
import { Image, type ImageProps } from './Image'
import { signal } from '../../../test/signal'
import '../../../test/browser.css'

let mounted: Array<{ unmount: () => Promise<void> }> = []

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(async () => {
  for (const w of mounted) await w.unmount()
  mounted = []
  vi.restoreAllMocks()
})

const PIXEL = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='

function mountUi(ui: ReactNode) {
  const container = document.body.appendChild(document.createElement('div'))
  const root = createRoot(container)
  flushSync(() => root.render(ui))
  const w = {
    element: container.firstElementChild as HTMLElement,
    unmount: async () => root.unmount(),
  }
  mounted.push(w)
  return w
}

function mountImage(props: ImageProps) {
  return mountUi(<Image {...props} />)
}

describe('image · 加载', () => {
  it('懒加载时骨架铺满外框,图片在其上层淡入', async () => {
    const w = mountImage({ src: PIXEL, fit: 'contain', ratio: 2, className: 'w-40' })
    const img = w.element.querySelector('img') as HTMLElement
    const layer = (w.element.querySelector('.hn-skeleton') as HTMLElement).parentElement!
    const host = w.element.getBoundingClientRect()
    const box = layer.getBoundingClientRect()

    expect(Math.round(box.width)).toBe(Math.round(host.width))
    expect(Math.round(box.height)).toBe(Math.round(host.height))

    expect(getComputedStyle(layer).position).toBe('absolute')
    expect(getComputedStyle(img).position).toBe('relative')
    expect(getComputedStyle(img).zIndex).toBe('10')
  })

  it('首屏图压在骨架上层,不等脚本就能显示', async () => {
    const w = mountImage({ src: PIXEL, lazy: false, className: 'h-20 w-20' })
    const style = getComputedStyle(w.element.querySelector('img') as HTMLElement)

    expect(style.position).toBe('relative')
    expect(style.zIndex).toBe('10')
  })

  it('比例容器在图片到位之前就撑住高度', async () => {
    const w = mountImage({ src: PIXEL, lazy: false, ratio: 2, className: 'w-40' })
    const box = w.element.getBoundingClientRect()
    expect(Math.round(box.width)).toBe(160)
    expect(Math.round(box.height)).toBe(80)
  })

  it('骨架铺满外框,形状交给外框裁', async () => {
    const w = mountImage({ src: PIXEL, lazy: false, ratio: 1, className: 'w-24 rounded-lg' })
    const skeleton = w.element.querySelector('.hn-skeleton') as HTMLElement
    const host = w.element.getBoundingClientRect()
    const box = skeleton.getBoundingClientRect()

    expect(Math.round(box.width)).toBe(Math.round(host.width))
    expect(Math.round(box.height)).toBe(Math.round(host.height))
    expect(getComputedStyle(skeleton).borderTopLeftRadius).toBe('0px')
    expect(getComputedStyle(w.element).overflow).toBe('hidden')
  })

  it('懒加载的图在骨架期间不绘制,边缘不会透出图片', async () => {
    const w = mountImage({ src: PIXEL, ratio: 1, className: 'w-24 rounded-lg' })
    expect(getComputedStyle(w.element.querySelector('img') as HTMLElement).opacity).toBe('0')
  })
})

describe('image · 懒加载', () => {
  function mountBelowFold(props: Partial<ImageProps>) {
    return mountUi(
      <div>
        <div style={{ height: '300vh' }} />
        <Image src={PIXEL} className="block h-20 w-20" {...props} />
      </div>,
    )
  }

  it('视口之外的图片占好位置但不带地址,滚到跟前才请求', async () => {
    const w = mountBelowFold({})

    const img = w.element.querySelector('img')
    expect(img).not.toBeNull()
    await vi.waitFor(() => expect(img!.getAttribute('src')).toBeNull())

    img!.scrollIntoView()
    await vi.waitFor(() => expect(w.element.querySelector('img')!.getAttribute('src')).toBe(PIXEL))
    await vi.waitFor(() =>
      expect(getComputedStyle(w.element.querySelector('img') as HTMLElement).opacity).toBe('1'),
    )
  })

  it('rootMargin 决定提前量,给够就不必滚到跟前', async () => {
    const w = mountBelowFold({ rootMargin: '9999px' })
    await vi.waitFor(() => expect(w.element.querySelector('img')!.getAttribute('src')).toBe(PIXEL))
  })

  it('lazy 为假时不等观察器,直接请求', async () => {
    const w = mountBelowFold({ lazy: false })
    expect(w.element.querySelector('img')!.getAttribute('src')).toBe(PIXEL)
  })
})

it.each([true, false])('懒加载图片淡入,独立于骨架是否开启 skeleton=%s', async skeleton => {
  const w = mountImage({ src: PIXEL, skeleton, className: 'h-20 w-20' })
  const img = w.element.querySelector('img') as HTMLImageElement
  let imageFade: Animation | undefined
  let skeletonFade: Animation | undefined
  await vi.waitFor(() => {
    imageFade = img.getAnimations().find(animation => animation instanceof CSSTransition)
    expect(imageFade).toBeTruthy()
    imageFade!.pause()
    if (skeleton) {
      const layer = w.element.querySelector('.hn-skeleton')?.parentElement
      skeletonFade = layer?.getAnimations()[0]
      expect(skeletonFade).toBeTruthy()
      skeletonFade!.pause()
    }
  })
  expect(imageFade!.effect!.getTiming().duration).toBe(300)
  imageFade!.currentTime = 100
  expect(Number(getComputedStyle(img).opacity)).toBeGreaterThan(0)
  expect(Number(getComputedStyle(img).opacity)).toBeLessThan(1)
  if (skeletonFade) {
    expect(skeletonFade.effect!.getTiming().duration).toBe(200)
    skeletonFade.currentTime = 100
    const layer = w.element.querySelector('.hn-skeleton')!.parentElement!
    expect(Number(getComputedStyle(layer).opacity)).toBeGreaterThan(0)
    expect(Number(getComputedStyle(layer).opacity)).toBeLessThan(1)
    skeletonFade.finish()
  }
  imageFade!.finish()
  await vi.waitFor(() => expect(w.element.querySelector('.hn-skeleton')).toBeNull())
  expect(getComputedStyle(img).opacity).toBe('1')
})

it('等待淡入开始时换源,上一张图片的动画不会提前揭示新图', async () => {
  let finishDecode: (() => void) | undefined
  vi.spyOn(HTMLImageElement.prototype, 'decode').mockImplementation(function (
    this: HTMLImageElement,
  ) {
    return this.src.endsWith('#second')
      ? new Promise<void>(resolve => {
          finishDecode = resolve
        })
      : Promise.resolve()
  })
  const src = signal(PIXEL)
  function Harness() {
    return (
      <Image
        src={src.use()}
        className="h-20 w-20"
        onLoad={() => {
          src.value = PIXEL + '#second'
        }}
      />
    )
  }
  const w = mountUi(<Harness />)
  await vi.waitFor(() => expect(finishDecode).toBeTypeOf('function'))
  await new Promise<void>(resolve =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
  )
  const img = w.element.querySelector('img') as HTMLImageElement
  expect(getComputedStyle(img).opacity).toBe('0')
  expect(w.element.querySelector('.hn-skeleton')).not.toBeNull()
  finishDecode!()
  await vi.waitFor(() => expect(getComputedStyle(img).opacity).toBe('1'))
})

it.each([
  { preview: false, className: undefined, width: 262 },
  { preview: true, className: undefined, width: 262 },
  { preview: true, className: 'w-40', width: 160 },
])('加载前后保持容器尺寸 preview=$preview class=$className', async props => {
  const w = mountUi(
    <div style={{ width: '262px' }}>
      <Image
        src={PIXEL}
        alt="封面"
        ratio={0.707}
        preview={props.preview}
        className={props.className}
      />
    </div>,
  )
  const root = w.element.firstElementChild as HTMLElement
  const img = root.querySelector('img') as HTMLImageElement
  expect(img.naturalWidth).toBe(0)
  const before = root.getBoundingClientRect()
  expect(before.width).toBe(props.width)
  expect(before.height).toBeCloseTo(props.width / 0.707, 1)
  await vi.waitFor(() => expect(img.naturalWidth).toBeGreaterThan(0))
  const after = root.getBoundingClientRect()
  expect(after.width).toBe(before.width)
  expect(after.height).toBe(before.height)
})

it.each([true, false])('style 给外框和骨架定框 preview=%s', async preview => {
  const w = mountImage({
    src: PIXEL,
    alt: '定框图片',
    preview,
    style: { width: '160px', height: '90px' },
    imageStyle: { objectPosition: 'left top' },
  })
  const before = w.element.getBoundingClientRect()
  const skeleton = w.element.querySelector('.hn-skeleton')!.getBoundingClientRect()
  expect([before.width, before.height]).toEqual([160, 90])
  expect([skeleton.width, skeleton.height]).toEqual([160, 90])
  const img = w.element.querySelector('img') as HTMLImageElement
  await vi.waitFor(() => expect(img.naturalWidth).toBeGreaterThan(0))
  const after = w.element.getBoundingClientRect()
  expect([after.width, after.height]).toEqual([160, 90])
  expect(getComputedStyle(img).objectPosition).toBe('0% 0%')
})

it.each([
  { lazy: true, preview: false },
  { lazy: true, preview: true },
  { lazy: false, preview: false },
  { lazy: false, preview: true },
])('图片不遮挡外部兄弟按钮 lazy=$lazy preview=$preview', async props => {
  await page.viewport(1024, 768)
  const click = vi.fn()
  const w = mountUi(
    <div className="relative h-24 w-40">
      <Image src={PIXEL} alt="封面" className="size-full" {...props} />
      <button
        type="button"
        data-image-action=""
        className="bg-surface absolute top-1 right-1 size-8"
        onClick={click}
      >
        删除
      </button>
    </div>,
  )
  const img = w.element.querySelector('img') as HTMLImageElement
  await vi.waitFor(() => {
    expect(img.naturalWidth).toBeGreaterThan(0)
    expect(getComputedStyle(img).opacity).toBe('1')
  })
  const action = w.element.querySelector('[data-image-action]') as HTMLButtonElement
  const rect = action.getBoundingClientRect()
  expect(document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2)).toBe(action)
  await userEvent.click(action)
  expect(click).toHaveBeenCalledOnce()
  expect(document.querySelector('[role="dialog"]')).toBeNull()
})
