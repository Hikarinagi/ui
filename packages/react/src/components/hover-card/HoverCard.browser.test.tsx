import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { HoverCard, type HoverCardProps } from './HoverCard'
import { mount } from '../../../test/mount'
import { signal, type Signal } from '../../../test/signal'
import '../../../test/browser.css'

beforeEach(() => {
  document.body.innerHTML = ''
})

let mounted: Array<{ unmount: () => Promise<void> }> = []

afterEach(async () => {
  for (const w of mounted) await w.unmount()
  mounted = []
})

async function harness(props: Partial<HoverCardProps> = {}, open?: Signal<boolean>) {
  function Harness() {
    const value = open?.use()
    const bound = open ? { open: value, onOpenChange: (v: boolean) => (open.value = v) } : {}
    return (
      <div style={{ padding: '160px' }}>
        <HoverCard {...props} {...bound} content={<p>星见书音的资料</p>}>
          <a href="#">@shion</a>
        </HoverCard>
      </div>
    )
  }
  const w = await mount(<Harness />)
  mounted.push(w)
  return w
}

const panel = () => document.querySelector('[data-hn-hover-card]') as HTMLElement | null

function settle(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

describe('HoverCard', () => {
  it('悬停一段时间后浮出预览卡：Card 面、pop 动效、无箭头、不锁滚', async () => {
    const w = await harness({ openDelay: 100, closeDelay: 50 })
    const trigger = w.container.querySelector('a') as HTMLElement
    expect(panel()).toBeNull()

    await userEvent.hover(trigger)
    expect(panel()).toBeNull()
    await vi.waitFor(() => expect(panel()).toBeTruthy())

    const content = panel()!
    expect(content.textContent).toContain('星见书音的资料')
    expect(w.element.contains(content)).toBe(false)
    expect(content.dataset.side).toBe('bottom')
    expect(content.className).toContain('hn-anim-pop')
    expect(content.querySelector('svg')).toBeNull()
    const probe = document.createElement('span')
    probe.style.backgroundColor = 'var(--hn-surface)'
    document.body.appendChild(probe)
    const style = getComputedStyle(content)
    expect(style.backgroundColor).toBe(getComputedStyle(probe).backgroundColor)
    expect(style.boxShadow).not.toBe('none')
    expect(document.body.style.overflow).toBe('')
    expect(document.body.style.pointerEvents).toBe('')
  })

  it('指针移开后延时收回；移进卡片则保持打开', async () => {
    const w = await harness({ openDelay: 100, closeDelay: 150 })
    const trigger = w.container.querySelector('a') as HTMLElement
    await userEvent.hover(trigger)
    await vi.waitFor(() => expect(panel()).toBeTruthy())

    await userEvent.hover(panel()!)
    await settle(300)
    expect(panel()).toBeTruthy()

    await userEvent.unhover(panel()!)
    await vi.waitFor(() => expect(panel()).toBeNull())
  })

  it('键盘聚焦触发器后打开，焦点离开后收回', async () => {
    const w = await harness({ openDelay: 100, closeDelay: 50 })
    expect(w.container.querySelector('a')).not.toBeNull()
    await userEvent.keyboard('{Tab}')
    await vi.waitFor(() => expect(panel()).toBeTruthy())
    await userEvent.keyboard('{Tab}')
    await vi.waitFor(() => expect(panel()).toBeNull())
  })

  it('side 决定方向，open 支持受控', async () => {
    const open = signal(false)
    await harness({ side: 'top' }, open)
    open.value = true
    await vi.waitFor(() => expect(panel()).toBeTruthy())
    expect(panel()!.dataset.side).toBe('top')
    open.value = false
    await vi.waitFor(() => expect(panel()).toBeNull())
  })
})
