import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import type { ReactNode } from 'react'
import { Alert } from './Alert'
import { Callout } from '../callout/Callout'
import { mount as render } from '../../../test/mount'
import { signal, tick } from '../../../test/signal'
import '../../../test/browser.css'

let mounted: Array<{ unmount: () => Promise<void> }> = []

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(async () => {
  for (const w of mounted) await w.unmount()
  mounted = []
})

async function mount(ui: ReactNode) {
  const w = await render(<div style={{ width: '480px' }}>{ui}</div>)
  mounted.push(w)
  return w
}

const body = '已保存到草稿箱。'

describe('alert · 运行态消息条', () => {
  it('与同 tone 的 Callout 同一副骨架：底色、圆角、内边距一致', async () => {
    const alert = await mount(<Alert tone="success">{body}</Alert>)
    const callout = await mount(<Callout tone="success">{body}</Callout>)
    const a = getComputedStyle(alert.container.querySelector('[role]') as HTMLElement)
    const c = getComputedStyle(callout.element.firstElementChild as HTMLElement)
    expect(a.backgroundColor).toBe(c.backgroundColor)
    expect(a.borderTopLeftRadius).toBe(c.borderTopLeftRadius)
    expect(a.paddingTop).toBe(c.paddingTop)
  })

  it('关闭时先淡出并收合高度，再从文档移除', async () => {
    const onClose = vi.fn()
    const w = await mount(
      <Alert closable onClose={onClose}>
        {body}
      </Alert>,
    )
    const shell = w.container.querySelector('[data-hn-alert]') as HTMLElement
    const box = w.container.querySelector('[role]') as HTMLElement
    const icon = box.querySelector('svg') as SVGElement
    const before = shell.offsetHeight
    const boxBefore = box.getBoundingClientRect().height
    const iconLeft = icon.getBoundingClientRect().left
    const boxTop = box.getBoundingClientRect().top
    expect(before).toBeGreaterThan(0)

    w.container.querySelector('button')!.click()
    expect(onClose).toHaveBeenCalledTimes(1)
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
    const open = signal(true)
    function Harness() {
      const value = open.use()
      return (
        <div style={{ display: 'flex', flexDirection: 'column', rowGap: '12px', width: '480px' }}>
          <Alert closable open={value} onOpenChange={next => (open.value = next)}>
            {body}
          </Alert>
          <div style={{ height: '20px' }} />
        </div>
      )
    }
    const w = await mount(<Harness />)
    const stack = w.element.firstElementChild as HTMLElement
    const shell = w.container.querySelector('[data-hn-alert]') as HTMLElement
    const sibling = stack.lastElementChild as HTMLElement
    const before = shell.offsetHeight
    const start = sibling.getBoundingClientRect().top
    const cardTop = w.container.querySelector('[role]')!.getBoundingClientRect().top

    function sample(until: () => boolean) {
      return new Promise<number[]>(resolve => {
        const out: number[] = []
        function frame() {
          out.push(sibling.getBoundingClientRect().top)
          const card = stack.querySelector('[role]')
          if (card) expect(card.getBoundingClientRect().top).toBe(cardTop)
          if (until()) resolve(out)
          else requestAnimationFrame(frame)
        }
        requestAnimationFrame(frame)
      })
    }

    w.container.querySelector('button')!.click()
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
    await tick()
    let frames = 0
    const opening = await sample(() => ++frames > 25)
    const rises = opening.slice(1).map((top, i) => top - opening[i]!)
    expect(opening[0]! - settled).toBeLessThan(1)
    expect(Math.max(...rises)).toBeLessThan((before + 12) / 2)
    expect(rises.every(d => d >= 0)).toBe(true)
    expect(Math.round(opening[opening.length - 1]! - settled)).toBe(before + 12)
  })

  it('open 从 false 到 true 时从零高展开', async () => {
    const open = signal(false)
    function Harness() {
      return <Alert open={open.use()}>{body}</Alert>
    }
    const w = await mount(<Harness />)
    open.value = true
    await tick()
    const shell = w.container.querySelector('[data-hn-alert]') as HTMLElement
    expect(shell.offsetHeight).toBe(0)
    await vi.waitFor(() => expect(shell.offsetHeight).toBeGreaterThan(0))
    await vi.waitFor(() => {
      expect(parseFloat(getComputedStyle(shell).opacity)).toBe(1)
      expect(shell.offsetHeight).toBe(
        w.container.querySelector('[role]')!.getBoundingClientRect().height,
      )
    })
  })
})
