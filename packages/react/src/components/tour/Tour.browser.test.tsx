import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { Tour, type TourProps, type TourStep } from './Tour'
import { mount } from '../../../test/mount'
import { signal, tick } from '../../../test/signal'
import '../../../test/browser.css'

let mounted: Array<{ unmount: () => Promise<void> }> = []

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(async () => {
  for (const wrapper of mounted) await wrapper.unmount()
  mounted = []
})

const steps: TourStep[] = [
  { target: '#first', title: '新建', description: '从这里创建项目。' },
  { target: '#second', title: '搜索', description: '按名称查找。', interactive: true },
  { target: '#third', title: '设置', description: '调整偏好。' },
]

async function harness(props: Partial<TourProps> = {}) {
  const open = signal(false)
  const step = signal(props.step ?? 1)
  const events: string[] = []
  const clicks: string[] = []
  function Harness() {
    const isOpen = open.use()
    const current = step.use()
    return (
      <div style={{ padding: '120px', display: 'flex', gap: '80px' }}>
        <button id="opener" onClick={() => (open.value = true)}>
          start
        </button>
        <button id="first" onClick={() => clicks.push('first')}>
          first
        </button>
        <input id="second" aria-label="search" />
        <button id="third" onClick={() => clicks.push('third')}>
          third
        </button>
        <Tour
          steps={steps}
          onFinish={() => events.push('finish')}
          onSkip={() => events.push('skip')}
          {...props}
          open={isOpen}
          onOpenChange={value => (open.value = value)}
          step={current}
          onStepChange={value => (step.value = value)}
        />
      </div>
    )
  }
  const wrapper = await mount(<Harness />)
  mounted.push(wrapper)
  return { open, step, events, clicks }
}

const card = () => document.querySelector<HTMLElement>('[data-hn-tour]')
const mask = () => document.querySelector<HTMLElement>('[data-hn-tour-mask]')
const blocker = () => document.querySelector<HTMLElement>('[data-hn-tour-blocker]:not([hidden])')
const beacon = () => document.querySelector<HTMLElement>('[data-hn-tour-beacon]')
const byId = (id: string) => document.getElementById(id) as HTMLElement
const action = (name: 'next' | 'prev' | 'skip') =>
  card()!.querySelector<HTMLElement>(`[data-hn-tour-${name}]`)!

async function start() {
  await userEvent.click(byId('opener'))
  await vi.waitFor(() => expect(card()).toBeTruthy())
  await vi.waitFor(() => expect(document.activeElement).toBe(card()))
}

describe('Tour', () => {
  it('walks the steps with the buttons, finishes and returns focus to the opener', async () => {
    const { step, events, open } = await harness()
    await start()
    expect(card()!.getAttribute('role')).toBe('dialog')
    expect(card()!.getAttribute('aria-modal')).toBe('true')
    expect(card()!.textContent).toContain('新建')
    expect(card()!.textContent).toContain('1 / 3')
    expect(mask()!.style.clipPath).toContain('evenodd')
    expect(card()!.querySelector('[data-hn-tour-prev]')).toBeNull()

    await userEvent.click(action('next'))
    await vi.waitFor(() => expect(card()!.textContent).toContain('搜索'))
    expect(step.value).toBe(2)
    await userEvent.click(action('prev'))
    await vi.waitFor(() => expect(step.value).toBe(1))

    await userEvent.click(action('next'))
    await userEvent.click(action('next'))
    await vi.waitFor(() => expect(card()!.textContent).toContain('3 / 3'))
    expect(action('next').textContent?.trim()).toBe('完成')
    await userEvent.click(action('next'))
    await vi.waitFor(() => expect(open.value).toBe(false))
    expect(events).toEqual(['finish'])
    await vi.waitFor(() => expect(card()).toBeNull())
    expect(document.activeElement).toBe(byId('opener'))
  })

  it('moves with the arrow keys and skips with Escape', async () => {
    const { step, events, open } = await harness()
    await start()
    await userEvent.keyboard('{ArrowRight}')
    await vi.waitFor(() => expect(step.value).toBe(2))
    await userEvent.keyboard('{ArrowLeft}')
    await vi.waitFor(() => expect(step.value).toBe(1))
    await userEvent.keyboard('{ArrowLeft}')
    expect(step.value).toBe(1)
    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(open.value).toBe(false))
    expect(events).toEqual(['skip'])
  })

  it('locked tours hide the skip button and ignore Escape', async () => {
    const { open } = await harness({ locked: true })
    await start()
    expect(card()!.querySelector('[data-hn-tour-skip]')).toBeNull()
    await userEvent.keyboard('{Escape}')
    await tick()
    expect(open.value).toBe(true)
  })

  it('waits for beforeChange and stays when it resolves false', async () => {
    let resolve: (value: boolean) => void = () => {}
    const beforeChange = vi.fn(() => new Promise<boolean>(done => (resolve = done)))
    const { step } = await harness({ beforeChange })
    await start()
    await userEvent.click(action('next'))
    await vi.waitFor(() => expect(card()!.getAttribute('aria-busy')).toBe('true'))
    expect(beforeChange).toHaveBeenCalledWith(2, 1)
    resolve(false)
    await vi.waitFor(() => expect(card()!.getAttribute('aria-busy')).toBeNull())
    expect(step.value).toBe(1)
    await userEvent.click(action('next'))
    resolve(true)
    await vi.waitFor(() => expect(step.value).toBe(2))
  })

  it('blocks the highlighted target unless the step is interactive', async () => {
    const { clicks } = await harness()
    await start()
    await vi.waitFor(() => expect(blocker()).toBeTruthy())
    const hole = blocker()!.getBoundingClientRect()
    const target = byId('first').getBoundingClientRect()
    expect(hole.left).toBeLessThan(target.left)
    expect(hole.right).toBeGreaterThan(target.right)
    await userEvent.click(byId('first'), { force: true })
    expect(clicks).toEqual([])

    await userEvent.click(action('next'))
    await vi.waitFor(() => expect(card()!.textContent).toContain('搜索'))
    await vi.waitFor(() => expect(blocker()).toBeNull())
    await userEvent.click(byId('second'))
    await userEvent.keyboard('abc')
    expect((byId('second') as HTMLInputElement).value).toBe('abc')
    expect(card()).toBeTruthy()
  })

  it('keeps Tab inside the card and the interactive target', async () => {
    await harness({ step: 2 })
    await start()
    const input = byId('second')
    const focusable = [...card()!.querySelectorAll<HTMLElement>('button')]
    for (let i = 0; i < focusable.length + 2; i++) {
      await userEvent.tab()
      const active = document.activeElement as HTMLElement
      expect(card()!.contains(active) || active === input).toBe(true)
    }
    expect(byId('opener').getAttribute('aria-hidden')).toBe('true')
    expect(input.closest('[aria-hidden="true"]')).toBeNull()
  })

  it('centres the card when a target is missing', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    await harness({ steps: [{ target: '#missing', title: '欢迎', description: '先看看这里。' }] })
    await start()
    const rect = card()!.getBoundingClientRect()
    expect(Math.abs(rect.left + rect.width / 2 - window.innerWidth / 2)).toBeLessThan(2)
    expect(Math.abs(rect.top + rect.height / 2 - window.innerHeight / 2)).toBeLessThan(2)
    expect(blocker()).toBeNull()
    expect(warn).toHaveBeenCalled()
    warn.mockRestore()
  })

  it('opens each step from its beacon', async () => {
    const { step } = await harness({ beacon: true })
    await userEvent.click(byId('opener'))
    await vi.waitFor(() => expect(beacon()).toBeTruthy())
    expect(card()).toBeNull()
    expect(mask()).toBeNull()
    expect(beacon()!.getAttribute('aria-label')).toBe('查看第 1 步：新建')
    const point = beacon()!.getBoundingClientRect()
    const target = byId('first').getBoundingClientRect()
    expect(Math.abs(point.left + point.width / 2 - target.right)).toBeLessThan(2)
    expect(Math.abs(point.top + point.height / 2 - target.top)).toBeLessThan(2)

    await userEvent.click(beacon()!)
    await vi.waitFor(() => expect(document.activeElement).toBe(card()))
    expect(mask()).toBeTruthy()
    await userEvent.click(action('next'))
    await vi.waitFor(() => expect(step.value).toBe(2))
    await vi.waitFor(() => expect(document.activeElement).toBe(beacon()))
    await vi.waitFor(() => expect(card()).toBeNull())
  })

  it('without a mask the tour is not modal and outside clicks keep it open', async () => {
    const { open, clicks } = await harness({ mask: false })
    await start()
    expect(mask()).toBeNull()
    expect(card()!.hasAttribute('aria-modal')).toBe(false)
    await userEvent.click(byId('third'))
    expect(clicks).toEqual(['third'])
    expect(open.value).toBe(true)
  })
})
