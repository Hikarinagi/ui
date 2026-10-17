import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import { userEvent } from '@vitest/browser/context'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, ref } from 'vue'
import LoadingOverlay from './LoadingOverlay.vue'
import Button from '../button/Button.vue'
import '../../../test/browser.css'

beforeEach(() => {
  document.body.innerHTML = ''
})

let mounted: VueWrapper[] = []

afterEach(() => {
  mounted.forEach(w => w.unmount())
  mounted = []
})

function harness(props: Record<string, unknown> = {}) {
  const host = document.createElement('div')
  document.body.appendChild(host)
  const visible = ref(false)
  const clicks = vi.fn()
  const w = mount(
    defineComponent({
      setup: () => () =>
        h('div', { style: 'position: relative; width: 320px; height: 200px; padding: 40px' }, [
          h(Button, { variant: 'outline', tone: 'neutral', onClick: clicks }, () => '按钮'),
          h(LoadingOverlay, { visible: visible.value, text: '正在加载', ...props }),
        ]),
    }),
    { attachTo: host, global: { stubs: { transition: false } } },
  )
  mounted.push(w)
  return { w, visible, clicks }
}

const overlay = () => document.querySelector('[data-hn-loading-overlay]') as HTMLElement | null
const blocker = () => document.querySelector('[data-hn-loading-blocker]') as HTMLElement | null

function settle(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

describe('LoadingOverlay', () => {
  it('可见后先挡住点击，过了延时才淡入并铺满容器', async () => {
    const { visible, clicks } = harness()
    visible.value = true
    await vi.waitFor(() => expect(blocker()).toBeTruthy())
    expect(overlay()).toBeNull()
    await userEvent.click(document.querySelector('button')!, { force: true })
    expect(clicks).not.toHaveBeenCalled()
    await vi.waitFor(() => expect(overlay()).toBeTruthy(), { timeout: 1000 })
    await vi.waitFor(() => expect(parseFloat(getComputedStyle(overlay()!).opacity)).toBe(1))
    expect(blocker()).toBeNull()
    const box = overlay()!.getBoundingClientRect()
    const host = overlay()!.parentElement!.getBoundingClientRect()
    expect(box.width).toBe(host.width)
    expect(box.height).toBe(host.height)
  })

  it('延时内撤掉不会闪现，撤掉后按钮恢复可点', async () => {
    const { visible, clicks } = harness()
    visible.value = true
    await vi.waitFor(() => expect(blocker()).toBeTruthy())
    await settle(120)
    visible.value = false
    await settle(400)
    expect(overlay()).toBeNull()
    expect(blocker()).toBeNull()
    await userEvent.click(document.querySelector('button')!)
    expect(clicks).toHaveBeenCalledOnce()
  })

  it('delay 为 0 立即淡入；minVisible 让它至少停留一段时间再淡出', async () => {
    const { visible } = harness({ delay: 0, minVisible: 500 })
    visible.value = true
    await vi.waitFor(() => expect(overlay()).toBeTruthy())
    await settle(100)
    visible.value = false
    await settle(200)
    expect(overlay()).toBeTruthy()
    expect(parseFloat(getComputedStyle(overlay()!).opacity)).toBeGreaterThan(0.5)
    await vi.waitFor(() => expect(overlay()).toBeNull(), { timeout: 1500 })
  })

  it('局部 .dark 容器里的遮罩底色与整页深色主题一致', async () => {
    const host = document.createElement('div')
    document.body.appendChild(host)
    const box = 'position: relative; height: 80px'
    const w = mount(
      defineComponent({
        setup: () => () =>
          h('div', [
            h('div', { 'data-region': 'plain', style: box }, [
              h(LoadingOverlay, { visible: true, delay: 0 }),
            ]),
            h('div', { 'data-region': 'dark', class: 'dark', style: box }, [
              h(LoadingOverlay, { visible: true, delay: 0 }),
            ]),
          ]),
      }),
      { attachTo: host, global: { stubs: { transition: false } } },
    )
    mounted.push(w)
    const veil = (region: string) =>
      getComputedStyle(
        document.querySelector(`[data-region="${region}"] [data-hn-loading-overlay]`)!,
      ).backgroundColor
    await vi.waitFor(() =>
      expect(document.querySelectorAll('[data-hn-loading-overlay]')).toHaveLength(2),
    )
    const light = veil('plain')
    const local = veil('dark')
    document.documentElement.classList.add('dark')
    try {
      expect(local).toBe(veil('plain'))
      expect(local).not.toBe(light)
    } finally {
      document.documentElement.classList.remove('dark')
    }
  })
})
