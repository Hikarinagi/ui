import { describe, expect, it, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, h, nextTick } from 'vue'
import Image from './Image.vue'
import { provideImageResolver } from './resolver'

let decodes: Array<'ok' | 'fail'> = []

beforeEach(() => {
  document.body.innerHTML = ''
  decodes = []
  Object.defineProperty(HTMLImageElement.prototype, 'decode', {
    configurable: true,
    writable: true,
    value: () =>
      decodes.shift() === 'fail'
        ? Promise.reject(new Error('decode failed'))
        : Promise.resolve(undefined),
  })
})

function withResolver(resolver: (src: string) => string) {
  return defineComponent({
    setup(_, { slots }) {
      provideImageResolver(resolver)
      return () => slots.default?.()
    },
  })
}

describe('地址解析', () => {
  it('没有解析器时原样使用 src', () => {
    const w = mount(Image, { props: { src: '/a.webp', lazy: false } })
    expect(w.find('img').attributes('src')).toBe('/a.webp')
  })

  it('解析器只收到 src', () => {
    const resolver = vi.fn((src: string) => `https://cdn.test${src}`)
    const w = mount(withResolver(resolver), {
      slots: { default: () => h(Image, { src: '/a.webp', lazy: false }) },
    })
    expect(resolver).toHaveBeenCalledWith('/a.webp')
    expect(w.find('img').attributes('src')).toBe('https://cdn.test/a.webp')
  })

  it('回退地址同样经过解析器', async () => {
    decodes = ['fail']
    const resolver = vi.fn((src: string) => src)
    mount(withResolver(resolver), {
      slots: {
        default: () => h(Image, { src: '/a.webp', fallback: '/f.webp', lazy: false }),
      },
    })
    await flushPromises()
    expect(resolver).toHaveBeenLastCalledWith('/f.webp')
  })

  it('没有 src 时不解析回退地址,交给空态', () => {
    const resolver = vi.fn((src: string) => src)
    mount(withResolver(resolver), {
      slots: { default: () => h(Image, { fallback: '/f.webp', lazy: false }) },
    })
    expect(resolver).not.toHaveBeenCalled()
  })
})

describe('加载与回退', () => {
  it('加载失败时换到回退图,不报错', async () => {
    decodes = ['fail']
    const w = mount(Image, { props: { src: '/a.webp', fallback: '/f.webp', lazy: false } })
    await flushPromises()
    await flushPromises()
    expect(w.find('img').attributes('src')).toBe('/f.webp')
    expect(w.emitted('error')).toBeUndefined()
  })

  it('回退图也失败才报错', async () => {
    decodes = ['fail', 'fail']
    const w = mount(Image, { props: { src: '/a.webp', fallback: '/f.webp', lazy: false } })
    await flushPromises()
    await flushPromises()
    expect(w.emitted('error')).toHaveLength(1)
  })

  it('没有回退图时直接报错并渲染 error 插槽', async () => {
    decodes = ['fail']
    const w = mount(Image, {
      props: { src: '/a.webp', lazy: false },
      slots: { error: () => h('p', '加载失败') },
    })
    await flushPromises()
    expect(w.emitted('error')).toHaveLength(1)
    expect(w.text()).toBe('加载失败')
  })

  it('load 事件带出自然尺寸', async () => {
    Object.defineProperty(HTMLImageElement.prototype, 'naturalWidth', {
      configurable: true,
      get: () => 800,
    })
    Object.defineProperty(HTMLImageElement.prototype, 'naturalHeight', {
      configurable: true,
      get: () => 600,
    })
    const w = mount(Image, { props: { src: '/a.webp', lazy: false } })
    await flushPromises()
    expect(w.emitted('load')?.[0]?.[0]).toEqual({ width: 800, height: 600 })
  })

  it('换 src 之后回退状态重置', async () => {
    decodes = ['fail']
    const w = mount(Image, { props: { src: '/a.webp', fallback: '/f.webp', lazy: false } })
    await flushPromises()
    expect(w.find('img').attributes('src')).toBe('/f.webp')

    await w.setProps({ src: '/b.webp' })
    await nextTick()
    expect(w.find('img').attributes('src')).toBe('/b.webp')
  })
})

describe('占位与空态', () => {
  it('没有 src 时渲染 empty 插槽,不渲染 img', () => {
    const w = mount(Image, { props: { lazy: false }, slots: { empty: () => h('p', '暂无图片') } })
    expect(w.find('img').exists()).toBe(false)
    expect(w.text()).toBe('暂无图片')
  })

  it('骨架盖在图片之上,揭示之后撤走', async () => {
    const w = mount(Image, { props: { src: '/a.webp', lazy: false } })
    expect(w.find('.hn-skeleton').exists()).toBe(true)

    const nodes = [...w.element.children].map(el => el.tagName)
    expect(nodes.indexOf('SPAN')).toBeGreaterThan(nodes.indexOf('IMG'))

    await vi.waitFor(() => expect(w.find('.hn-skeleton').exists()).toBe(false))
  })

  it('skeleton 为假时不渲染骨架', () => {
    const w = mount(Image, { props: { src: '/a.webp', lazy: false, skeleton: false } })
    expect(w.find('.hn-skeleton').exists()).toBe(false)
  })

  it('懒加载的图在骨架期间不绘制,骨架边缘不会透出图片', () => {
    const w = mount(Image, { props: { src: '/a.webp' } })
    expect(w.find('img').classes()).toContain('opacity-0')
    expect(w.find('.hn-skeleton').exists()).toBe(true)
  })

  it('骨架形状交给外框裁,自己不带圆角', () => {
    const w = mount(Image, { props: { src: '/a.webp', lazy: false } })
    expect(w.find('.hn-skeleton').classes()).toContain('rounded-none')
    expect(w.classes()).toContain('overflow-hidden')
  })

  it('skeleton 插槽替换内置占位', () => {
    const w = mount(Image, {
      props: { src: '/a.webp', lazy: false },
      slots: { skeleton: () => h('p', '自定义占位') },
    })
    expect(w.find('.hn-skeleton').exists()).toBe(false)
    expect(w.text()).toBe('自定义占位')
  })
})

describe('渲染', () => {
  it('lazy 为假时立即带上地址', () => {
    const w = mount(Image, { props: { src: '/a.webp', lazy: false } })
    const img = w.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('/a.webp')
  })

  it('lazy 为真时 img 先占好位置,观察器放行之前不带地址', () => {
    const w = mount(Image, { props: { src: '/a.webp' } })
    const img = w.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBeUndefined()
  })

  it('ratio 落在外框上,fit 落在图片上', () => {
    const w = mount(Image, {
      props: { src: '/a.webp', lazy: false, ratio: 16 / 9, fit: 'contain' },
    })
    expect(w.attributes('style')).toContain('aspect-ratio')
    expect(w.find('img').classes()).toContain('object-contain')
  })

  it('eager 给出高优先级并同步解码', () => {
    const w = mount(Image, { props: { src: '/a.webp', lazy: false, eager: true } })
    const img = w.find('img')
    expect(img.attributes('fetchpriority')).toBe('high')
    expect(img.attributes('decoding')).toBe('sync')
  })

  it('默认异步解码', () => {
    const w = mount(Image, { props: { src: '/a.webp', lazy: false } })
    expect(w.find('img').attributes('decoding')).toBe('async')
  })
})
