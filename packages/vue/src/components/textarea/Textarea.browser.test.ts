import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { userEvent } from '@vitest/browser/context'
import { mount, type VueWrapper } from '@vue/test-utils'
import Textarea from './Textarea.vue'
import Input from '../input/Input.vue'
import '../../../test/browser.css'

let mounted: VueWrapper[] = []

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(() => {
  mounted.forEach(w => w.unmount())
  mounted = []
})

function attach() {
  const host = document.createElement('div')
  host.style.width = '320px'
  document.body.appendChild(host)
  return host
}

function mountArea(props: Record<string, unknown> = {}) {
  const w = mount(Textarea, { props, attrs: { 'aria-label': '简介' }, attachTo: attach() })
  mounted.push(w)
  const root = w.element as HTMLElement
  const field = root.querySelector('textarea') as HTMLTextAreaElement
  return { root, field }
}

async function viewportOf(root: HTMLElement) {
  await vi.waitFor(() =>
    expect(root.querySelector('[data-overlayscrollbars-viewport]')).toBeTruthy(),
  )
  return root.querySelector('[data-overlayscrollbars-viewport]') as HTMLElement
}

function caretBottom(field: HTMLTextAreaElement) {
  const style = getComputedStyle(field)
  const line = parseFloat(style.lineHeight)
  const lines = field.value.slice(0, field.selectionEnd).split('\n').length
  return parseFloat(style.paddingTop) + lines * line
}

describe('textarea · 与 Input 同一副输入面', () => {
  it('单行时三档高度与 Input 逐档相等', () => {
    for (const size of ['sm', 'md', 'lg'] as const) {
      const input = mount(Input, {
        props: { size },
        attrs: { 'aria-label': size },
        attachTo: attach(),
      })
      mounted.push(input)
      const { root } = mountArea({ size, rows: 1 })
      expect(root.offsetHeight).toBe((input.element as HTMLElement).offsetHeight)
    }
  })

  it('聚焦时 accent 环从边缘长出，落在容器上，与 Input 同一条规则', async () => {
    const { root, field } = mountArea()
    const rest = getComputedStyle(root).boxShadow
    await userEvent.click(field)
    await vi.waitFor(() =>
      expect(getComputedStyle(root).boxShadow).toBe(
        rest.replace('0px 0px 0px 0px', '0px 0px 0px 2px'),
      ),
    )
  })

  it('invalid 聚焦时环收成 1px，与 Input 同一条规则', async () => {
    const input = mount(Input, {
      props: { invalid: true },
      attrs: { 'aria-label': 'input' },
      attachTo: attach(),
    })
    mounted.push(input)
    const { root, field } = mountArea({ invalid: true })
    await userEvent.click(input.element as HTMLElement)
    await vi.waitFor(() =>
      expect(getComputedStyle(input.element as HTMLElement).boxShadow).toContain('0px 0px 0px 1px'),
    )
    const reference = getComputedStyle(input.element as HTMLElement).boxShadow
    await userEvent.click(field)
    await vi.waitFor(() => expect(getComputedStyle(root).boxShadow).toBe(reference))
  })

  it('点击文字之外的空白也聚焦并把光标放到末尾', async () => {
    const { root, field } = mountArea({ modelValue: '一', rows: 2 })
    root.style.height = '200px'
    await userEvent.click(root, { position: { x: 100, y: 180 } })
    expect(document.activeElement).toBe(field)
    expect(field.selectionStart).toBe(1)
  })
})

describe('textarea · 滚动归 ScrollArea', () => {
  it('固定行数时内容超出在框内滚动，textarea 自身不滚', async () => {
    const { root, field } = mountArea({ rows: 3, modelValue: '一\n二\n三\n四\n五\n六' })
    const three = root.offsetHeight
    const viewport = await viewportOf(root)
    expect(field.offsetHeight).toBeGreaterThan(three)
    expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight)
    expect(getComputedStyle(field).overflowY).toBe('hidden')
    expect(getComputedStyle(root).resize).toBe('vertical')
    viewport.scrollTop = 999
    await vi.waitFor(() => expect(viewport.scrollTop).toBeGreaterThan(0))
    expect(field.scrollTop).toBe(0)
  })

  it('autosize 随内容长高、在 maxRows 封顶后框内滚动且光标始终可见、删行后缩回', async () => {
    const { root, field } = mountArea({ autosize: { minRows: 2, maxRows: 4 } })
    const viewport = await viewportOf(root)
    const line = parseFloat(getComputedStyle(field).lineHeight)
    const two = root.offsetHeight
    expect(getComputedStyle(root).resize).toBe('none')

    await userEvent.click(field)
    await userEvent.keyboard('一{Enter}二{Enter}三')
    await vi.waitFor(() => expect(root.offsetHeight).toBe(two + line))

    await userEvent.keyboard('{Enter}四{Enter}五{Enter}六')
    await vi.waitFor(() => expect(root.offsetHeight).toBe(two + line * 2))
    expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight)
    expect(field.scrollTop).toBe(0)
    await vi.waitFor(() =>
      expect(viewport.scrollTop + viewport.clientHeight).toBeGreaterThanOrEqual(caretBottom(field)),
    )

    await userEvent.keyboard('{Control>}a{/Control}{Backspace}')
    await vi.waitFor(() => expect(root.offsetHeight).toBe(two))
  })
})
