import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import { page, userEvent } from '@vitest/browser/context'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, ref, type Ref } from 'vue'
import Sheet from './Sheet.vue'
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

function harness(props: Record<string, unknown> = {}, open?: Ref<boolean>) {
  const host = document.createElement('div')
  document.body.appendChild(host)
  const w = mount(
    defineComponent({
      setup: () => () => {
        const bound: Record<string, unknown> & { title: string } = {
          title: '分享到',
          description: '选择一个去处。',
          ...props,
        }
        if (open) {
          bound.open = open.value
          bound['onUpdate:open'] = (value: boolean) => (open.value = value)
        }
        return h(
          'div',
          { style: 'padding: 40px' },
          h(Sheet, bound, {
            default: () => h(Button, { variant: 'outline', tone: 'neutral' }, () => '打开'),
            content: () => h('div', { style: 'height: 160px' }, '正文'),
          }),
        )
      },
    }),
    { attachTo: host },
  )
  mounted.push(w)
  return w
}

const panel = () => document.querySelector('[data-hn-sheet]') as HTMLElement | null
const grip = () => panel()!.querySelector('[data-hn-sheet-grip]') as HTMLElement

async function openIt(w: VueWrapper) {
  await userEvent.click(w.find('button').element as HTMLElement)
  await vi.waitFor(() => expect(panel()).toBeTruthy())
  await vi.waitFor(() => expect(getComputedStyle(panel()!).animationName).toBeDefined())
  await new Promise(resolve => setTimeout(resolve, 500))
}

function pointer(type: string, y: number, id = 7) {
  return new PointerEvent(type, {
    bubbles: true,
    cancelable: true,
    pointerId: id,
    pointerType: 'touch',
    isPrimary: true,
    button: type === 'pointerdown' ? 0 : -1,
    clientX: 100,
    clientY: y,
  })
}

async function drag(from: number, to: number, steps = 4, gap = 16) {
  const el = grip()
  el.dispatchEvent(pointer('pointerdown', from))
  for (let i = 1; i <= steps; i++) {
    await new Promise(resolve => setTimeout(resolve, gap))
    el.dispatchEvent(pointer('pointermove', from + ((to - from) * i) / steps))
  }
  await new Promise(resolve => setTimeout(resolve, gap))
  el.dispatchEvent(pointer('pointerup', to))
}

describe('Sheet', () => {
  it('从底部升起：贴底、顶角圆、sheet 动效、遮罩与锁滚、标题关联', async () => {
    await page.viewport(414, 800)
    const w = harness()
    await openIt(w)
    const el = panel()!
    expect(el.getAttribute('role')).toBe('dialog')
    const labelId = el.getAttribute('aria-labelledby')!
    expect(document.getElementById(labelId)!.textContent).toBe('分享到')
    const box = el.getBoundingClientRect()
    expect(Math.round(box.bottom)).toBe(window.innerHeight)
    expect(Math.round(box.left)).toBe(0)
    expect(Math.round(box.width)).toBe(window.innerWidth)
    const style = getComputedStyle(el)
    expect(parseFloat(style.borderTopLeftRadius)).toBeGreaterThan(0)
    expect(style.borderBottomLeftRadius).toBe('0px')
    expect(el.className).toContain('hn-anim-sheet-bottom')
    expect(document.querySelector('.hn-scrim')).toBeTruthy()
    expect(document.body.style.overflow).toBe('hidden')
    expect(el.querySelector('[aria-label="关闭"]')).toBeNull()
    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(panel()).toBeNull())
  })

  it('去掉把手时改由关闭按钮承担关闭', async () => {
    await page.viewport(414, 800)
    const w = harness({ handle: false })
    await openIt(w)
    const close = panel()!.querySelector('[aria-label="关闭"]') as HTMLElement
    expect(close).toBeTruthy()
    await userEvent.click(close)
    await vi.waitFor(() => expect(panel()).toBeNull())
  })

  it('拖一小段松手弹回，拖过三成或者快速下滑则关闭，退场从松手位置接着走', async () => {
    await page.viewport(414, 800)
    const w = harness()
    await openIt(w)
    const el = panel()!
    const height = el.offsetHeight

    await drag(600, 640)
    await vi.waitFor(() => expect(el.style.transform).toBe(''))
    expect(panel()).toBeTruthy()

    const far = 600 + Math.round(height * 0.45)
    const before = el.getBoundingClientRect().top
    await drag(600, far, 6, 40)
    expect(el.style.getPropertyValue('--hn-sheet-from-y')).toBe(`${far - 600}px`)
    expect(el.getBoundingClientRect().top).toBeGreaterThanOrEqual(before)
    await vi.waitFor(() => expect(panel()).toBeNull())

    await openIt(w)
    await drag(600, 680, 2, 12)
    await vi.waitFor(() => expect(panel()).toBeNull())
  })

  it('locked 时拖动、Esc 与点遮罩都不关闭，程序关闭仍有效', async () => {
    await page.viewport(414, 800)
    const open = ref(false)
    const w = harness({ locked: true }, open)
    await openIt(w)
    await drag(600, 760, 6, 40)
    await new Promise(resolve => setTimeout(resolve, 300))
    expect(panel()).toBeTruthy()
    expect(panel()!.style.transform).toBe('')
    expect(
      panel()!.querySelector('[data-hn-sheet-grip] [aria-hidden]')?.getAttribute('data-disabled'),
    ).toBe('')
    await userEvent.keyboard('{Escape}')
    await new Promise(resolve => setTimeout(resolve, 200))
    expect(panel()).toBeTruthy()
    open.value = false
    await vi.waitFor(() => expect(panel()).toBeNull())
  })
})
