import { describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { render } from 'vitest-browser-react'
import type { ReactNode } from 'react'
import { Textarea, type TextareaProps } from './Textarea'
import { Input } from '../input/Input'
import '../../../test/browser.css'

function attach() {
  const host = document.createElement('div')
  host.style.width = '320px'
  document.body.appendChild(host)
  return host
}

async function mountIn(ui: ReactNode) {
  const host = attach()
  await render(ui, { container: host })
  return host.firstElementChild as HTMLElement
}

async function mountArea(props: TextareaProps = {}) {
  const root = await mountIn(<Textarea aria-label="简介" {...props} />)
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
  it('单行时三档高度与 Input 逐档相等', async () => {
    for (const size of ['sm', 'md', 'lg'] as const) {
      const input = await mountIn(<Input size={size} aria-label={size} />)
      const { root } = await mountArea({ size, rows: 1 })
      expect(root.offsetHeight).toBe(input.offsetHeight)
    }
  })

  it('聚焦时 accent 环从边缘长出，落在容器上，与 Input 同一条规则', async () => {
    const { root, field } = await mountArea()
    const rest = getComputedStyle(root).boxShadow
    await userEvent.click(field)
    await vi.waitFor(() =>
      expect(getComputedStyle(root).boxShadow).toBe(
        rest.replace('0px 0px 0px 0px', '0px 0px 0px 2px'),
      ),
    )
  })

  it('invalid 聚焦时环收成 1px，与 Input 同一条规则', async () => {
    const input = await mountIn(<Input invalid aria-label="input" />)
    const { root, field } = await mountArea({ invalid: true })
    await userEvent.click(input)
    await vi.waitFor(() => expect(getComputedStyle(input).boxShadow).toContain('0px 0px 0px 1px'))
    const reference = getComputedStyle(input).boxShadow
    await userEvent.click(field)
    await vi.waitFor(() => expect(getComputedStyle(root).boxShadow).toBe(reference))
  })

  it('点击文字之外的空白也聚焦并把光标放到末尾', async () => {
    const { root, field } = await mountArea({ defaultValue: '一', rows: 2 })
    root.style.height = '200px'
    await userEvent.click(root, { position: { x: 100, y: 180 } })
    expect(document.activeElement).toBe(field)
    expect(field.selectionStart).toBe(1)
  })
})

describe.each(['primary', 'secondary', 'bare'] as const)(
  'textarea %s · 滚动归 ScrollArea',
  variant => {
    it('固定行数时内容超出在框内滚动，textarea 自身不滚', async () => {
      const { root, field } = await mountArea({
        variant,
        rows: 3,
        defaultValue: '一\n二\n三\n四\n五\n六',
      })
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
      const { root, field } = await mountArea({ variant, autosize: { minRows: 2, maxRows: 4 } })
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
        expect(viewport.scrollTop + viewport.clientHeight).toBeGreaterThanOrEqual(
          caretBottom(field),
        ),
      )

      await userEvent.keyboard('{ControlOrMeta>}a{/ControlOrMeta}{Backspace}')
      await vi.waitFor(() => expect(root.offsetHeight).toBe(two))
    })
  },
)
