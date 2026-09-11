import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import { page, userEvent } from '@vitest/browser/context'
import { mount, type VueWrapper } from '@vue/test-utils'
import {
  createCommentVNode,
  defineComponent,
  h,
  reactive,
  ref,
  type Ref,
  type VNodeChild,
} from 'vue'
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
  body: (props: { close: () => void }) => VNodeChild
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

  it.each([
    ['sm', 384],
    ['md', 448],
    ['lg', 576],
    ['xl', 672],
    ['2xl', 896],
  ] as const)('size=%s 最大宽度为 %s px', async (size, pixels) => {
    await page.viewport(1280, 720)
    const w = harness({ size })
    await userEvent.click(w.find('button').element as HTMLElement)
    await vi.waitFor(() => expect(panel()).toBeTruthy())
    expect(getComputedStyle(panel()!).maxWidth).toBe(pixels + 'px')
    await vi.waitFor(() => expect(Math.round(panel()!.getBoundingClientRect().width)).toBe(pixels))
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

describe('dialog · 头部显示', () => {
  it('无 header 时保留隐藏名称与说明，正文从正常内边距开始，没有头部或关闭按钮占位', async () => {
    const w = harness({ header: false }, undefined, undefined, {
      icon: () => h('span', '不应显示的图标'),
      title: () => h('span', '不应显示的标题'),
      footer: ({ close }) => h(Button, { onClick: close }, () => '关闭正文'),
    })
    const trigger = w.find('button').element as HTMLElement
    await userEvent.click(trigger)
    await vi.waitFor(() => expect(panel()).toBeTruthy())
    const root = panel()!
    const label = document.getElementById(root.getAttribute('aria-labelledby')!)!
    const description = document.getElementById(root.getAttribute('aria-describedby')!)!
    expect(label.textContent).toBe('删除条目')
    expect(description.textContent?.trim()).toBe('此操作不可撤销。')
    expect(getComputedStyle(label).position).toBe('absolute')
    expect(getComputedStyle(label).width).toBe('1px')
    expect(getComputedStyle(description).position).toBe('absolute')
    expect(root.querySelector('[aria-label="关闭"]')).toBeNull()
    expect(root.textContent).not.toContain('不应显示')
    await expect.element(page.getByRole('dialog', { name: '删除条目', exact: true })).toBeVisible()
    const area = root.querySelector('.hn-scroll-area')!
    await vi.waitFor(() => {
      const offset = area.getBoundingClientRect().top - root.getBoundingClientRect().top
      expect(
        Math.abs(offset - root.clientTop - parseFloat(getComputedStyle(root).paddingTop)),
      ).toBeLessThan(1)
    })
    await userEvent.click(page.getByRole('button', { name: '关闭正文' }))
    await vi.waitFor(() => expect(panel()).toBeNull())
    expect(document.activeElement).toBe(trigger)
  })

  it.each([false, true])('closable=false 隐藏按钮，Esc 和点外只受 locked=%s 控制', async locked => {
    const open = ref(false)
    const w = harness({ closable: false, locked }, open)
    const trigger = w.find('button').element as HTMLElement
    await userEvent.click(trigger)
    await vi.waitFor(() => expect(panel()).toBeTruthy())
    expect(panel()!.querySelector('[aria-label="关闭"]')).toBeNull()
    expect(getComputedStyle(panel()!.querySelector('h2')!).position).not.toBe('absolute')
    await userEvent.keyboard('{Escape}')
    if (locked) {
      expect(open.value).toBe(true)
    } else {
      await vi.waitFor(() => expect(panel()).toBeNull())
      await userEvent.click(trigger)
      await vi.waitFor(() => expect(panel()).toBeTruthy())
    }
    await userEvent.click(scrim()!, { force: true, position: { x: 4, y: 4 } })
    await vi.waitFor(() => expect(open.value).toBe(locked))
    if (locked) {
      open.value = false
      await vi.waitFor(() => expect(panel()).toBeNull())
    }
  })

  it('动态显示头部和说明时关联始终有效，无说明时不留下悬空 aria-describedby', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    try {
      const props = reactive({
        header: false,
        closable: false,
        description: undefined as string | undefined,
      })
      const w = harness(props)
      await userEvent.click(w.find('button').element as HTMLElement)
      await vi.waitFor(() => expect(panel()).toBeTruthy())
      expect(panel()!.hasAttribute('aria-describedby')).toBe(false)
      expect(warn).not.toHaveBeenCalled()
      props.description = '新的说明'
      await vi.waitFor(() => {
        expect(
          document.getElementById(panel()!.getAttribute('aria-describedby')!)?.textContent?.trim(),
        ).toBe('新的说明')
      })
      props.header = true
      props.closable = true
      await vi.waitFor(() => expect(panel()!.querySelector('[aria-label="关闭"]')).toBeTruthy())
      expect(getComputedStyle(panel()!.querySelector('h2')!).position).not.toBe('absolute')
      props.description = undefined
      await vi.waitFor(() => expect(panel()!.hasAttribute('aria-describedby')).toBe(false))
    } finally {
      warn.mockRestore()
    }
  })
})

describe('dialog · 自定义 body', () => {
  it('接管内部布局且没有额外留白或滚动包装，保留名称、焦点约束与关闭回焦', async () => {
    await page.viewport(1024, 480)
    const w = harness({}, undefined, undefined, {
      title: () => h('span', '被替换的标题'),
      body: ({ close }) =>
        h(
          'section',
          {
            'data-test-body': '',
            style: 'height:700px;min-height:0;display:flex;flex-direction:column',
          },
          [
            h('button', { 'data-test-first': '', style: 'flex-shrink:0' }, '首个按钮'),
            h(
              'div',
              { 'data-test-scroll': '', style: 'overflow:auto;min-height:0' },
              h('div', { style: 'height:1200px' }, '自定义正文'),
            ),
            h(
              'button',
              { 'data-test-last': '', style: 'flex-shrink:0', onClick: close },
              '关闭正文',
            ),
          ],
        ),
    })
    const trigger = w.find('button').element as HTMLElement
    await userEvent.click(trigger)
    await vi.waitFor(() => expect(panel()).toBeTruthy())
    const root = panel()!
    expect(root.textContent).not.toContain('被替换的标题')
    expect(root.textContent).not.toContain('确认删除')
    expect(root.textContent).not.toContain('正文内容')
    expect(root.querySelector('[aria-label="关闭"]')).toBeNull()
    expect(root.querySelector('.hn-scroll-area')).toBeNull()
    expect(getComputedStyle(root).padding).toBe('0px')
    expect(parseFloat(getComputedStyle(root).rowGap) || 0).toBe(0)
    await expect.element(page.getByRole('dialog', { name: '删除条目', exact: true })).toBeVisible()
    expect(
      getComputedStyle(document.getElementById(root.getAttribute('aria-labelledby')!)!).position,
    ).toBe('absolute')
    const body = root.querySelector('[data-test-body]')!
    const scroll = root.querySelector('[data-test-scroll]')!
    await vi.waitFor(() => {
      expect(
        Math.abs(
          body.getBoundingClientRect().left - root.getBoundingClientRect().left - root.clientLeft,
        ),
      ).toBeLessThan(1)
      expect(
        Math.abs(
          body.getBoundingClientRect().top - root.getBoundingClientRect().top - root.clientTop,
        ),
      ).toBeLessThan(1)
      expect(root.getBoundingClientRect().height).toBeLessThanOrEqual(448)
      expect(scroll.scrollHeight).toBeGreaterThan(scroll.clientHeight)
    })
    scroll.scrollTop = 100
    expect(scroll.scrollTop).toBe(100)
    const first = root.querySelector('[data-test-first]') as HTMLElement
    const last = root.querySelector('[data-test-last]') as HTMLElement
    first.focus()
    await userEvent.keyboard('{Shift>}{Tab}{/Shift}')
    expect(document.activeElement).toBe(last)
    await userEvent.keyboard('{Tab}')
    expect(document.activeElement).toBe(first)
    await userEvent.click(last)
    await vi.waitFor(() => expect(panel()).toBeNull())
    expect(document.activeElement).toBe(trigger)
    expect(document.body.style.overflow).toBe('')
  })

  it('locked 阻止 body 模式的 Esc 与点外关闭，但插槽 close 仍可关闭', async () => {
    const open = ref(false)
    const w = harness({ locked: true }, open, undefined, {
      body: ({ close }) => h(Button, { onClick: close }, () => '程序关闭'),
    })
    await userEvent.click(w.find('button').element as HTMLElement)
    await vi.waitFor(() => expect(panel()).toBeTruthy())
    await userEvent.keyboard('{Escape}')
    expect(open.value).toBe(true)
    await userEvent.click(scrim()!, { force: true, position: { x: 4, y: 4 } })
    expect(open.value).toBe(true)
    await userEvent.click(page.getByRole('button', { name: '程序关闭' }))
    await vi.waitFor(() => expect(open.value).toBe(false))
  })

  it('空 body 不回退默认布局，动态添加或移除插槽不会重建弹窗', async () => {
    const slots = reactive<DialogSlots>({ body: () => createCommentVNode('empty') })
    const w = harness({}, undefined, undefined, slots)
    await userEvent.click(w.find('button').element as HTMLElement)
    await vi.waitFor(() => expect(panel()).toBeTruthy())
    const root = panel()!
    expect(root.querySelector('.hn-scroll-area')).toBeNull()
    expect(root.textContent).not.toContain('正文内容')
    slots.body = () => h('p', '新的 body')
    await vi.waitFor(() => expect(root.textContent).toContain('新的 body'))
    delete slots.body
    await vi.waitFor(() => expect(root.textContent).toContain('正文内容'))
    expect(panel()).toBe(root)
    expect(root.querySelector('[aria-label="关闭"]')).toBeTruthy()
    expect(getComputedStyle(root.querySelector('h2')!).position).not.toBe('absolute')
    slots.body = () => h('p', '再次接管')
    await vi.waitFor(() => expect(root.textContent).toContain('再次接管'))
    expect(root.querySelector('.hn-scroll-area')).toBeNull()
    expect(getComputedStyle(root).padding).toBe('0px')
    expect(panel()).toBe(root)
  })
})

describe('dialog · 宽度边界', () => {
  it.each([undefined, 'center', 'bottom'] as const)(
    '2xl 在窄屏 placement=%s 时仍保留视口留白',
    async placement => {
      await page.viewport(430, 780)
      const w = harness({ size: '2xl', placement })
      await userEvent.click(w.find('button').element as HTMLElement)
      await vi.waitFor(() => expect(panel()).toBeTruthy())
      await vi.waitFor(() => {
        const rect = panel()!.getBoundingClientRect()
        expect(Math.round(rect.width)).toBe(398)
        expect(Math.round(rect.left)).toBe(16)
        expect(Math.round(rect.right)).toBe(414)
      })
    },
  )

  it.each([
    ['max-w-[40rem]', 640],
    ['max-w-[52rem]', 832],
  ] as const)('class=%s 可覆盖大尺寸预设且不破坏窄屏宽度', async (className, pixels) => {
    await page.viewport(1280, 720)
    const w = harness({ size: '2xl', class: className })
    await userEvent.click(w.find('button').element as HTMLElement)
    await vi.waitFor(() => expect(panel()).toBeTruthy())
    expect(getComputedStyle(panel()!).maxWidth).toBe(pixels + 'px')
    await vi.waitFor(() => expect(Math.round(panel()!.getBoundingClientRect().width)).toBe(pixels))
    await page.viewport(430, 780)
    await vi.waitFor(() => expect(Math.round(panel()!.getBoundingClientRect().width)).toBe(398))
  })
})
