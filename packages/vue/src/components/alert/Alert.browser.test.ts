import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { h, nextTick, ref } from 'vue'
import Alert from './Alert.vue'
import Callout from '../callout/Callout.vue'
import '../../../test/browser.css'

let mounted: VueWrapper[] = []

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(() => {
  mounted.forEach(w => w.unmount())
  mounted = []
})

function attach() {
  const host = document.createElement('div')
  host.style.width = '480px'
  document.body.appendChild(host)
  return host
}

const body = { default: () => '已保存到草稿箱。' }
const real = { stubs: { transition: false } }

describe('alert · 运行态消息条', () => {
  it('与同 tone 的 Callout 同一副骨架：底色、圆角、内边距一致', () => {
    const alert = mount(Alert, { props: { tone: 'success' }, slots: body, attachTo: attach() })
    const callout = mount(Callout, { props: { tone: 'success' }, slots: body, attachTo: attach() })
    mounted.push(alert, callout)
    const a = getComputedStyle(alert.find('[role]').element as HTMLElement)
    const c = getComputedStyle(callout.element as HTMLElement)
    expect(a.backgroundColor).toBe(c.backgroundColor)
    expect(a.borderTopLeftRadius).toBe(c.borderTopLeftRadius)
    expect(a.paddingTop).toBe(c.paddingTop)
  })

  it('关闭时先淡出并收合高度，再从文档移除', async () => {
    const w = mount(Alert, {
      props: { closable: true },
      slots: body,
      attachTo: attach(),
      global: real,
    })
    mounted.push(w)
    const shell = w.find('[data-hn-alert]').element as HTMLElement
    const box = w.find('[role]').element as HTMLElement
    const icon = box.querySelector('svg') as SVGElement
    const before = shell.offsetHeight
    const boxBefore = box.getBoundingClientRect().height
    const iconLeft = icon.getBoundingClientRect().left
    const boxTop = box.getBoundingClientRect().top
    expect(before).toBeGreaterThan(0)

    await w.find('button').trigger('click')
    expect(w.emitted('close')).toHaveLength(1)
    expect(shell.isConnected).toBe(true)
    await vi.waitFor(() => {
      expect(shell.isConnected).toBe(true)
      expect(shell.offsetHeight).toBeLessThan(before)
      expect(parseFloat(getComputedStyle(shell).opacity)).toBeLessThan(1)
      expect(box.getBoundingClientRect().height).toBeLessThan(boxBefore)
      expect(parseFloat(getComputedStyle(box).paddingTop)).toBe(16)
      expect(parseFloat(getComputedStyle(box).paddingBottom)).toBe(16)
      expect(parseFloat(getComputedStyle(box).paddingInlineStart)).toBe(16)
      expect(icon.getBoundingClientRect().left).toBe(iconLeft)
      expect(box.getBoundingClientRect().top).toBe(boxTop)
    })
    await vi.waitFor(() => expect(shell.isConnected).toBe(false))
  })

  it('在带 gap 的栈里关闭：下方兄弟连续移动、末段减速、移除那一帧不跳', async () => {
    const open = ref(true)
    const w = mount(
      {
        render: () =>
          h('div', { style: 'display:flex;flex-direction:column;row-gap:12px;width:480px' }, [
            h(
              Alert,
              { closable: true, open: open.value, 'onUpdate:open': v => (open.value = v) },
              body,
            ),
            h('div', { style: 'height:20px' }),
          ]),
      },
      { attachTo: attach(), global: real },
    )
    mounted.push(w)
    const shell = w.find('[data-hn-alert]').element as HTMLElement
    const sibling = w.element.lastElementChild as HTMLElement
    const before = shell.offsetHeight
    const start = sibling.getBoundingClientRect().top
    const cardTop = w.find('[role]').element.getBoundingClientRect().top

    function sample(until: () => boolean) {
      return new Promise<number[]>(resolve => {
        const out: number[] = []
        function tick() {
          out.push(sibling.getBoundingClientRect().top)
          const card = w.element.querySelector('[role]')
          if (card) expect(card.getBoundingClientRect().top).toBe(cardTop)
          if (until()) resolve(out)
          else requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      })
    }

    await w.find('button').trigger('click')
    const closing = await sample(() => !shell.isConnected)
    const deltas = closing.slice(1).map((top, i) => closing[i]! - top)
    const peak = Math.max(...deltas)
    expect(deltas.length).toBeGreaterThan(8)
    expect(peak).toBeGreaterThan(0)
    expect(deltas[deltas.length - 1]!).toBeLessThan(1)
    expect(deltas.slice(-3).every(d => d < peak / 2)).toBe(true)
    expect(deltas.every(d => d >= 0)).toBe(true)
    expect(Math.round(start - closing[closing.length - 1]!)).toBe(before + 12)

    const settled = sibling.getBoundingClientRect().top
    open.value = true
    await nextTick()
    let frames = 0
    const opening = await sample(() => ++frames > 25)
    const rises = opening.slice(1).map((top, i) => top - opening[i]!)
    expect(opening[0]! - settled).toBeLessThan(1)
    expect(Math.max(...rises)).toBeLessThan((before + 12) / 2)
    expect(rises.every(d => d >= 0)).toBe(true)
    expect(Math.round(opening[opening.length - 1]! - settled)).toBe(before + 12)
  })

  it('open 从 false 到 true 时从零高展开', async () => {
    const w = mount(Alert, {
      props: { open: false },
      slots: body,
      attachTo: attach(),
      global: real,
    })
    mounted.push(w)
    await w.setProps({ open: true })
    const shell = w.find('[data-hn-alert]').element as HTMLElement
    expect(shell.offsetHeight).toBe(0)
    await vi.waitFor(() => expect(shell.offsetHeight).toBeGreaterThan(0))
    await vi.waitFor(() => {
      expect(parseFloat(getComputedStyle(shell).opacity)).toBe(1)
      expect(shell.offsetHeight).toBe(w.find('[role]').element.getBoundingClientRect().height)
    })
  })
})
