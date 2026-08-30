import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import { page, userEvent } from '@vitest/browser/context'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import Toaster from './Toaster.vue'
import { toast, toastState } from './store'
import '../../../test/browser.css'

let mounted: VueWrapper[] = []

beforeEach(async () => {
  document.body.innerHTML = ''
  toastState.items.splice(0)
  const park = document.createElement('div')
  park.style.cssText = 'position: fixed; top: 0; left: 0; width: 8px; height: 8px'
  document.body.appendChild(park)
  await userEvent.hover(park)
})

afterEach(() => {
  mounted.forEach(w => w.unmount())
  mounted = []
})

function host(props: Record<string, unknown> = {}) {
  const el = document.createElement('div')
  document.body.appendChild(el)
  const w = mount(Toaster, { attachTo: el, props })
  mounted.push(w)
  return w
}

const viewport = () => document.querySelector('ol[tabindex]') as HTMLElement | null
const items = () => [...document.querySelectorAll('ol li')] as HTMLElement[]
const front = () => items().at(-1)

describe('toast · 常驻通知区', () => {
  it('命令式弹出:常驻 viewport(z 110)、绝对堆叠位、边缘滑入、语义图标', async () => {
    host()
    toast.success('已保存', { description: '条目更新成功。' })
    await vi.waitFor(() => expect(items().length).toBe(1))

    const vp = viewport()!
    expect(getComputedStyle(vp).zIndex).toBe('110')
    expect(vp.dataset.pos).toBe('auto')

    const li = front()!
    expect(getComputedStyle(li).position).toBe('absolute')
    expect(getComputedStyle(li).animationName).toBe('hn-toast-in')
    expect(li.tabIndex).toBe(0)

    const probe = document.createElement('span')
    probe.style.color = 'var(--hn-success-text)'
    document.body.appendChild(probe)
    expect(getComputedStyle(li.querySelector('svg')!).color).toBe(getComputedStyle(probe).color)
  })

  it('自管计时:到时自动关并出队', async () => {
    host()
    toast('转瞬即逝', { duration: 400 })
    await vi.waitFor(() => expect(items().length).toBe(1))
    await vi.waitFor(() => expect(items().length).toBe(0), { timeout: 3000 })
    await vi.waitFor(() => expect(toastState.items.length).toBe(0))
  })

  it('收拢堆叠:矮卡在后也取前卡高度对齐棱边,第 4 张起隐没;悬停展开全列', async () => {
    await page.viewport(500, 800)
    host()
    toast('一', { duration: 0 })
    toast('二', { duration: 0 })
    toast('三', { duration: 0 })
    toast('四', { duration: 0, description: '殿后的这张更高,矮背卡必须跟着长到同高。' })
    await vi.waitFor(() => expect(items().length).toBe(4))

    const list = items()
    const deepest = list[0]!
    const middle = list[2]!
    const top = list[3]!

    expect(deepest.dataset.hnHidden).toBe('')
    await vi.waitFor(() => expect(getComputedStyle(deepest).opacity).toBe('0'))
    expect(middle.dataset.hnBehind).toBe('')
    expect(top.dataset.hnBehind).toBeUndefined()
    expect(getComputedStyle(middle).scale).toBe('0.95')

    const cardOf = (li: HTMLElement) => li.firstElementChild as HTMLElement
    await vi.waitFor(() => {
      const frontH = cardOf(top).offsetHeight
      expect(frontH).toBeGreaterThan(60)
      expect(cardOf(middle).offsetHeight).toBeCloseTo(frontH, 0)
    })

    const midCard = cardOf(middle)
    const midBody = midCard.querySelector('.hn-toast-body') as HTMLElement
    expect(
      Math.abs(
        midCard.getBoundingClientRect().bottom - 17 - midBody.getBoundingClientRect().bottom,
      ),
    ).toBeLessThanOrEqual(2)

    await userEvent.hover(top)
    await vi.waitFor(() => expect(viewport()!.dataset.expanded).toBe(''))
    await vi.waitFor(() => expect(getComputedStyle(middle).scale).toBe('1'))
    expect(getComputedStyle(deepest).opacity).not.toBe('0')
    const offset = Number.parseFloat(getComputedStyle(middle).getPropertyValue('--hn-t-offset'))
    expect(offset).toBeGreaterThan(0)
  })

  it('悬停暂停计时,移开后续走', async () => {
    host()
    toast('等等我', { duration: 800 })
    await vi.waitFor(() => expect(items().length).toBe(1))
    await userEvent.hover(front()!)
    await new Promise(r => setTimeout(r, 1100))
    expect(items().length).toBe(1)

    const park = document.querySelector('div[style*="fixed"]') as HTMLElement
    await userEvent.hover(park)
    await vi.waitFor(() => expect(items().length).toBe(0), { timeout: 3000 })
  })

  it('同 id 原地更新:换文案换 tone,不新增卡', async () => {
    host()
    toast.loading('上传中', { id: 'up' })
    await vi.waitFor(() => expect(items().length).toBe(1))
    expect(front()!.querySelector('[role="status"]')).toBeTruthy()

    toast.success('上传完成', { id: 'up', duration: 0 })
    await vi.waitFor(() => expect(front()!.textContent).toContain('上传完成'))
    expect(items().length).toBe(1)
    await vi.waitFor(() => expect(front()!.querySelector('[role="status"]')).toBeNull())
    expect(front()!.querySelector('svg')).toBeTruthy()
  })

  it('promise 流转:loading 起手,resolve 转 success,reject 转 danger', async () => {
    host()
    let resolveIt!: (v: string) => void
    const p = new Promise<string>(res => (resolveIt = res))
    void toast.promise(p, {
      loading: '保存中…',
      success: v => `已保存:${v}`,
      error: '失败了',
    })
    await vi.waitFor(() => expect(front()!.textContent).toContain('保存中'))
    resolveIt('新条目')
    await vi.waitFor(() => expect(front()!.textContent).toContain('已保存:新条目'))

    let rejectIt!: (e: unknown) => void
    const p2 = new Promise<string>((_res, rej) => (rejectIt = rej))
    toast
      .promise(p2, { loading: '又在保存…', success: '好了', error: '这次真失败了' })
      .catch(() => {})
    await vi.waitFor(() => expect(front()!.textContent).toContain('又在保存'))
    rejectIt(new Error('boom'))
    await vi.waitFor(() => expect(front()!.textContent).toContain('这次真失败了'))
  })

  it('action / cancel:执行回调并收起', async () => {
    host()
    const undo = vi.fn()
    toast('已删除 3 条', { duration: 0, action: { label: '撤销', onClick: undo } })
    await vi.waitFor(() => expect(items().length).toBe(1))

    const btn = [...front()!.querySelectorAll('button')].find(b => b.textContent === '撤销')!
    await userEvent.click(btn)
    expect(undo).toHaveBeenCalledOnce()
    await vi.waitFor(() => expect(items().length).toBe(0), { timeout: 3000 })
  })

  it('默认 auto:宽屏右上、窄屏底部居中,纯 CSS 断点切换', async () => {
    await page.viewport(1024, 720)
    host()
    toast('随屏而动', { duration: 0 })
    await vi.waitFor(() => expect(items().length).toBe(1))

    const li = front()!
    expect(getComputedStyle(li).top).toBe('0px')
    expect(getComputedStyle(li).getPropertyValue('--hn-t-dir').trim()).toBe('1')
    const vpRect = viewport()!.getBoundingClientRect()
    expect(Math.round(window.innerWidth - vpRect.right)).toBe(16)

    await page.viewport(430, 780)
    await vi.waitFor(() => {
      expect(getComputedStyle(front()!).getPropertyValue('--hn-t-dir').trim()).toBe('')
      const vpBottom = viewport()!.getBoundingClientRect().bottom
      expect(Math.round(front()!.getBoundingClientRect().bottom)).toBe(Math.round(vpBottom))
    })
    const r = viewport()!.getBoundingClientRect()
    expect(Math.abs((r.left + r.right) / 2 - window.innerWidth / 2)).toBeLessThanOrEqual(1)
  })

  it('position=top-start:方向因子翻转,从上缘滑入', async () => {
    host({ position: 'top-start' })
    toast('顶部的', { duration: 0 })
    await vi.waitFor(() => expect(items().length).toBe(1))
    expect(viewport()!.dataset.pos).toBe('top-start')
    const li = front()!
    expect(getComputedStyle(li).getPropertyValue('--hn-t-dir').trim()).toBe('1')
    expect(getComputedStyle(li).top).toBe('0px')
  })

  it('toast.custom:自定义体换内容不换卡面,关闭钮与堆叠身份保留', async () => {
    host()
    const Custom = defineComponent({
      props: { toastId: { type: [String, Number], required: true } },
      setup: p => () => h('div', { class: 'custom-probe' }, `来自 #${p.toastId}`),
    })
    const id = toast.custom(Custom, { duration: 0 })
    await vi.waitFor(() => expect(items().length).toBe(1))

    const li = front()!
    expect(li.querySelector('.custom-probe')!.textContent).toBe(`来自 #${id}`)
    expect(li.querySelector('.hn-toast-body')).toBeTruthy()
    expect(li.querySelector('[aria-label="关闭"]')).toBeTruthy()

    toast.dismiss(id)
    await vi.waitFor(() => expect(items().length).toBe(0), { timeout: 3000 })
  })

  it('hover 渐显关闭钮,点击即关;onDismiss 收到通知', async () => {
    host()
    const seen = vi.fn()
    toast('挥之即去', { duration: 0, onDismiss: seen })
    await vi.waitFor(() => expect(items().length).toBe(1))

    const li = front()!
    const close = li.querySelector('[aria-label="关闭"]') as HTMLElement
    expect(getComputedStyle(close).opacity).toBe('0')
    await userEvent.hover(li)
    await vi.waitFor(() => expect(getComputedStyle(close).opacity).toBe('1'))
    await userEvent.click(close)
    await vi.waitFor(() => expect(items().length).toBe(0), { timeout: 3000 })
    expect(seen).toHaveBeenCalledWith(expect.anything())
  })

  it('锁滚补偿按份额:end 档回拉全宽,center 档回拉半宽', async () => {
    host({ position: 'top-end' })
    toast('钉住别动', { duration: 0 })
    await vi.waitFor(() => expect(items().length).toBe(1))

    const vp = viewport()!
    const before = vp.getBoundingClientRect().right
    document.documentElement.style.setProperty('--scrollbar-width', '15px')
    expect(vp.getBoundingClientRect().right).toBeCloseTo(before - 15, 0)
    document.documentElement.style.removeProperty('--scrollbar-width')
    expect(vp.getBoundingClientRect().right).toBeCloseTo(before, 0)

    mounted.pop()!.unmount()
    host({ position: 'bottom-center' })
    await vi.waitFor(() => expect(viewport()).not.toBeNull())
    const center = viewport()!
    const centerBefore = center.getBoundingClientRect().left
    document.documentElement.style.setProperty('--scrollbar-width', '15px')
    expect(center.getBoundingClientRect().left).toBeCloseTo(centerBefore - 7.5, 0)
    document.documentElement.style.removeProperty('--scrollbar-width')
    expect(center.getBoundingClientRect().left).toBeCloseTo(centerBefore, 0)
  })
})
