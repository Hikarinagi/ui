import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import { page, userEvent } from '@vitest/browser/context'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import Dialog from './dialog/Dialog.vue'
import Popover from './popover/Popover.vue'
import Toaster from './toast/Toaster.vue'
import Button from './button/Button.vue'
import { toast, toastState } from './toast/store'
import '../../test/browser.css'

let mounted: VueWrapper[] = []

beforeEach(() => {
  document.body.innerHTML = ''
  toastState.items.splice(0)
})

afterEach(() => {
  mounted.forEach(w => w.unmount())
  mounted = []
})

function harness() {
  const host = document.createElement('div')
  document.body.appendChild(host)
  const w = mount(
    defineComponent({
      setup: () => () =>
        h('div', { style: 'padding: 120px' }, [
          h(Toaster),
          h(
            Dialog,
            { title: '外层对话框' },
            {
              default: () => h(Button, { variant: 'outline', tone: 'neutral' }, () => '开A'),
              content: () => [
                h(
                  Popover,
                  {},
                  {
                    default: () => h(Button, { variant: 'soft', tone: 'neutral' }, () => '开P'),
                    content: () => h('p', '嵌套面板内容'),
                  },
                ),
                h(
                  Dialog,
                  { title: '内层对话框' },
                  {
                    default: () => h(Button, { variant: 'soft', tone: 'neutral' }, () => '开B'),
                    content: () => h('p', '内层正文'),
                  },
                ),
              ],
            },
          ),
        ]),
    }),
    { attachTo: host },
  )
  mounted.push(w)
  return w
}

const dialogs = () => [...document.querySelectorAll('[role="dialog"]')] as HTMLElement[]
const popover = () => document.querySelector('.hn-anim-pop[data-side]') as HTMLElement | null

function topAt(el: HTMLElement) {
  const r = el.getBoundingClientRect()
  const hit = document.elementFromPoint(r.left + r.width / 2, r.top + Math.min(r.height / 2, 40))
  return hit && el.contains(hit)
}

describe('浮层嵌套 · z 不取号,栈序自动', () => {
  it('对话框里开驻留面板:同 z 100,后开者靠 DOM 序压上;Esc 逐层收', async () => {
    await page.viewport(1024, 720)
    const w = harness()
    await userEvent.click(w.find('button').element as HTMLElement)
    await vi.waitFor(() => expect(dialogs().length).toBe(1))
    const panelA = dialogs()[0]!

    await userEvent.click(
      [...panelA.querySelectorAll('button')].find(b => b.textContent === '开P')!,
    )
    await vi.waitFor(() => expect(popover()).toBeTruthy())
    const panelP = popover()!

    expect(getComputedStyle(panelA.parentElement!).zIndex).toBe('100')
    expect(getComputedStyle(panelP).zIndex).toBe('100')
    await vi.waitFor(() => expect(topAt(panelP)).toBe(true))

    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(popover()).toBeNull())
    expect(dialogs().length).toBe(1)

    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(dialogs().length).toBe(0))
  })

  it('对话框套对话框:内层后挂载恒在上,先开的不压新开的', async () => {
    await page.viewport(1024, 720)
    const w = harness()
    await userEvent.click(w.find('button').element as HTMLElement)
    await vi.waitFor(() => expect(dialogs().length).toBe(1))

    await userEvent.click(
      [...dialogs()[0]!.querySelectorAll('button')].find(b => b.textContent === '开B')!,
    )
    await vi.waitFor(() => expect(dialogs().length).toBe(2))

    const [panelA, panelB] = dialogs() as [HTMLElement, HTMLElement]
    expect(panelB.textContent).toContain('内层对话框')
    expect(panelA.compareDocumentPosition(panelB) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    await vi.waitFor(() => expect(topAt(panelB)).toBe(true))

    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(dialogs().length).toBe(1))
    expect(dialogs()[0]!.textContent).toContain('外层对话框')
  })

  it('toast 恒顶:Toaster 先挂载,模态后开也压不过 110 档', async () => {
    await page.viewport(1024, 720)
    const w = harness()
    toast.info('先来的通知', { duration: 0 })
    await vi.waitFor(() => expect(document.querySelector('ol[tabindex] li')).toBeTruthy())

    await userEvent.click(w.find('button').element as HTMLElement)
    await vi.waitFor(() => expect(dialogs().length).toBe(1))

    const viewport = document.querySelector('ol[tabindex]') as HTMLElement
    expect(getComputedStyle(viewport).zIndex).toBe('110')
    expect(getComputedStyle(dialogs()[0]!.parentElement!).zIndex).toBe('100')
    expect(
      viewport.compareDocumentPosition(dialogs()[0]!) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
  })
})
