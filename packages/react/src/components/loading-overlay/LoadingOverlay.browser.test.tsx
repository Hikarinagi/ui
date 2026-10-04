import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { LoadingOverlay, type LoadingOverlayProps } from './LoadingOverlay'
import { Button } from '../button/Button'
import { mount } from '../../../test/mount'
import { signal } from '../../../test/signal'
import '../../../test/browser.css'

beforeEach(() => {
  document.body.innerHTML = ''
})

let mounted: Array<{ unmount: () => Promise<void> }> = []

afterEach(async () => {
  for (const w of mounted) await w.unmount()
  mounted = []
})

async function harness(props: Partial<LoadingOverlayProps> = {}) {
  const visible = signal(false)
  const clicks = vi.fn()
  function Harness() {
    return (
      <div style={{ position: 'relative', width: '320px', height: '200px', padding: '40px' }}>
        <Button variant="outline" tone="neutral" onClick={clicks}>
          按钮
        </Button>
        <LoadingOverlay visible={visible.use()} text="正在加载" {...props} />
      </div>
    )
  }
  const w = await mount(<Harness />)
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
    const { visible, clicks } = await harness()
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
    const { visible, clicks } = await harness()
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
    const { visible } = await harness({ delay: 0, minVisible: 500 })
    visible.value = true
    await vi.waitFor(() => expect(overlay()).toBeTruthy())
    await settle(100)
    visible.value = false
    await settle(200)
    expect(overlay()).toBeTruthy()
    expect(parseFloat(getComputedStyle(overlay()!).opacity)).toBeGreaterThan(0.5)
    await vi.waitFor(() => expect(overlay()).toBeNull(), { timeout: 1500 })
  })
})
