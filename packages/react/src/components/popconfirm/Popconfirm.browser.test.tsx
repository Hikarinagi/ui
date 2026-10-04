import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { Popconfirm, type PopconfirmProps } from './Popconfirm'
import { Button } from '../button/Button'
import { mount } from '../../../test/mount'
import { signal, type Signal } from '../../../test/signal'
import '../../../test/browser.css'

beforeEach(() => {
  document.body.innerHTML = ''
})

let mounted: Array<{ unmount: () => Promise<void> }> = []
let silence: (() => void) | undefined

afterEach(async () => {
  for (const w of mounted) await w.unmount()
  mounted = []
  silence?.()
  silence = undefined
})

function quietly() {
  const handler = (event: PromiseRejectionEvent) => {
    event.preventDefault()
    event.stopImmediatePropagation()
  }
  window.addEventListener('unhandledrejection', handler, { capture: true })
  silence = () => window.removeEventListener('unhandledrejection', handler, { capture: true })
}

async function harness(
  props: Partial<PopconfirmProps> = {},
  open?: Signal<boolean>,
  quiet = false,
) {
  if (quiet) quietly()
  function Harness() {
    const value = open?.use()
    const bound = open ? { open: value, onOpenChange: (v: boolean) => (open.value = v) } : {}
    return (
      <div style={{ padding: '160px' }}>
        <Popconfirm title="删除这条评论？" description="删除后无法恢复。" {...props} {...bound}>
          <Button variant="outline" tone="neutral">
            删除
          </Button>
        </Popconfirm>
      </div>
    )
  }
  const w = await mount(<Harness />)
  mounted.push(w)
  return w
}

type Mounted = Awaited<ReturnType<typeof harness>>

const panel = () => document.querySelector('[data-hn-popconfirm]') as HTMLElement | null
const button = (text: string) =>
  [...panel()!.querySelectorAll('button')].find(b => b.textContent?.trim() === text)!

async function openIt(w: Mounted) {
  const trigger = w.container.querySelector('button') as HTMLElement
  await userEvent.click(trigger)
  await vi.waitFor(() => expect(panel()).toBeTruthy())
  return trigger
}

function settle(ms = 150) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

describe('Popconfirm', () => {
  it('打开后是带标题与说明的 dialog，焦点落在取消钮，锁滚，pop 动效', async () => {
    const w = await harness()
    await openIt(w)
    const content = panel()!
    expect(content.getAttribute('role')).toBe('dialog')
    const labelId = content.getAttribute('aria-labelledby')!
    expect(document.getElementById(labelId)!.textContent).toBe('删除')
    const described = content
      .getAttribute('aria-describedby')!
      .split(' ')
      .map(id => document.getElementById(id)!.textContent?.trim())
    expect(described).toEqual(['删除这条评论？', '删除后无法恢复。'])
    expect(content.querySelectorAll('button')).toHaveLength(2)
    expect(document.activeElement).toBe(button('取消'))
    expect(content.className).toContain('hn-anim-pop')
    expect(content.dataset.side).toBe('bottom')
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('Esc 与点外收回且不触发 cancel；点取消才触发，焦点归还触发器', async () => {
    const onCancel = vi.fn()
    const w = await harness({ onCancel })
    const trigger = await openIt(w)

    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(panel()).toBeNull())
    expect(document.activeElement).toBe(trigger)
    expect(onCancel).not.toHaveBeenCalled()

    await openIt(w)
    await userEvent.click(document.body, { force: true, position: { x: 8, y: 8 } })
    await vi.waitFor(() => expect(panel()).toBeNull())
    expect(onCancel).not.toHaveBeenCalled()

    await openIt(w)
    await userEvent.click(button('取消'))
    await vi.waitFor(() => expect(panel()).toBeNull())
    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(document.activeElement).toBe(trigger)
  })

  it('确定调用处理函数后收回', async () => {
    const onConfirm = vi.fn()
    const w = await harness({ onConfirm, confirmText: '删除' })
    await openIt(w)
    await userEvent.click(button('删除'))
    await vi.waitFor(() => expect(panel()).toBeNull())
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('异步确定期间忙碌：取消禁用、Esc 与点外无效，完成后才收回', async () => {
    let finish!: () => void
    const onConfirm = vi.fn(() => new Promise<void>(resolve => (finish = resolve)))
    const w = await harness({ onConfirm })
    await openIt(w)
    await userEvent.click(button('确定'))
    await vi.waitFor(() => expect(panel()!.getAttribute('aria-busy')).toBe('true'))
    expect(button('取消').disabled).toBe(true)
    await userEvent.keyboard('{Escape}')
    await userEvent.click(document.body, { force: true, position: { x: 8, y: 8 } })
    await settle()
    expect(panel()).toBeTruthy()
    finish()
    await vi.waitFor(() => expect(panel()).toBeNull())
  })

  it('处理函数失败时保持打开并退出忙碌', async () => {
    const onConfirm = vi.fn(() => Promise.reject(new Error('失败')))
    const w = await harness({ onConfirm }, undefined, true)
    await openIt(w)
    await userEvent.click(button('确定'))
    await settle(300)
    expect(panel()).toBeTruthy()
    expect(panel()!.getAttribute('aria-busy')).toBeNull()
    expect(button('取消').disabled).toBe(false)
  })

  it('tone 为 danger 时确定钮换成危险色', async () => {
    const w = await harness({ tone: 'danger' })
    await openIt(w)
    const probe = document.createElement('span')
    probe.className = 'bg-danger'
    document.body.appendChild(probe)
    expect(getComputedStyle(button('确定')).backgroundColor).toBe(
      getComputedStyle(probe).backgroundColor,
    )
  })

  it('side 决定浮出方向，open 支持受控', async () => {
    const open = signal(false)
    await harness({ side: 'top' }, open)
    open.value = true
    await vi.waitFor(() => expect(panel()).toBeTruthy())
    expect(panel()!.dataset.side).toBe('top')
    await userEvent.click(button('取消'))
    await vi.waitFor(() => expect(panel()).toBeNull())
    expect(open.value).toBe(false)
  })
})
