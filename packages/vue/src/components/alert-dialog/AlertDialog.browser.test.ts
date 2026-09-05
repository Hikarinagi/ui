import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import { userEvent } from '@vitest/browser/context'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, ref, type Ref } from 'vue'
import AlertDialog from './AlertDialog.vue'
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

function harness(
  props: Record<string, unknown> = {},
  open?: Ref<boolean>,
  options: { trigger?: boolean; quiet?: boolean } = {},
) {
  const host = document.createElement('div')
  document.body.appendChild(host)
  const w = mount(
    defineComponent({
      setup: () => () => {
        const bound: Record<string, unknown> & { title: string } = {
          title: '删除条目',
          description: '此操作不可撤销。',
          ...props,
        }
        if (open) {
          bound.open = open.value
          bound['onUpdate:open'] = (value: boolean) => (open.value = value)
        }
        return h(
          'div',
          { style: 'padding: 120px' },
          h(
            AlertDialog,
            bound,
            options.trigger === false
              ? {}
              : { default: () => h(Button, { variant: 'outline', tone: 'neutral' }, () => '删除') },
          ),
        )
      },
    }),
    {
      attachTo: host,
      global: options.quiet ? { config: { errorHandler: () => {} } } : undefined,
    },
  )
  mounted.push(w)
  return w
}

const panel = () => document.querySelector('[role="alertdialog"]') as HTMLElement | null
const scrim = () => document.querySelector('.hn-scrim') as HTMLElement | null
const button = (text: string) =>
  [...panel()!.querySelectorAll('button')].find(b => b.textContent?.trim() === text)!

async function openIt(w: VueWrapper) {
  const trigger = w.find('button').element as HTMLElement
  await userEvent.click(trigger)
  await vi.waitFor(() => expect(panel()).toBeTruthy())
  return trigger
}

function settle(ms = 150) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

describe('AlertDialog', () => {
  it('打开后是 alertdialog，标题与说明关联齐全，焦点落在取消钮，没有关闭钮', async () => {
    const w = harness()
    await openIt(w)
    const content = panel()!
    const labelId = content.getAttribute('aria-labelledby')!
    expect(document.getElementById(labelId)!.textContent).toBe('删除条目')
    const descId = content.getAttribute('aria-describedby')!
    expect(document.getElementById(descId)!.textContent).toBe('此操作不可撤销。')
    expect(content.querySelector('[aria-label="关闭"]')).toBeNull()
    expect(content.querySelectorAll('button')).toHaveLength(2)
    expect(document.activeElement).toBe(button('取消'))
    expect(content.className).toContain('hn-anim-modal')
    expect(scrim()).toBeTruthy()
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('点遮罩不关闭；Esc 与取消关闭并归还焦点，取消触发 cancel 事件', async () => {
    const onCancel = vi.fn()
    const w = harness({ onCancel })
    const trigger = await openIt(w)

    await userEvent.click(scrim()!, { force: true, position: { x: 4, y: 4 } })
    await settle()
    expect(panel()).toBeTruthy()

    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(panel()).toBeNull())
    expect(document.activeElement).toBe(trigger)

    await openIt(w)
    await userEvent.click(button('取消'))
    await vi.waitFor(() => expect(panel()).toBeNull())
    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(document.activeElement).toBe(trigger)
  })

  it('确定调用处理函数后关闭', async () => {
    const onConfirm = vi.fn()
    const w = harness({ onConfirm, confirmText: '删除' })
    await openIt(w)
    await userEvent.click(button('删除'))
    await vi.waitFor(() => expect(panel()).toBeNull())
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('异步确定期间忙碌：确定钮加载、取消禁用、Esc 无效，完成后才关闭', async () => {
    let finish!: () => void
    const onConfirm = vi.fn(() => new Promise<void>(resolve => (finish = resolve)))
    const w = harness({ onConfirm })
    await openIt(w)
    await userEvent.click(button('确定'))
    await vi.waitFor(() => expect(panel()!.getAttribute('aria-busy')).toBe('true'))
    expect(button('取消').disabled).toBe(true)
    await userEvent.keyboard('{Escape}')
    await settle()
    expect(panel()).toBeTruthy()
    finish()
    await vi.waitFor(() => expect(panel()).toBeNull())
  })

  it('处理函数失败时保持打开并退出忙碌', async () => {
    const onConfirm = vi.fn(() => Promise.reject(new Error('失败')))
    const w = harness({ onConfirm }, undefined, { quiet: true })
    await openIt(w)
    await userEvent.click(button('确定'))
    await settle(300)
    expect(panel()).toBeTruthy()
    expect(panel()!.getAttribute('aria-busy')).toBeNull()
    expect(button('取消').disabled).toBe(false)
  })

  it('tone 为 danger 时确定钮换成危险色', async () => {
    const w = harness({ tone: 'danger' })
    await openIt(w)
    const probe = document.createElement('span')
    probe.className = 'bg-danger'
    document.body.appendChild(probe)
    expect(getComputedStyle(button('确定')).backgroundColor).toBe(
      getComputedStyle(probe).backgroundColor,
    )
  })

  it('受控打开，省略触发器', async () => {
    const open = ref(false)
    harness({}, open, { trigger: false })
    expect(document.querySelector('button')).toBeNull()
    open.value = true
    await vi.waitFor(() => expect(panel()).toBeTruthy())
    await userEvent.click(button('取消'))
    await vi.waitFor(() => expect(panel()).toBeNull())
    expect(open.value).toBe(false)
  })
})
