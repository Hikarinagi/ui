import { describe, expect, it, beforeEach, afterEach, vi, type MockInstance } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { page, userEvent } from '@vitest/browser/context'
import { defineComponent, h, ref } from 'vue'
import { rgbaToThumbHash } from 'thumbhash'
import Image from './Image.vue'
import { thumbhashToDataUrl } from '../../../../shared/src/lib/thumbhash'
import '../../../test/browser.css'

let mounted: VueWrapper[] = []

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(() => {
  mounted.forEach(w => w.unmount())
  mounted = []
  vi.restoreAllMocks()
})

const PIXEL = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='

function attach() {
  const host = document.createElement('div')
  document.body.appendChild(host)
  return host
}

function mountImage(props: Record<string, unknown>) {
  const w = mount(Image, { props, attachTo: attach() })
  mounted.push(w)
  return w
}

describe('image · 加载', () => {
  it('懒加载时骨架铺满外框,图片在其上层淡入', () => {
    const w = mountImage({ src: PIXEL, fit: 'contain', ratio: 2, class: 'w-40' })
    const img = w.find('img').element as HTMLElement
    const layer = (w.element.querySelector('.hn-skeleton') as HTMLElement).parentElement!
    const host = (w.element as HTMLElement).getBoundingClientRect()
    const box = layer.getBoundingClientRect()

    expect(Math.round(box.width)).toBe(Math.round(host.width))
    expect(Math.round(box.height)).toBe(Math.round(host.height))

    expect(getComputedStyle(layer).position).toBe('absolute')
    expect(getComputedStyle(img).position).toBe('relative')
    expect(getComputedStyle(img).zIndex).toBe('10')
  })

  it('首屏图压在骨架上层,不等脚本就能显示', () => {
    const w = mountImage({ src: PIXEL, lazy: false, class: 'h-20 w-20' })
    const style = getComputedStyle(w.find('img').element as HTMLElement)

    expect(style.position).toBe('relative')
    expect(style.zIndex).toBe('10')
  })

  it('比例容器在图片到位之前就撑住高度', () => {
    const w = mountImage({ src: PIXEL, lazy: false, ratio: 2, class: 'w-40' })
    const box = (w.element as HTMLElement).getBoundingClientRect()
    expect(Math.round(box.width)).toBe(160)
    expect(Math.round(box.height)).toBe(80)
  })

  it('骨架铺满外框,形状交给外框裁', () => {
    const w = mountImage({ src: PIXEL, lazy: false, ratio: 1, class: 'w-24 rounded-lg' })
    const skeleton = w.element.querySelector('.hn-skeleton') as HTMLElement
    const host = (w.element as HTMLElement).getBoundingClientRect()
    const box = skeleton.getBoundingClientRect()

    expect(Math.round(box.width)).toBe(Math.round(host.width))
    expect(Math.round(box.height)).toBe(Math.round(host.height))
    expect(getComputedStyle(skeleton).borderTopLeftRadius).toBe('0px')
    expect(getComputedStyle(w.element as HTMLElement).overflow).toBe('hidden')
  })

  it('懒加载的图在骨架期间不绘制,边缘不会透出图片', () => {
    const w = mountImage({ src: PIXEL, ratio: 1, class: 'w-24 rounded-lg' })
    expect(getComputedStyle(w.find('img').element as HTMLElement).opacity).toBe('0')
  })
})

describe('image · 懒加载', () => {
  function mountBelowFold(props: Record<string, unknown>) {
    const w = mount(
      defineComponent({
        setup: () => () =>
          h('div', [
            h('div', { style: 'height: 300vh' }),
            h(Image, { src: PIXEL, class: 'block h-20 w-20', ...props }),
          ]),
      }),
      { attachTo: attach() },
    )
    mounted.push(w)
    return w
  }

  it('视口之外的图片占好位置但不带地址,滚到跟前才请求', async () => {
    const w = mountBelowFold({})

    const img = w.find('img')
    expect(img.exists()).toBe(true)
    await vi.waitFor(() => expect(img.attributes('src')).toBeUndefined())

    img.element.scrollIntoView()
    await vi.waitFor(() => expect(w.find('img').attributes('src')).toBe(PIXEL))
    await vi.waitFor(() =>
      expect(getComputedStyle(w.find('img').element as HTMLElement).opacity).toBe('1'),
    )
  })

  it('rootMargin 决定提前量,给够就不必滚到跟前', async () => {
    const w = mountBelowFold({ rootMargin: '9999px' })
    await vi.waitFor(() => expect(w.find('img').attributes('src')).toBe(PIXEL))
  })

  it('lazy 为假时不等观察器,直接请求', () => {
    const w = mountBelowFold({ lazy: false })
    expect(w.find('img').attributes('src')).toBe(PIXEL)
  })
})

it.each([true, false])('懒加载图片淡入,独立于骨架是否开启 skeleton=%s', async skeleton => {
  const w = mountImage({ src: PIXEL, skeleton, class: 'h-20 w-20' })
  const img = w.find('img').element as HTMLImageElement
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

it.each(['.2s', '0.2s', '200ms'])('时长变量写成 %s 时,骨架淡出都是 200 毫秒', async value => {
  const animate = vi.spyOn(Element.prototype, 'animate')
  const w = mount(
    defineComponent({
      render: () =>
        h('div', { style: { '--hn-duration-fast': value } }, [
          h(Image, { src: PIXEL, class: 'h-20 w-20' }),
        ]),
    }),
    { attachTo: attach() },
  )
  mounted.push(w)
  await vi.waitFor(() => expect(animate).toHaveBeenCalled())
  const layer = w.element.querySelector('.hn-skeleton')!.parentElement
  const index = animate.mock.contexts.indexOf(layer!)
  expect(animate.mock.calls[index]?.[1]).toMatchObject({ duration: 200 })
})

it('骨架淡出和图片淡入在同一帧开始,中间没有两者都看不见的一帧', async () => {
  const animate = vi.spyOn(Element.prototype, 'animate')
  const w = mountImage({ src: PIXEL, class: 'h-20 w-20' })
  const img = w.element.querySelector('img') as HTMLImageElement
  const layer = w.element.querySelector('.hn-skeleton')!.parentElement!
  const imageFade = new Promise<Animation>(resolve =>
    img.addEventListener(
      'transitionrun',
      () => resolve(img.getAnimations().find(animation => animation instanceof CSSTransition)!),
      { once: true },
    ),
  )
  await vi.waitFor(() => expect(animate.mock.contexts).toContain(layer))
  const skeletonFade = animate.mock.results[animate.mock.contexts.indexOf(layer)]!
    .value as Animation
  const transition = await imageFade
  await Promise.all([transition.ready, skeletonFade.ready])
  expect(Number(transition.startTime)).toBeCloseTo(Number(skeletonFade.startTime), 0)
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
  const src = ref(PIXEL)
  const w = mount(
    {
      setup: () => () =>
        h(Image, {
          src: src.value,
          class: 'h-20 w-20',
          onLoad: () => {
            src.value = PIXEL + '#second'
          },
        }),
    },
    { attachTo: attach() },
  )
  mounted.push(w)
  await vi.waitFor(() => expect(finishDecode).toBeTypeOf('function'))
  await new Promise<void>(resolve =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
  )
  const img = w.find('img').element as HTMLImageElement
  expect(getComputedStyle(img).opacity).toBe('0')
  expect(w.element.querySelector('.hn-skeleton')).not.toBeNull()
  finishDecode!()
  await vi.waitFor(() => expect(getComputedStyle(img).opacity).toBe('1'))
})

it.each([
  { preview: false, class: undefined, width: 262 },
  { preview: true, class: undefined, width: 262 },
  { preview: true, class: 'w-40', width: 160 },
])('加载前后保持容器尺寸 preview=$preview class=$class', async props => {
  const host = attach()
  host.style.width = '262px'
  const w = mount(Image, {
    props: { src: PIXEL, alt: '封面', ratio: 0.707, preview: props.preview, class: props.class },
    attachTo: host,
  })
  mounted.push(w)
  const img = w.find('img').element as HTMLImageElement
  expect(img.naturalWidth).toBe(0)
  const before = w.element.getBoundingClientRect()
  expect(before.width).toBe(props.width)
  expect(before.height).toBeCloseTo(props.width / 0.707, 1)
  await vi.waitFor(() => expect(img.naturalWidth).toBeGreaterThan(0))
  const after = w.element.getBoundingClientRect()
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
  const img = w.find('img').element as HTMLImageElement
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
  const w = mount(
    {
      setup: () => () =>
        h('div', { class: 'relative h-24 w-40' }, [
          h(Image, { src: PIXEL, alt: '封面', class: 'size-full', ...props }),
          h(
            'button',
            {
              type: 'button',
              'data-image-action': '',
              class: 'absolute top-1 right-1 size-8 bg-surface',
              onClick: click,
            },
            '删除',
          ),
        ]),
    },
    { attachTo: attach() },
  )
  mounted.push(w)
  const img = w.find('img').element as HTMLImageElement
  await vi.waitFor(() => {
    expect(img.naturalWidth).toBeGreaterThan(0)
    expect(getComputedStyle(img).opacity).toBe('1')
  })
  const action = w.find('[data-image-action]').element as HTMLButtonElement
  const rect = action.getBoundingClientRect()
  expect(document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2)).toBe(action)
  await userEvent.click(action)
  expect(click).toHaveBeenCalledOnce()
  expect(document.querySelector('[role="dialog"]')).toBeNull()
})

describe('image · ThumbHash', () => {
  const HASH = 'YMcJJIIhukWZenmwmHWb9Pc5nw=='
  const OTHER = 'K2kGLQRRemhndpNMn6OolZmP9956'
  const RED = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"><rect width="8" height="8" fill="#f00"/></svg>')}`
  const GREEN = btoa(
    String.fromCharCode(
      ...rgbaToThumbHash(
        8,
        8,
        Uint8Array.from({ length: 256 }, (_, i) => [0, 128, 0, 255][i % 4]!),
      ),
    ),
  )
  const layerOf = (el: Element) => el.querySelector<HTMLElement>('span[aria-hidden="true"]')

  function crossfade(img: HTMLImageElement, layer: HTMLElement, animate: MockInstance) {
    return vi.waitFor(() => {
      const transition = img
        .getAnimations()
        .find((animation): animation is CSSTransition => animation instanceof CSSTransition)
      expect(transition?.transitionProperty).toBe('opacity')
      expect(animate.mock.contexts).toContain(layer)
      const fade = animate.mock.results[animate.mock.contexts.indexOf(layer)]!.value as Animation
      return { transition: transition!, fade }
    })
  }

  async function capture(element: HTMLElement) {
    const base64 = await page.screenshot({ element, save: false })
    const picture = new window.Image()
    picture.src = `data:image/png;base64,${base64}`
    await picture.decode()
    const canvas = document.createElement('canvas')
    canvas.width = picture.width
    canvas.height = picture.height
    const context = canvas.getContext('2d')!
    context.drawImage(picture, 0, 0)
    return context.getImageData(0, 0, picture.width, picture.height)
  }

  async function pixel(element: HTMLElement) {
    const { data, width, height } = await capture(element)
    const at = ((height >> 1) * width + (width >> 1)) * 4
    return [...data.slice(at, at + 3)]
  }

  const BLACK = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"><rect width="8" height="8"/></svg>')}`

  function blackHash(width: number, height: number) {
    const rgba = Uint8Array.from({ length: width * height * 4 }, (_, i) => (i % 4 === 3 ? 255 : 0))
    return btoa(String.fromCharCode(...rgbaToThumbHash(width, height, rgba)))
  }

  function edgeGlow({ data, width, height }: ImageData) {
    const red = (x: number, y: number) => data[(y * width + x) * 4]!
    const inner = red(width >> 1, height >> 1)
    const median = (values: number[]) => values.sort((a, b) => a - b)[values.length >> 1]!
    const column = (x: number) =>
      median(Array.from({ length: height >> 1 }, (_, y) => red(x, y + (height >> 2))))
    const row = (y: number) =>
      median(Array.from({ length: width >> 1 }, (_, x) => red(x + (width >> 2), y)))
    return {
      inner,
      sides: {
        left: Math.max(column(2), column(3)) - inner,
        right: Math.max(column(width - 3), column(width - 4)) - inner,
        top: Math.max(row(2), row(3)) - inner,
        bottom: Math.max(row(height - 3), row(height - 4)) - inner,
      },
    }
  }

  it.each([
    ['cover', 'cover'],
    ['contain', 'contain'],
    ['fill', '100% 100%'],
  ])('fit=%s 时缩略图铺满外框,背景尺寸为 %s', (fit, size) => {
    const w = mountImage({ src: PIXEL, thumbhash: HASH, fit, ratio: 2, class: 'w-40' })
    const layer = layerOf(w.element)!
    const host = (w.element as HTMLElement).getBoundingClientRect()
    const box = layer.getBoundingClientRect()
    expect([box.width, box.height]).toEqual([host.width, host.height])
    const style = getComputedStyle(layer)
    expect(style.backgroundSize).toBe(size)
    expect(style.backgroundPosition).toBe('50% 50%')
    expect(style.backgroundRepeat).toBe('no-repeat')
    expect(style.backgroundImage).toMatch(/^url\("data:image\/png;base64,/)
  })

  it('原图与缩略图交叉淡化:同一帧开始、时长与曲线相同,任一时刻不透明度之和为 1', async () => {
    const animate = vi.spyOn(Element.prototype, 'animate')
    const w = mountImage({ src: PIXEL, thumbhash: HASH, class: 'h-20 w-20' })
    const img = w.find('img').element as HTMLImageElement
    const layer = layerOf(w.element)!
    expect(getComputedStyle(img.parentElement!).isolation).toBe('isolate')
    expect(getComputedStyle(img).mixBlendMode).toBe('normal')

    const { transition, fade } = await crossfade(img, layer, animate)
    await Promise.all([transition.ready, fade.ready])
    expect(Number(transition.startTime)).toBeCloseTo(Number(fade.startTime), 0)
    transition.pause()
    fade.pause()
    const timing = transition.effect!.getComputedTiming()
    expect(timing.duration).toBe(450)
    expect(fade.effect!.getComputedTiming()).toMatchObject({
      duration: 450,
      delay: 0,
      easing: getComputedStyle(img).transitionTimingFunction,
    })
    expect(getComputedStyle(img).transitionTimingFunction).toBe('cubic-bezier(0.4, 0, 0.2, 1)')
    expect(getComputedStyle(img).mixBlendMode).toBe('plus-lighter')
    expect(getComputedStyle(layer).willChange).toBe('transform')

    for (const time of [45, 150, 225, 300, 405]) {
      transition.currentTime = time
      fade.currentTime = time
      const sum = Number(getComputedStyle(img).opacity) + Number(getComputedStyle(layer).opacity)
      expect(sum).toBeCloseTo(1, 2)
    }

    transition.finish()
    fade.finish()
    await vi.waitFor(() => expect(layerOf(w.element)).toBeNull())
    expect(getComputedStyle(img).opacity).toBe('1')
    expect(getComputedStyle(img).mixBlendMode).toBe('normal')
  })

  it('交叉淡化到一半时不透出外框背景,也不把背景色叠加进来', async () => {
    const animate = vi.spyOn(Element.prototype, 'animate')
    const w = mountImage({
      src: RED,
      thumbhash: GREEN,
      class: 'h-20 w-20',
      style: { background: 'rgb(0, 0, 255)' },
    })
    const img = w.find('img').element as HTMLImageElement
    const { transition, fade } = await crossfade(img, layerOf(w.element)!, animate)
    transition.pause()
    fade.pause()
    transition.currentTime = 225
    fade.currentTime = 225
    await new Promise<void>(resolve =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
    )
    const [red, green, blue] = await pixel(w.element as HTMLElement)
    expect(blue).toBeLessThan(16)
    expect(red).toBeGreaterThan(60)
    expect(green).toBeGreaterThan(20)
  })

  const afterFrames = () =>
    new Promise<void>(resolve =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
    )

  const svgOf = (width: number, height: number, body: string) =>
    `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${body}</svg>`)}`

  function hashOf(width: number, height: number, color: (y: number) => number[]) {
    const rgba = new Uint8Array(width * height * 4)
    for (let i = 0; i < width * height; i++) rgba.set([...color(Math.floor(i / width)), 255], i * 4)
    return btoa(String.fromCharCode(...rgbaToThumbHash(width, height, rgba)))
  }

  const red = () => [255, 0, 0]
  const GRADIENT = svgOf(
    100,
    100,
    '<defs><linearGradient id="g" x2="0" y2="1"><stop offset="0" stop-color="#f00"/><stop offset="1" stop-color="#00f"/></linearGradient></defs><rect width="100" height="100" fill="url(#g)"/>',
  )
  const GRADIENT_HASH = hashOf(100, 100, y => {
    const k = (y + 0.5) / 100
    return [Math.round(255 * (1 - k)), 0, Math.round(255 * k)]
  })
  const WIDE = svgOf(300, 100, '<rect width="300" height="100" fill="#f00"/>')
  const WIDE_HASH = hashOf(96, 32, red)

  function mismatch(before: ImageData, after: ImageData) {
    let count = 0
    for (let i = 0; i < before.data.length; i += 4) {
      const diff = Math.max(
        Math.abs(before.data[i]! - after.data[i]!),
        Math.abs(before.data[i + 1]! - after.data[i + 1]!),
        Math.abs(before.data[i + 2]! - after.data[i + 2]!),
      )
      if (diff > 48) count++
    }
    return count / (before.width * before.height)
  }

  function redBox({ data, width, height }: ImageData) {
    let [left, top, right, bottom] = [width, height, -1, -1]
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4
        if (data[i]! < 128 || data[i + 1]! > 100 || data[i + 2]! > 100) continue
        left = Math.min(left, x)
        top = Math.min(top, y)
        right = Math.max(right, x)
        bottom = Math.max(bottom, y)
      }
    }
    return [left, top, right, bottom]
  }

  it.each([
    [23, 32, 262, 393],
    [23, 32, 300, 300],
    [23, 32, 400, 200],
    [32, 18, 200, 400],
    [32, 18, 169, 226],
    [32, 18, 400, 189],
  ])(
    '%ix%i 的缩略图放大铺进 %ix%i 的外框,交叉淡化进行中四边和中间一样不透出背景',
    async (hashWidth, hashHeight, width, height) => {
      const animate = vi.spyOn(Element.prototype, 'animate')
      const w = mountImage({
        src: BLACK,
        thumbhash: blackHash(hashWidth, hashHeight),
        style: {
          width: `${width}px`,
          height: `${height}px`,
          background: '#fff',
          '--hn-duration-slow': '20s',
        },
      })
      const img = w.find('img').element as HTMLImageElement
      const layer = layerOf(w.element)!
      const { fade } = await crossfade(img, layer, animate)
      await fade.ready
      await new Promise<void>(resolve =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      )
      const { inner, sides } = edgeGlow(await capture(w.element as HTMLElement))
      expect(fade.playState).toBe('running')
      expect(layerOf(w.element)).toBe(layer)
      expect(inner).toBeLessThan(40)
      expect(Object.entries(sides).filter(([, glow]) => glow >= 16)).toEqual([])
    },
  )

  it.each([
    [
      'imageClass 改成 object-contain',
      {
        src: svgOf(160, 90, '<rect width="160" height="90" fill="#f00"/>'),
        thumbhash: hashOf(100, 56, red),
        imageClass: 'object-contain',
      },
      200,
      200,
    ],
    [
      'imageClass 贴顶',
      { src: GRADIENT, thumbhash: GRADIENT_HASH, imageClass: 'object-top' },
      200,
      100,
    ],
    [
      'imageStyle 贴顶',
      { src: GRADIENT, thumbhash: GRADIENT_HASH, imageStyle: { objectPosition: 'top' } },
      200,
      100,
    ],
    [
      'imageClass 加内边距',
      {
        src: svgOf(100, 100, '<rect width="100" height="100" fill="#f00"/>'),
        thumbhash: hashOf(100, 100, red),
        imageClass: 'p-4',
      },
      200,
      200,
    ],
  ] as const)(
    '缩略图跟随原图的摆放(%s),交叉淡化刚开始时就和原图对齐',
    async (_, props, width, height) => {
      const animate = vi.spyOn(Element.prototype, 'animate')
      const w = mountImage({
        ...props,
        style: { width: `${width}px`, height: `${height}px`, background: '#fff' },
      })
      const img = w.find('img').element as HTMLImageElement
      const { transition, fade } = await crossfade(img, layerOf(w.element)!, animate)
      transition.pause()
      fade.pause()
      transition.currentTime = 45
      fade.currentTime = 45
      await afterFrames()
      const start = await capture(w.element as HTMLElement)
      transition.finish()
      fade.finish()
      await vi.waitFor(() => expect(layerOf(w.element)).toBeNull())
      await afterFrames()
      expect(mismatch(start, await capture(w.element as HTMLElement))).toBeLessThan(0.06)
    },
  )

  it('原图的内边距和边框都算进缩略图的内缩', async () => {
    const w = mountImage({
      src: PIXEL,
      thumbhash: HASH,
      imageClass: 'border-4 p-2',
      class: 'h-20 w-20',
    })
    const layer = layerOf(w.element)!
    await vi.waitFor(() => expect(getComputedStyle(layer).padding).toBe('12px'))
    expect(getComputedStyle(layer).backgroundOrigin).toBe('content-box')
    expect(getComputedStyle(layer).backgroundClip).toBe('content-box')
  })

  it.each([
    ['contain 居中', { fit: 'contain' }],
    ['contain 贴左上', { fit: 'contain', imageClass: 'object-left-top' }],
    ['contain 偏右下', { fit: 'contain', imageStyle: { objectPosition: 'right 10px bottom 5px' } }],
    [
      'scale-down',
      { fit: 'scale-down', src: svgOf(120, 40, '<rect width="120" height="40" fill="#f00"/>') },
    ],
  ] as const)(
    '%s:thumbhash 的宽高比只是近似,交叉淡化结束时缩略图正好落在原图上',
    async (_, props) => {
      const animate = vi.spyOn(Element.prototype, 'animate')
      const w = mountImage({
        src: WIDE,
        thumbhash: WIDE_HASH,
        ...props,
        style: { width: '300px', height: '300px', background: '#fff' },
      })
      const img = w.find('img').element as HTMLImageElement
      const { transition, fade } = await crossfade(img, layerOf(w.element)!, animate)
      transition.pause()
      fade.pause()
      const effect = fade.effect as KeyframeEffect
      effect.setKeyframes(
        effect.getKeyframes().map(({ offset, transform }) => ({
          offset,
          ...(transform ? { transform } : {}),
          opacity: 1,
        })),
      )
      fade.currentTime = Number(effect.getComputedTiming().endTime)
      img.style.visibility = 'hidden'
      await afterFrames()
      const thumb = redBox(await capture(w.element as HTMLElement))
      img.style.visibility = ''
      transition.finish()
      fade.finish()
      await vi.waitFor(() => expect(layerOf(w.element)).toBeNull())
      await afterFrames()
      const picture = redBox(await capture(w.element as HTMLElement))
      expect(Math.max(...thumb.map((edge, i) => Math.abs(edge - picture[i]!)))).toBeLessThanOrEqual(
        1,
      )
    },
  )

  it('lazy 为假时图片直接可见,加载后缩略图以同样的时长与曲线淡出', async () => {
    const animate = vi.spyOn(Element.prototype, 'animate')
    const w = mountImage({ src: PIXEL, thumbhash: HASH, lazy: false, class: 'h-20 w-20' })
    const img = w.find('img').element as HTMLImageElement
    const layer = layerOf(w.element)!
    expect(getComputedStyle(img).opacity).toBe('1')
    await vi.waitFor(() => expect(animate.mock.contexts).toContain(layer))
    const fade = animate.mock.results[animate.mock.contexts.indexOf(layer)]!.value as Animation
    fade.pause()
    expect(fade.effect!.getComputedTiming()).toMatchObject({
      duration: 450,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    })
    fade.currentTime = 225
    expect(Number(getComputedStyle(layer).opacity)).toBeGreaterThan(0)
    expect(Number(getComputedStyle(layer).opacity)).toBeLessThan(1)
    expect(getComputedStyle(img).mixBlendMode).toBe('normal')
    expect(getComputedStyle(img).opacity).toBe('1')
    fade.finish()
    await vi.waitFor(() => expect(layerOf(w.element)).toBeNull())
  })

  it('换源时旧图正常淡出,下方换成新图的缩略图,新图到位后再交叉淡化', async () => {
    const props = ref({ src: PIXEL, thumbhash: HASH })
    const w = mount(
      { setup: () => () => h(Image, { ...props.value, class: 'h-20 w-20' }) },
      { attachTo: attach() },
    )
    mounted.push(w)
    const img = w.find('img').element as HTMLImageElement
    await vi.waitFor(() => {
      expect(layerOf(w.element)).toBeNull()
      expect(getComputedStyle(img).opacity).toBe('1')
    })
    let finishDecode: (() => void) | undefined
    vi.spyOn(HTMLImageElement.prototype, 'decode').mockImplementation(
      () =>
        new Promise<void>(resolve => {
          finishDecode = resolve
        }),
    )
    props.value = { src: PIXEL + '#second', thumbhash: OTHER }
    await vi.waitFor(() => expect(finishDecode).toBeTypeOf('function'))
    expect(layerOf(w.element)!.style.backgroundImage).toBe(`url("${thumbhashToDataUrl(OTHER)}")`)
    expect(getComputedStyle(img).mixBlendMode).toBe('normal')
    await vi.waitFor(() => expect(getComputedStyle(img).opacity).toBe('0'))
    finishDecode!()
    await vi.waitFor(() => {
      expect(layerOf(w.element)).toBeNull()
      expect(getComputedStyle(img).opacity).toBe('1')
    })
  })
})
