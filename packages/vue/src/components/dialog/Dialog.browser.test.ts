import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import { page, userEvent } from '@vitest/browser/context'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, ref, type Ref, type VNodeChild } from 'vue'
import Dialog from './Dialog.vue'
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

type DialogSlots = Partial<{
  icon: () => VNodeChild
  title: () => VNodeChild
  content: (props: { close: () => void }) => VNodeChild
  footer: (props: { close: () => void }) => VNodeChild
}>

function harness(
  dialogProps: Record<string, unknown> = {},
  open?: Ref<boolean>,
  content: () => ReturnType<typeof h> = () => h('p', '正文内容'),
  slots: DialogSlots = {},
) {
  const host = document.createElement('div')
  document.body.appendChild(host)
  const w = mount(
    defineComponent({
      setup: () => () => {
        const bound: Record<string, unknown> & { title: string } = {
          title: '删除条目',
          description: '此操作不可撤销。',
          ...dialogProps,
        }
        if (open) {
          bound.open = open.value
          bound['onUpdate:open'] = (v: boolean) => (open.value = v)
        }
        return h(
          'div',
          { style: 'padding: 120px' },
          h(Dialog, bound, {
            default: () => h(Button, { variant: 'outline', tone: 'neutral' }, () => '打开'),
            content,
            footer: () => h(Button, { tone: 'danger' }, () => '确认删除'),
            ...slots,
          }),
        )
      },
    }),
    { attachTo: host },
  )
  mounted.push(w)
  return w
}

const panel = () => document.querySelector('[role="dialog"]') as HTMLElement | null
const scrim = () => document.querySelector('.hn-scrim') as HTMLElement | null

describe('dialog · 大面积浮层', () => {
  it('打开进 Portal:scrim + 第三海拔卡面,slow 档 modal 动效,a11y 关联齐全,锁滚', async () => {
    const w = harness()
    expect(panel()).toBeNull()

    await userEvent.click(w.find('button').element as HTMLElement)
    await vi.waitFor(() => expect(panel()).toBeTruthy())

    const content = panel()!
    expect(content.textContent).toContain('正文内容')
    expect(content.dataset.state).toBe('open')

    const labelId = content.getAttribute('aria-labelledby')!
    expect(document.getElementById(labelId)!.textContent).toBe('删除条目')
    const descId = content.getAttribute('aria-describedby')!
    expect(document.getElementById(descId)!.textContent).toBe('此操作不可撤销。')

    const probe = document.createElement('span')
    probe.style.backgroundColor = 'var(--hn-surface)'
    document.body.appendChild(probe)
    const style = getComputedStyle(content)
    expect(style.backgroundColor).toBe(getComputedStyle(probe).backgroundColor)
    expect(style.boxShadow).not.toBe('none')
    expect(content.className).toContain('hn-anim-modal')
    expect(style.animationDuration).toBe('0.45s')

    const overlay = scrim()!
    expect(overlay).toBeTruthy()
    const overlayStyle = getComputedStyle(overlay)
    expect(overlayStyle.backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
    expect(overlayStyle.position).toBe('fixed')
    expect(overlayStyle.zIndex).toBe('100')

    expect(document.body.style.pointerEvents).toBe('none')
    expect(document.body.style.overflow).toBe('hidden')
    expect(content.contains(document.activeElement)).toBe(true)

    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(panel()).toBeNull())
  })

  it('Esc 关且焦点归还触发器;关闭钮带无障碍名;点外也能关', async () => {
    const w = harness()
    const trigger = w.find('button').element as HTMLElement
    await userEvent.click(trigger)
    await vi.waitFor(() => expect(panel()).toBeTruthy())

    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(panel()).toBeNull())
    expect(document.activeElement).toBe(trigger)
    expect(document.body.style.overflow).toBe('')

    await userEvent.click(trigger)
    await vi.waitFor(() => expect(panel()).toBeTruthy())
    const close = panel()!.querySelector('[aria-label="关闭"]') as HTMLElement
    expect(close).toBeTruthy()
    await userEvent.click(close)
    await vi.waitFor(() => expect(panel()).toBeNull())

    await userEvent.click(trigger)
    await vi.waitFor(() => expect(panel()).toBeTruthy())
    await userEvent.click(scrim()!, { force: true, position: { x: 4, y: 4 } })
    await vi.waitFor(() => expect(panel()).toBeNull())
  })

  it('超高内容:面板不出视口,头脚钉住,正文在 ScrollArea 里滚', async () => {
    await page.viewport(1024, 720)
    const w = harness({}, undefined, () => h('div', { style: 'height: 200vh' }, '很长的正文'))
    await userEvent.click(w.find('button').element as HTMLElement)
    await vi.waitFor(() => expect(panel()).toBeTruthy())

    const content = panel()!
    expect(content.getBoundingClientRect().height).toBeLessThanOrEqual(window.innerHeight)

    const area = content.querySelector('.hn-scroll-area') as HTMLElement
    expect(area).toBeTruthy()
    await vi.waitFor(() => {
      const scroller = [...area.querySelectorAll('*')].find(el => {
        const o = getComputedStyle(el).overflowY
        return (o === 'scroll' || o === 'auto') && el.scrollHeight > el.clientHeight + 1
      })
      expect(scroller).toBeTruthy()
    })
    expect(area.scrollHeight).toBeLessThanOrEqual(area.clientHeight + 1)

    const footerBtn = [...content.querySelectorAll('button')].at(-1)!
    const rect = footerBtn.getBoundingClientRect()
    expect(rect.bottom).toBeLessThanOrEqual(window.innerHeight)
    expect(rect.height).toBeGreaterThan(0)
  })

  it('locked:Esc 与点外失效,X 可见但禁用不卸载;程序化关闭不受限', async () => {
    const open = ref(false)
    const w = harness({ locked: true }, open)
    await userEvent.click(w.find('button').element as HTMLElement)
    await vi.waitFor(() => expect(panel()).toBeTruthy())

    await userEvent.keyboard('{Escape}')
    await new Promise(r => setTimeout(r, 350))
    expect(panel()).toBeTruthy()

    await userEvent.click(scrim()!, { force: true, position: { x: 4, y: 4 } })
    await new Promise(r => setTimeout(r, 350))
    expect(panel()).toBeTruthy()

    const close = panel()!.querySelector('[aria-label="关闭"]') as HTMLButtonElement
    expect(close).toBeTruthy()
    expect(close.disabled).toBe(true)

    open.value = false
    await w.vm.$forceUpdate()
    await vi.waitFor(() => expect(panel()).toBeNull())
  })

  it('size 三档:lg 拿到 576px 上限', async () => {
    await page.viewport(1024, 720)
    const w = harness({ size: 'lg' })
    await userEvent.click(w.find('button').element as HTMLElement)
    await vi.waitFor(() => expect(panel()).toBeTruthy())
    expect(getComputedStyle(panel()!).maxWidth).toBe('576px')
  })

  it('placement 显式 bottom:浮底留白、四角圆角保留、sheet 动画', async () => {
    await page.viewport(1024, 720)
    const w = harness({ placement: 'bottom' })
    await userEvent.click(w.find('button').element as HTMLElement)
    await vi.waitFor(() => expect(panel()).toBeTruthy())

    const style = getComputedStyle(panel()!)
    expect(style.animationName).toBe('hn-sheet-in')
    expect(style.borderBottomLeftRadius).toBe('8px')
    expect(style.borderTopLeftRadius).toBe('8px')
    await vi.waitFor(() =>
      expect(Math.round(panel()!.getBoundingClientRect().bottom)).toBe(window.innerHeight - 16),
    )
  })

  it('placement 未指定:窄屏自动贴底全宽,宽屏居中', async () => {
    await page.viewport(430, 780)
    const w = harness()
    await userEvent.click(w.find('button').element as HTMLElement)
    await vi.waitFor(() => expect(panel()).toBeTruthy())

    const style = getComputedStyle(panel()!)
    expect(style.animationName).toBe('hn-sheet-in')
    expect(style.maxWidth).toBe('none')
    await vi.waitFor(() =>
      expect(Math.round(panel()!.getBoundingClientRect().bottom)).toBe(window.innerHeight - 16),
    )
    expect(Math.round(panel()!.getBoundingClientRect().width)).toBe(window.innerWidth - 32)

    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(panel()).toBeNull())

    await page.viewport(1024, 720)
    await userEvent.click(w.find('button').element as HTMLElement)
    await vi.waitFor(() => expect(panel()).toBeTruthy())
    expect(getComputedStyle(panel()!).animationName).toBe('hn-modal-in')
    expect(getComputedStyle(panel()!).maxWidth).toBe('448px')
  })

  it('v-model:open 受控,外部置 false 收回', async () => {
    const open = ref(false)
    const w = harness({}, open)
    await userEvent.click(w.find('button').element as HTMLElement)
    await vi.waitFor(() => expect(open.value).toBe(true))

    open.value = false
    await w.vm.$forceUpdate()
    await vi.waitFor(() => expect(panel()).toBeNull())
  })
})

describe('dialog · 标题插槽', () => {
  it('自定义标题关联到弹窗名称，装饰图标不参与命名，标题可响应更新', async () => {
    const title = ref('自定义标题')
    const w = harness({}, undefined, undefined, {
      icon: () => h('svg', { 'data-test-icon': '', viewBox: '0 0 24 24' }, h('title', '装饰图标')),
      title: () => h('span', title.value),
    })
    await userEvent.click(w.find('button').element as HTMLElement)
    await vi.waitFor(() => expect(panel()).toBeTruthy())
    const label = document.getElementById(panel()!.getAttribute('aria-labelledby')!)!
    expect(label.tagName).toBe('H2')
    expect(label.textContent).toBe('自定义标题')
    expect(panel()!.querySelector('[data-test-icon]')!.closest('[aria-hidden="true"]')).toBeTruthy()
    await expect
      .element(page.getByRole('dialog', { name: '自定义标题', exact: true }))
      .toBeVisible()
    title.value = '更新后的标题'
    await vi.waitFor(() => expect(label.textContent).toBe('更新后的标题'))
    await expect
      .element(page.getByRole('dialog', { name: '更新后的标题', exact: true }))
      .toBeVisible()
  })
})
