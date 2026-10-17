import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import type { ReactNode } from 'react'
import { Tour, type TourHandle, type TourProps, type TourStep } from './Tour'
import { Drawer } from '../drawer/Drawer'
import { resetDevWarnings } from '../../lib/dev'
import { mount } from '../../../test/mount'
import { signal, tick } from '../../../test/signal'
import '../../../test/browser.css'

let mounted: Array<{ unmount: () => Promise<void> }> = []
let cleanups: (() => void)[] = []

beforeEach(async () => {
  document.body.innerHTML = ''
  await page.viewport(1024, 720)
})

afterEach(async () => {
  for (const wrapper of mounted) await wrapper.unmount()
  mounted = []
  cleanups.forEach(cleanup => cleanup())
  cleanups = []
  vi.restoreAllMocks()
})

const steps: TourStep[] = [
  { target: '#first', title: '新建', description: '从这里创建项目。', blockTarget: true },
  { target: '#second', title: '搜索', description: '按名称查找。' },
  { target: '#third', title: '设置', description: '调整偏好。' },
]

const visibleSteps: TourStep[] = [
  { target: '#first', title: '新建', description: '从这里创建项目。' },
  { target: '#opener', title: '开始', description: '从这里重新开始。' },
]

async function harness(props: Partial<TourProps> = {}, extra: () => ReactNode = () => null) {
  const open = signal(false)
  const step = signal(props.step ?? 1)
  const events: string[] = []
  const clicks: string[] = []
  const handle: { current: TourHandle | null } = { current: null }
  const tour = {
    get value() {
      return handle.current
    },
  }
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
        {extra()}
        <Tour
          ref={node => {
            handle.current = node
          }}
          steps={steps}
          onFinish={() => events.push('finish')}
          onSkip={() => events.push('skip')}
          onClose={reason => events.push(`close:${reason}`)}
          onStepEnter={value => events.push(`enter:${value}`)}
          onStepLeave={value => events.push(`leave:${value}`)}
          {...props}
          open={isOpen}
          onOpenChange={value => (open.value = value)}
          step={current}
          onStepChange={value => (step.value = value)}
        />
      </div>
    )
  }
  mounted.push(await mount(<Harness />))
  return { open, step, events, clicks, tour }
}

const card = () => document.querySelector<HTMLElement>('[data-hn-tour]')
const openCard = () => document.querySelector<HTMLElement>('[data-hn-tour][data-state="open"]')
const mask = () => document.querySelector<HTMLElement>('[data-hn-tour-mask]')
const blocker = () => document.querySelector<HTMLElement>('[data-hn-tour-blocker]:not([hidden])')
const beacon = () => document.querySelector<HTMLElement>('[data-hn-tour-beacon]')
const pointer = () => document.querySelector<HTMLElement>('[data-hn-tour-pointer]')!
const keyBadge = () => document.querySelector<HTMLElement>('[data-hn-tour-key]')!
const byId = (id: string) => document.getElementById(id) as HTMLElement
const action = (name: 'next' | 'prev' | 'skip' | 'replay') =>
  card()!.querySelector<HTMLElement>(`[data-hn-tour-${name}]`)!

async function shown(text: string) {
  await vi.waitFor(() => expect(openCard()?.textContent).toContain(text))
  await vi.waitFor(() => expect(document.activeElement).toBe(openCard()))
}

async function press(name: 'next' | 'prev' | 'skip' | 'replay') {
  await vi.waitFor(() => expect(openCard()).toBeTruthy())
  await userEvent.click(openCard()!.querySelector<HTMLElement>(`[data-hn-tour-${name}]`)!)
}

function maskMotion() {
  const seen: string[] = []
  const record = (event: Event) => {
    if (!(event.target instanceof Element) || !event.target.matches('[data-hn-tour-mask]')) return
    seen.push(
      event instanceof TransitionEvent
        ? `transition:${event.propertyName}`
        : (event as AnimationEvent).animationName,
    )
  }
  document.addEventListener('animationstart', record)
  document.addEventListener('transitionrun', record)
  cleanups.push(() => {
    document.removeEventListener('animationstart', record)
    document.removeEventListener('transitionrun', record)
  })
  return seen
}

function sampleFrames<T>(read: () => T) {
  const samples: T[] = []
  let running = true
  const tick = () => {
    if (!running) return
    samples.push(read())
    requestAnimationFrame(tick)
  }
  tick()
  cleanups.push(() => (running = false))
  return {
    samples,
    stop: () => {
      running = false
      return samples
    },
  }
}

function holeBox() {
  const path = mask()?.style.clipPath ?? ''
  const inner = path.split(/z/i)[1] ?? ''
  const n = (inner.match(/-?\d+(\.\d+)?/g) ?? []).map(Number)
  if (n.length < 11) return null
  const r = n[3]!
  return { left: n[0]! - r, top: n[1]!, right: n[8]!, bottom: n[10]! + r }
}

const holeLeft = () => holeBox()?.left ?? null

function cardBox() {
  const wrapper = openCard()?.closest<HTMLElement>(
    '[data-reka-popper-content-wrapper],[data-radix-popper-content-wrapper]',
  )
  return (wrapper ?? openCard())?.getBoundingClientRect() ?? null
}

const round = (value: number) => Math.round(value * 100) / 100
const settle = (ms = 50) => new Promise(resolve => setTimeout(resolve, ms))

function reduceMotion() {
  const real = window.matchMedia.bind(window)
  vi.spyOn(window, 'matchMedia').mockImplementation(query =>
    query.includes('prefers-reduced-motion')
      ? ({ ...real(query), matches: true, media: query } as MediaQueryList)
      : real(query),
  )
}

async function start() {
  await userEvent.click(byId('opener'))
  await vi.waitFor(() => expect(openCard()).toBeTruthy())
  await vi.waitFor(() => expect(document.activeElement).toBe(openCard()))
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

    await press('next')
    await shown('搜索')
    expect(step.value).toBe(2)
    await press('prev')
    await vi.waitFor(() => expect(step.value).toBe(1))

    await shown('新建')
    await press('next')
    await shown('搜索')
    await press('next')
    await shown('3 / 3')
    expect(action('next').textContent?.trim()).toBe('完成')
    await press('next')
    await vi.waitFor(() => expect(open.value).toBe(false))
    expect(events.filter(event => !event.includes(':'))).toEqual(['finish'])
    await vi.waitFor(() => expect(card()).toBeNull())
    expect(document.activeElement).toBe(byId('opener'))
  })

  it('keeps the mask while the card hides between steps and reappears at the next target', async () => {
    await harness()
    await start()
    const shownMask = mask()!
    const changes: (string | null)[] = []
    const observer = new MutationObserver(records => {
      for (const record of records) changes.push(record.oldValue)
    })
    observer.observe(shownMask, {
      attributes: true,
      attributeFilter: ['data-state'],
      attributeOldValue: true,
    })
    const second = byId('second').getBoundingClientRect()
    const frames = sampleFrames(() => cardBox()?.left ?? null)
    await press('next')
    await shown('搜索')
    await settle(100)
    const samples = frames.stop()
    observer.disconnect()
    expect(changes).toEqual([])
    expect(mask()).toBe(shownMask)
    const gap = samples.indexOf(null)
    expect(gap).toBeGreaterThan(-1)
    const after = samples.slice(gap).filter((value): value is number => value !== null)
    expect(after.length).toBeGreaterThan(0)
    const resting = cardBox()!
    for (const left of after) expect(Math.abs(left - resting.left)).toBeLessThan(1)
    expect(resting.left).toBeLessThan(second.right)
    expect(resting.right).toBeGreaterThan(second.left)
  })

  it('opens the first hole from the centre of its target and springs it to the next target', async () => {
    await harness({ steps: visibleSteps })
    const seen = maskMotion()
    await start()
    await vi.waitFor(() => expect(seen).toEqual(['hn-fade-in', 'hn-tour-hole-in']))
    const target = byId('first').getBoundingClientRect()
    expect(mask()!.getAttribute('data-hn-tour-hole')).toBe('shown')
    expect(mask()!.style.getPropertyValue('--hn-tour-hole-origin')).toContain(
      `M${round(target.left + target.width / 2)} ${round(target.top + target.height / 2)}H`,
    )
    seen.length = 0
    const from = holeLeft()!
    const frames = sampleFrames(holeLeft)
    await press('next')
    await shown('开始')
    const to = holeLeft()!
    const samples = frames.stop()
    expect(seen).toEqual([])
    const between = samples.filter(
      value => value !== null && value < Math.max(from, to) - 1 && value > Math.min(from, to) + 1,
    )
    expect(between.length).toBeGreaterThan(3)
  })

  it('opens the hole on its target after a centred step and closes it in place', async () => {
    await harness({
      steps: [
        { title: '欢迎', description: '开始。' },
        visibleSteps[0]!,
        { title: '结束', description: '完成。' },
      ],
    })
    const seen = maskMotion()
    await start()
    await vi.waitFor(() => expect(seen).toEqual(['hn-fade-in']))
    expect(mask()!.hasAttribute('data-hn-tour-hole')).toBe(false)
    seen.length = 0
    await press('next')
    await vi.waitFor(() => expect(seen).toEqual(['hn-tour-hole-in']))
    expect(mask()!.getAttribute('data-hn-tour-hole')).toBe('shown')
    seen.length = 0
    await press('next')
    await vi.waitFor(() => expect(seen).toEqual(['hn-tour-hole-out']))
    expect(mask()!.getAttribute('data-hn-tour-hole')).toBe('hidden')
    const closing = mask()!
      .getAnimations()
      .find(animation => (animation as CSSAnimation).animationName === 'hn-tour-hole-out')!
    expect(closing.effect!.getComputedTiming().duration).toBe(300)
    expect((closing.effect as KeyframeEffect).getKeyframes()[0]!.easing).toBe(
      'cubic-bezier(0.4, 0, 0.2, 1)',
    )
    await settle()
    expect(seen).toEqual(['hn-tour-hole-out'])
  })

  it('reopens with a new hole instead of sliding from the last one', async () => {
    const { step } = await harness({ steps: visibleSteps })
    await start()
    await press('next')
    await shown('开始')
    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(mask()).toBeNull())
    step.value = 1
    await tick()
    const seen = maskMotion()
    await start()
    await vi.waitFor(() => expect(seen).toEqual(['hn-fade-in', 'hn-tour-hole-in']))
    await settle()
    expect(seen).toEqual(['hn-fade-in', 'hn-tour-hole-in'])
  })

  it('reopens on a centred step without closing the last hole again', async () => {
    const { step } = await harness({
      steps: [{ title: '欢迎', description: '开始。' }, visibleSteps[0]!],
    })
    await start()
    await press('next')
    await vi.waitFor(() => expect(mask()!.getAttribute('data-hn-tour-hole')).toBe('shown'))
    await shown('新建')
    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(mask()).toBeNull())
    step.value = 1
    await tick()
    const seen = maskMotion()
    await start()
    await vi.waitFor(() => expect(seen).toEqual(['hn-fade-in']))
    await settle()
    expect(seen).toEqual(['hn-fade-in'])
    expect(mask()!.hasAttribute('data-hn-tour-hole')).toBe(false)
  })

  it('moves with the arrow keys and skips with Escape', async () => {
    const { step, events, open } = await harness()
    await start()
    await userEvent.keyboard('{ArrowRight}')
    await vi.waitFor(() => expect(step.value).toBe(2))
    await shown('搜索')
    await userEvent.keyboard('{ArrowLeft}')
    await vi.waitFor(() => expect(step.value).toBe(1))
    await shown('新建')
    await userEvent.keyboard('{ArrowLeft}')
    expect(step.value).toBe(1)
    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(open.value).toBe(false))
    expect(events.filter(event => !event.includes(':'))).toEqual(['skip'])
  })

  it('handles the arrow keys and Escape while focus is on the target, not the card', async () => {
    const { step, open, events } = await harness({
      steps: [steps[2]!, { target: '#first', title: '新建' }],
    })
    await start()
    await userEvent.click(byId('third'))
    expect(document.activeElement).toBe(byId('third'))
    await userEvent.keyboard('{ArrowRight}')
    await vi.waitFor(() => expect(step.value).toBe(2))
    await shown('新建')
    byId('first').focus()
    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(open.value).toBe(false))
    expect(events).toContain('close:escape')
  })

  it('emits step-enter, step-leave and close with the reason', async () => {
    const { events, open, tour } = await harness()
    await start()
    await press('next')
    await shown('搜索')
    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(open.value).toBe(false))
    expect(events).toEqual(['enter:1', 'leave:1', 'enter:2', 'skip', 'leave:2', 'close:escape'])

    events.length = 0
    await start()
    await press('skip')
    await vi.waitFor(() => expect(open.value).toBe(false))
    expect(events).toEqual(['enter:2', 'skip', 'leave:2', 'close:skip'])

    events.length = 0
    await start()
    tour.value!.close()
    await vi.waitFor(() => expect(open.value).toBe(false))
    expect(events).toEqual(['enter:2', 'leave:2', 'close:close'])

    events.length = 0
    await start()
    open.value = false
    await vi.waitFor(() => expect(events).toEqual(['enter:2', 'leave:2', 'close:close']))

    events.length = 0
    await start()
    await press('next')
    await shown('设置')
    await press('next')
    await vi.waitFor(() => expect(open.value).toBe(false))
    expect(events).toEqual(['enter:2', 'leave:2', 'enter:3', 'finish', 'leave:3', 'close:finish'])
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
    await press('next')
    await vi.waitFor(() => expect(card()!.getAttribute('aria-busy')).toBe('true'))
    expect(beforeChange).toHaveBeenCalledWith(2, 1)
    resolve(false)
    await vi.waitFor(() => expect(card()!.getAttribute('aria-busy')).toBeNull())
    expect(step.value).toBe(1)
    await press('next')
    resolve(true)
    await vi.waitFor(() => expect(step.value).toBe(2))
  })

  it('blocks the target only when the step asks for it', async () => {
    const { clicks } = await harness()
    await start()
    expect(blocker()).toBeTruthy()
    const hole = blocker()!.getBoundingClientRect()
    const target = byId('first').getBoundingClientRect()
    expect(hole.left).toBeLessThan(target.left)
    expect(hole.right).toBeGreaterThan(target.right)
    await userEvent.click(byId('first'), { force: true })
    expect(clicks).toEqual([])

    await press('next')
    await shown('搜索')
    await vi.waitFor(() => expect(blocker()).toBeNull())
    await userEvent.click(byId('second'))
    await userEvent.keyboard('abc')
    expect((byId('second') as HTMLInputElement).value).toBe('abc')
    expect(card()).toBeTruthy()
  })

  it('blockPage covers the whole viewport and leaves the card usable', async () => {
    const { clicks, step } = await harness({
      blockPage: true,
      steps: [steps[2]!, steps[1]!],
    })
    await start()
    const rect = blocker()!.getBoundingClientRect()
    expect([rect.left, rect.top, rect.width, rect.height]).toEqual([
      0,
      0,
      window.innerWidth,
      window.innerHeight,
    ])
    await userEvent.click(byId('third'), { force: true })
    expect(clicks).toEqual([])
    await press('next')
    await vi.waitFor(() => expect(step.value).toBe(2))
  })

  it('keeps Tab inside the card and the clickable target', async () => {
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
  })

  it('waits for a late target with the card hidden and the hole kept in place', async () => {
    const late = signal(false)
    const { step } = await harness(
      { steps: [visibleSteps[0]!, { target: '#late', title: '稍后', wait: 3000 }] },
      () => (late.use() ? <button id="late">late</button> : null),
    )
    await start()
    await settle(400)
    const before = mask()!.style.clipPath
    await press('next')
    await vi.waitFor(() => expect(step.value).toBe(2))
    await settle(300)
    expect(openCard()).toBeNull()
    expect(mask()!.style.clipPath).toBe(before)
    const frames = sampleFrames(() => cardBox()?.left ?? null)
    late.value = true
    await shown('稍后')
    await settle(100)
    const samples = frames.stop().filter((value): value is number => value !== null)
    const resting = cardBox()!.left
    for (const left of samples) expect(Math.abs(left - resting)).toBeLessThan(1)
    const target = byId('late').getBoundingClientRect()
    const card = openCard()!.getBoundingClientRect()
    expect(card.left).toBeLessThan(target.right)
    expect(card.right).toBeGreaterThan(target.left)
  })

  it('centres the card once the wait for a target times out', async () => {
    resetDevWarnings()
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    await harness({ steps: [{ target: '#never', title: '没有', wait: 200 }] })
    await userEvent.click(byId('opener'))
    await settle(100)
    expect(openCard()).toBeNull()
    await shown('没有')
    const rect = openCard()!.getBoundingClientRect()
    expect(Math.abs(rect.left + rect.width / 2 - window.innerWidth / 2)).toBeLessThan(2)
    expect(warn).toHaveBeenCalled()
  })

  it('spotlights a DOMRect, a virtual element and the union of several targets', async () => {
    const virtual = {
      getBoundingClientRect: () => DOMRect.fromRect({ x: 300, y: 400, width: 50, height: 20 }),
    }
    await harness({
      steps: [
        { target: ['#first', '#third'], title: '两个', padding: 0 },
        { target: { x: 20, y: 30, width: 40, height: 50 }, title: '矩形', padding: 0 },
        { target: virtual, title: '虚拟', padding: 0 },
      ],
    })
    await start()
    const first = byId('first').getBoundingClientRect()
    const third = byId('third').getBoundingClientRect()
    await vi.waitFor(() => expect(holeBox()!.left).toBeCloseTo(first.left, 0))
    expect(holeBox()!.right).toBeCloseTo(third.right, 0)
    await press('next')
    await shown('矩形')
    await vi.waitFor(() => expect(holeBox()).toEqual({ left: 20, top: 30, right: 60, bottom: 80 }))
    await press('next')
    await shown('虚拟')
    await vi.waitFor(() =>
      expect(holeBox()).toEqual({ left: 300, top: 400, right: 350, bottom: 420 }),
    )
  })

  it('keeps the card inside the viewport for a target taller than the viewport', async () => {
    await harness({ steps: [{ target: '#tall', title: '很高', side: 'bottom' }] }, () => (
      <div id="tall" style={{ width: 200, height: 2000 }} />
    ))
    await start()
    await settle(100)
    const rect = openCard()!.getBoundingClientRect()
    expect(rect.top).toBeGreaterThanOrEqual(0)
    expect(rect.bottom).toBeLessThanOrEqual(window.innerHeight)
  })

  it('dims without blur when mask is dim', async () => {
    await harness({ mask: 'dim' })
    await start()
    expect(getComputedStyle(mask()!).backdropFilter).toBe('none')
    expect(getComputedStyle(mask()!).backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
  })

  it('blurs by default', async () => {
    await harness()
    await start()
    expect(getComputedStyle(mask()!).backdropFilter).toContain('blur')
  })

  it('opens from a beacon and then moves between cards directly', async () => {
    const { step } = await harness({
      beacon: true,
      steps: [steps[0]!, steps[1]!, { ...steps[2]!, beacon: true }],
    })
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
    await press('next')
    await vi.waitFor(() => expect(step.value).toBe(2))
    await shown('搜索')
    expect(beacon()).toBeNull()

    await press('next')
    await vi.waitFor(() => expect(step.value).toBe(3))
    await vi.waitFor(() => expect(document.activeElement).toBe(beacon()))
    await vi.waitFor(() => expect(card()).toBeNull())
    await userEvent.keyboard('{Enter}')
    await vi.waitFor(() => expect(card()!.textContent).toContain('设置'))
  })

  it('points the arrow at the target and never shows the card centred first', async () => {
    const inserted: HTMLElement[] = []
    const observer = new MutationObserver(records => {
      for (const record of records)
        for (const node of record.addedNodes)
          if (node instanceof HTMLElement) {
            const found = node.matches('[data-hn-tour]')
              ? node
              : node.querySelector('[data-hn-tour]')
            if (found) inserted.push(found as HTMLElement)
          }
    })
    observer.observe(document.body, { childList: true, subtree: true })
    await harness()
    await start()
    observer.disconnect()
    expect(inserted.length).toBeGreaterThan(0)
    for (const element of inserted)
      expect(
        element.closest('[data-reka-popper-content-wrapper],[data-radix-popper-content-wrapper]'),
      ).not.toBeNull()
    const arrow = card()!.querySelector<SVGElement>('[data-hn-tour-arrow]')!
    const arrowRect = arrow.getBoundingClientRect()
    const target = byId('first').getBoundingClientRect()
    const cardRect = card()!.getBoundingClientRect()
    expect(arrowRect.top).toBeGreaterThan(target.bottom)
    expect(arrowRect.bottom).toBeLessThanOrEqual(cardRect.top + 1)
    expect(
      Math.abs(arrowRect.left + arrowRect.width / 2 - (target.left + target.width / 2)),
    ).toBeLessThan(2)
  })

  it('stays on its target while the closing animation runs', async () => {
    const { open } = await harness()
    await start()
    const target = byId('first').getBoundingClientRect()
    const offset = () => card()!.getBoundingClientRect().top - target.bottom
    const resting = offset()
    expect(resting).toBeGreaterThan(0)
    const frames = sampleFrames(() => (card() ? offset() : null))
    await press('skip')
    await vi.waitFor(() => expect(open.value).toBe(false))
    await vi.waitFor(() => expect(card()).toBeNull())
    const samples = frames.stop().filter((value): value is number => value !== null)
    expect(samples.length).toBeGreaterThan(1)
    for (const value of samples) expect(Math.abs(value - resting)).toBeLessThan(12)
  })

  it('moves from a centred step to a target without hiding errors', async () => {
    const error = vi.spyOn(console, 'error')
    const warn = vi.spyOn(console, 'warn')
    await harness({ steps: [{ title: '欢迎', description: '开始。' }, steps[0]!] })
    await start()
    await press('next')
    await shown('新建')
    await vi.waitFor(() => expect(byId('opener').getAttribute('aria-hidden')).toBe('true'))
    expect(card()!.closest('[aria-hidden="true"]')).toBeNull()
    const calls = [...error.mock.calls, ...warn.mock.calls].flat().join(' ')
    expect(calls).not.toContain('aria-hidden')
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

describe('Tour scripts', () => {
  it('runs play on entry, aborts it on leave and runs the deferred cleanups in reverse', async () => {
    const log: string[] = []
    let signal: AbortSignal | null = null
    const { events } = await harness({
      steps: [
        {
          target: '#first',
          title: '演示',
          play: async (context: {
            signal: AbortSignal
            defer: (fn: () => void) => void
            sleep: (ms: number) => Promise<void>
            step: number
          }) => {
            signal = context.signal
            log.push(`play:${context.step}`)
            context.defer(() => log.push('cleanup:a'))
            context.defer(() => log.push('cleanup:b'))
            try {
              await context.sleep(10_000)
            } catch (error) {
              log.push((error as Error).name)
              throw error
            }
          },
        },
        { target: '#third', title: '下一步' },
      ],
    })
    await start()
    await vi.waitFor(() => expect(log).toEqual(['play:1']))
    await press('next')
    await shown('下一步')
    expect(signal!.aborted).toBe(true)
    expect(log).toEqual(['play:1', 'cleanup:b', 'cleanup:a', 'AbortError'])
    expect(events.indexOf('leave:1')).toBeLessThan(events.indexOf('enter:2'))
  })

  it('cleans up when the tour closes and replays from the card button', async () => {
    const log: string[] = []
    const { open } = await harness({
      steps: [
        {
          target: '#first',
          title: '演示',
          play: (context: { defer: (fn: () => void) => void }) => {
            log.push('play')
            context.defer(() => log.push('cleanup'))
          },
        },
      ],
    })
    await start()
    await vi.waitFor(() => expect(log).toEqual(['play']))
    expect(action('replay').getAttribute('aria-label')).toBe('重新演示')
    await press('replay')
    await vi.waitFor(() => expect(log).toEqual(['play', 'cleanup', 'play']))
    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(open.value).toBe(false))
    expect(log).toEqual(['play', 'cleanup', 'play', 'cleanup'])
  })

  it('moves the spotlight inside a step and the card follows it smoothly', async () => {
    let move: (() => Promise<void>) | null = null
    await harness({
      steps: [
        {
          target: '#first',
          title: '移动',
          play: (context: { spotlight: (target: string) => Promise<void> }) => {
            move = () => context.spotlight('#third')
          },
        },
      ],
    })
    await start()
    await vi.waitFor(() => expect(move).toBeTruthy())
    await settle(300)
    const from = cardBox()!.left
    const frames = sampleFrames(() => cardBox()?.left ?? null)
    await move!()
    await settle(50)
    const samples = frames.stop()
    expect(samples).not.toContain(null)
    const to = cardBox()!.left
    const third = byId('third').getBoundingClientRect()
    expect(to).toBeGreaterThan(from + 100)
    expect(openCard()!.getBoundingClientRect().right).toBeGreaterThan(third.left)
    const between = (samples as number[]).filter(left => left > from + 2 && left < to - 2)
    expect(between.length).toBeGreaterThan(3)
  })

  it('drives a virtual pointer: move, tap, press, drag with per-frame callbacks and keys', async () => {
    const moves: { x: number; y: number }[] = []
    let done = false
    await harness({
      steps: [
        {
          target: '#first',
          title: '指针',
          play: async (context: {
            pointer: {
              move: (target: string, duration?: number) => Promise<void>
              tap: () => Promise<void>
              press: (duration?: number) => Promise<void>
              drag: (
                target: string,
                duration: number,
                onMove: (point: { x: number; y: number }) => void,
              ) => Promise<void>
              key: (key: string, duration?: number) => Promise<void>
            }
          }) => {
            await context.pointer.move('#first', 150)
            await context.pointer.tap()
            await context.pointer.press(150)
            await context.pointer.drag('#third', 200, point => moves.push(point))
            await context.pointer.key('→', 300)
            done = true
          },
        },
      ],
    })
    await start()
    await vi.waitFor(() => expect(pointer().getAttribute('data-state')).toBe('shown'))
    expect(pointer().getAttribute('data-kind')).toBe('mouse')
    expect(pointer().querySelector('svg[data-hn-tour-pointer-glyph]')).toBeTruthy()
    await vi.waitFor(() => expect(pointer().querySelector('[data-hn-tour-ripple]')).toBeTruthy())
    await vi.waitFor(() => expect(pointer().getAttribute('data-pressed')).toBe('long'))
    await vi.waitFor(() => expect(keyBadge().getAttribute('data-state')).toBe('shown'))
    expect(keyBadge().textContent).toBe('→')
    await vi.waitFor(() => expect(done).toBe(true))
    const third = byId('third').getBoundingClientRect()
    expect(moves.length).toBeGreaterThan(3)
    for (let i = 1; i < moves.length; i++)
      expect(moves[i]!.x).toBeGreaterThanOrEqual(moves[i - 1]!.x)
    expect(moves.at(-1)!.x).toBeCloseTo(third.left + third.width / 2, 0)
    const [x] = /translate3d\(([-\d.]+)px/.exec(pointer().style.transform)!.slice(1).map(Number)
    expect(x).toBeCloseTo(third.left + third.width / 2, 1)
    expect(keyBadge().getAttribute('data-state')).toBe('hidden')
  })

  it('jumps the pointer straight to the end with reduced motion', async () => {
    reduceMotion()
    const moves: { x: number; y: number }[] = []
    let done = false
    await harness({
      steps: [
        {
          target: '#first',
          title: '指针',
          play: async (context: {
            pointer: {
              drag: (
                target: string,
                duration: number,
                onMove: (point: { x: number; y: number }) => void,
              ) => Promise<void>
            }
          }) => {
            await context.pointer.drag('#third', 2000, point => moves.push(point))
            done = true
          },
        },
      ],
    })
    const startedAt = performance.now()
    await start()
    await vi.waitFor(() => expect(done).toBe(true))
    expect(performance.now() - startedAt).toBeLessThan(1500)
    const third = byId('third').getBoundingClientRect()
    expect(moves.at(-1)!.x).toBeCloseTo(third.left + third.width / 2, 0)
    expect(moves.length).toBeLessThanOrEqual(2)
  })

  it('draws a finger for coarse pointers', async () => {
    await harness({ pointer: 'touch' })
    await start()
    expect(pointer().getAttribute('data-kind')).toBe('touch')
    expect(pointer().querySelector('span[data-hn-tour-pointer-glyph]')).toBeTruthy()
  })

  it('picks the finger automatically on a coarse pointer', async () => {
    const real = window.matchMedia.bind(window)
    vi.spyOn(window, 'matchMedia').mockImplementation(query =>
      query.includes('pointer: coarse')
        ? ({ ...real(query), matches: true, media: query } as MediaQueryList)
        : real(query),
    )
    await harness()
    await start()
    expect(pointer().getAttribute('data-kind')).toBe('touch')
  })

  it('coexists with a modal Drawer the play opens', async () => {
    const drawer = signal(false)
    const log: string[] = []
    const { open, step } = await harness(
      {
        steps: [
          {
            target: '#drawer-input',
            title: '抽屉',
            wait: 3000,
            play: (context: { defer: (fn: () => void) => void }) => {
              drawer.value = true
              context.defer(() => {
                drawer.value = false
                log.push('closed drawer')
              })
            },
          },
          { target: '#first', title: '返回' },
        ],
      },
      () => (
        <Drawer
          title="设置"
          open={drawer.use()}
          onOpenChange={value => (drawer.value = value)}
          renderContent={() => <input id="drawer-input" aria-label="抽屉输入" />}
        />
      ),
    )
    await start()
    await shown('抽屉')
    const panel = document.querySelector<HTMLElement>('[role="dialog"]:not([data-hn-tour])')!
    expect(panel).toBeTruthy()
    await settle(500)
    const box = panel.getBoundingClientRect()
    const hit = document.elementFromPoint(box.left + 10, box.bottom - 10)
    expect(panel.contains(hit)).toBe(false)
    expect(hit?.closest('[data-hn-tour-mask]')).toBeTruthy()
    expect(openCard()!.closest('[aria-hidden="true"]')).toBeNull()
    await userEvent.click(openCard()!.querySelector<HTMLElement>('[data-hn-tour-next]')!)
    await vi.waitFor(() => expect(step.value).toBe(2))
    expect(log).toEqual(['closed drawer'])
    await shown('返回')
    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(open.value).toBe(false))
  })

  it('keeps the drawer open and skips the tour on Escape during a scripted step', async () => {
    const drawer = signal(false)
    const { open } = await harness(
      {
        steps: [
          {
            target: '#drawer-input',
            title: '抽屉',
            wait: 3000,
            play: (context: { defer: (fn: () => void) => void }) => {
              drawer.value = true
              context.defer(() => (drawer.value = false))
            },
          },
        ],
      },
      () => (
        <Drawer
          title="设置"
          open={drawer.use()}
          onOpenChange={value => (drawer.value = value)}
          renderContent={() => <input id="drawer-input" aria-label="抽屉输入" />}
        />
      ),
    )
    await start()
    await shown('抽屉')
    expect(drawer.value).toBe(true)
    expect(document.activeElement).toBe(openCard())
    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(open.value).toBe(false))
    expect(drawer.value).toBe(false)
  })
})
